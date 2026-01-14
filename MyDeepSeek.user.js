// ==UserScript==
// @name        MyDeepSeek
// @namespace   Violentmonkey Scripts
// @match       *://example.org/*
// @grant       none
// @version     1.0
// @author      -
// @description 3/31/2025, 11:22:37 AM
// ==/UserScript==
// ==UserScript==
// @name         AvaTarArTs
// @name:en      MyDeepSeek Export
// @namespace    http://tampermonkey.net/
// @version      1.25.0305
// @description  Deepseek Export
// @description:en  The tool for exporting and copying dialogues in Deepseek
// @author       AvaTarArTs
// @license      MIT
// @match        https://chat.deepseek.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-body
// ==/UserScript==

(function() {
    'use strict';

    // Configuration constants
    const BUTTON_ID = 'DS_MarkdownExport';
    const ICON_COPY = '📋';
    const ICON_EXPORT = '💾';
    const ICON_LOADING = '⏳';
    let isProcessing = false;

    // Inject CSS styles for the export UI and toast notifications
    GM_addStyle(`
        #${BUTTON_ID}-container {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 2147483647 !important;
            display: flex !important;
            gap: 8px !important;
        }
        #${BUTTON_ID}, #${BUTTON_ID}-copy {
            padding: 6px 8px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            opacity: 0.6 !important;
            background: none !important;
            border: none !important;
            font-size: 20px !important;
            position: relative !important;
        }
        #${BUTTON_ID}:hover, #${BUTTON_ID}-copy:hover {
            opacity: 1 !important;
            transform: scale(1.1) !important;
        }
        #${BUTTON_ID}[disabled], #${BUTTON_ID}-copy[disabled] {
            cursor: not-allowed !important;
            opacity: 0.5 !important;
        }
        #${BUTTON_ID}:hover::after, #${BUTTON_ID}-copy:hover::after {
            content: attr(data-tooltip) !important;
            position: absolute !important;
            top: 100% !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: rgba(0, 0, 0, 0.8) !important;
            color: #fff !important;
            padding: 4px 8px !important;
            border-radius: 4px !important;
            font-size: 12px !important;
            white-space: nowrap !important;
            z-index: 1000 !important;
        }
        .ds-toast {
            position: fixed !important;
            top: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            color: #fff !important;
            padding: 8px 16px !important;
            border-radius: 4px !important;
            font-size: 14px !important;
            z-index: 2147483647 !important;
            animation: toast-in-out 2s ease !important;
        }
        .ds-toast.error {
            background: rgba(255, 0, 0, 0.8) !important;
        }
        .ds-toast.success {
            background: rgba(0, 128, 0, 0.8) !important;
        }
        @keyframes toast-in-out {
            0%   { opacity: 0; transform: translate(-50%, -20px); }
            20%  { opacity: 1; transform: translate(-50%, 0); }
            80%  { opacity: 1; transform: translate(-50%, 0); }
            100% { opacity: 0; transform: translate(-50%, 20px); }
        }
    `);

    // Selectors for DeepSeek chat elements
    const SELECTORS = {
        MESSAGE: 'dad65929',       // conversation container
        USER_PROMPT: 'fa81',       // user prompt message block
        AI_ANSWER: 'f9bf7997',     // AI answer message block
        AI_THINKING: 'e1675d8b',   // AI "thinking" section within answer
        AI_RESPONSE: 'ds-markdown',// AI answer content section
        TITLE: 'd8ed659a'          // conversation title element
    };

    // Create the Copy and Export buttons in the UI
    function createUI() {
        // Avoid duplicating the UI
        if (document.getElementById(`${BUTTON_ID}-container`)) return;

        // If on the home page (no chat), remove any leftover UI and skip
        if (isHomePage()) {
            const existing = document.getElementById(`${BUTTON_ID}-container`);
            if (existing) existing.remove();
            return;
        }

        // Build container for the buttons
        const container = document.createElement('div');
        container.id = `${BUTTON_ID}-container`;

        // Copy button setup
        const copyBtn = document.createElement('button');
        copyBtn.id = `${BUTTON_ID}-copy`;
        copyBtn.textContent = ICON_COPY;
        copyBtn.setAttribute('data-tooltip', 'Copy');
        copyBtn.onclick = () => handleExport('clipboard');

        // Export button setup
        const exportBtn = document.createElement('button');
        exportBtn.id = BUTTON_ID;
        exportBtn.textContent = ICON_EXPORT;
        exportBtn.setAttribute('data-tooltip', 'Export');
        exportBtn.onclick = () => handleExport('file');

        // Append buttons to container and add to document
        container.append(copyBtn, exportBtn);
        document.body.appendChild(container);
    }

    // Check if the current page is the home screen (no conversation loaded)
    function isHomePage() {
        if (window.location.pathname === '/' || window.location.href === 'https://chat.deepseek.com/') {
            return true;
        }
        // If no conversation content is present, treat as home page
        return !document.querySelector(`.${SELECTORS.MESSAGE}`);
    }

    // Handle export actions (mode: 'file' for download, 'clipboard' for copy)
    async function handleExport(mode) {
        if (isProcessing) return;
        isProcessing = true;

        // Disable buttons and show loading state
        const copyBtn = document.getElementById(`${BUTTON_ID}-copy`);
        const exportBtn = document.getElementById(BUTTON_ID);
        if (copyBtn && exportBtn) {
            copyBtn.disabled = true;
            exportBtn.disabled = true;
            copyBtn.textContent = ICON_LOADING;
            exportBtn.textContent = ICON_LOADING;
        }

        try {
            const conversations = await extractConversations();
            if (!conversations.length) {
                showToast('No conversation content detected', true);
                return;
            }
            const content = formatMarkdown(conversations);
            if (mode === 'file') {
                downloadMarkdown(content);
            } else {
                GM_setClipboard(content, 'text');
                showToast('Copied to clipboard!', false);
            }
        } catch (error) {
            console.error('[Export Error]', error);
            showToast(`Error: ${error.message}`, true);
        } finally {
            // Re-enable buttons and restore icons
            if (copyBtn && exportBtn) {
                copyBtn.disabled = false;
                exportBtn.disabled = false;
                copyBtn.textContent = ICON_COPY;
                exportBtn.textContent = ICON_EXPORT;
            }
            isProcessing = false;
        }
    }

    // Extract all conversation messages from the page into an array
    function extractConversations() {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                const conversations = [];
                const container = document.querySelector(`.${SELECTORS.MESSAGE}`);
                if (!container) {
                    resolve(conversations);
                    return;
                }
                const blocks = container.childNodes;
                blocks.forEach(block => {
                    try {
                        if (block.classList.contains(SELECTORS.USER_PROMPT)) {
                            // User message
                            conversations.push({
                                type: 'user',
                                content: cleanContent(block, 'prompt')
                            });
                        } else if (block.classList.contains(SELECTORS.AI_ANSWER)) {
                            // AI answer (which may include a "thinking" sub-section)
                            const thinkingNode = block.querySelector(`.${SELECTORS.AI_THINKING}`);
                            const responseNode = block.querySelector(`.${SELECTORS.AI_RESPONSE}`);
                            conversations.push({
                                type: 'ai',
                                content: {
                                    thinking: thinkingNode ? cleanContent(thinkingNode, 'thinking') : '',
                                    response: responseNode ? cleanContent(responseNode, 'response') : ''
                                }
                            });
                        }
                    } catch (err) {
                        console.warn('[Conversation parse error]', err);
                    }
                });
                resolve(conversations);
            });
        });
    }

    // Remove unnecessary elements and return clean text/HTML from a node
    function cleanContent(node, type) {
        const clone = node.cloneNode(true);
        // Remove UI elements (buttons, icons, etc.)
        clone.querySelectorAll('button, .ds-flex, .ds-icon, .ds-icon-button, .ds-button, svg')
             .forEach(el => el.remove());
        switch (type) {
            case 'prompt': {
                let text = clone.textContent.replace(/\n{2,}/g, '\n').trim();
                // Escape HTML special characters in user prompt
                return text.replace(/[<>&]/g, m => ({'<':'&lt;','>':'&gt;','&':'&amp;'}[m]));
            }
            case 'thinking':
                // Strip HTML tags and normalize whitespace in "thinking" text
                return clone.innerHTML
                    .replace(/<\/p>/gi, '\n')
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/<\/?[^>]+>/g, '')
                    .replace(/\n+/g, '\n')
                    .trim();
            case 'response':
                // Return raw HTML for the answer (to be converted to Markdown later)
                return clone.innerHTML;
            default:
                return clone.textContent.trim();
        }
    }

    // Format the conversation array into a Markdown string
    function formatMarkdown(conversations) {
        const titleElement = document.querySelector(`.${SELECTORS.TITLE}`);
        const title = titleElement ? titleElement.textContent.trim() : 'DeepSeek Chat';
        let md = `# ${title}\n\n`;
        conversations.forEach((conv, idx) => {
            if (conv.type === 'user') {
                if (idx > 0) md += '\n---\n';  // separator between turns
                const lines = conv.content.split('\n');
                md += `\n> **User:** ${lines.join('\n> ')}\n\n`;
            }
            if (conv.type === 'ai' && conv.content) {
                if (conv.content.thinking) {
                    const thoughts = conv.content.thinking.split('\n');
                    md += `\n> **Assistant (thinking):** ${thoughts.join('\n> ')}\n`;
                }
                if (conv.content.response) {
                    md += `\n${enhancedHtmlToMarkdown(conv.content.response)}\n`;
                }
            }
        });
        return md;
    }

    // Convert HTML content (especially from AI responses) into Markdown
    function enhancedHtmlToMarkdown(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        // Convert code blocks
        tempDiv.querySelectorAll('.md-code-block').forEach(block => {
            const lang = block.querySelector('.md-code-block-infostring')?.textContent.trim() || '';
            const codeText = block.querySelector('pre')?.textContent || '';
            block.replaceWith(`\n\n\`\`\`${lang}\n${codeText}\n\`\`\`\n\n`);
        });
        // Convert inline and block math
        tempDiv.querySelectorAll('.math-inline').forEach(el => {
            el.replaceWith(`$${el.textContent}$`);
        });
        tempDiv.querySelectorAll('.math-display').forEach(el => {
            el.replaceWith(`\n$$\n${el.textContent}\n$$\n`);
        });
        // Recursively convert remaining HTML nodes to Markdown text
        return Array.from(tempDiv.childNodes).map(node => convertNodeToMarkdown(node)).join('').trim();
    }

    // Recursively convert a DOM node to Markdown representation
    function convertNodeToMarkdown(node, level = 0, processed = new WeakSet()) {
        if (!node || processed.has(node)) return '';
        processed.add(node);
        const name = node.nodeName.toUpperCase();
        const handlers = {
            'P': n       => `${processInlineElements(n)}\n`,
            'STRONG': n  => `**${n.textContent}**`,
            'EM': n      => `*${n.textContent}*`,
            'HR': ()     => '\n---\n',
            'BR': ()     => '\n',
            'A': n       => processLinkElement(n),
            'IMG': n     => processImageElement(n),
            'BLOCKQUOTE': n => {
                const content = Array.from(n.childNodes)
                    .map(child => convertNodeToMarkdown(child, level, processed))
                    .join('')
                    .split('\n').filter(line => line.trim())
                    .map(line => `> ${line}`)
                    .join('\n');
                return `\n${content}\n`;
            },
            'UL': n => processListItems(n, level, '-'),
            'OL': n => processListItems(n, level, null, n.getAttribute('start') || 1),
            'PRE': n => `\n\`\`\`\n${n.textContent.trim()}\n\`\`\`\n\n`,
            'CODE': n => `\`${n.textContent.trim()}\``,
            'H1': n   => `# ${processInlineElements(n)}\n`,
            'H2': n   => `## ${processInlineElements(n)}\n`,
            'H3': n   => `### ${processInlineElements(n)}\n`,
            'H4': n   => `#### ${processInlineElements(n)}\n`,
            'H5': n   => `##### ${processInlineElements(n)}\n`,
            'H6': n   => `###### ${processInlineElements(n)}\n`,
            'TABLE': n => processTable(n),
            'DIV': n   => Array.from(n.childNodes).map(child => convertNodeToMarkdown(child, level, processed)).join(''),
            '#TEXT': n => n.textContent.trim()
        };
        return handlers[name] ? handlers[name](node) : handlers['DIV'](node);
    }

    // Process inline formatting within a node (bold, italic, code, links, images)
    function processInlineElements(node) {
        return Array.from(node.childNodes).map(child => {
            if (child.nodeType === Node.TEXT_NODE) {
                return child.textContent.trim();
            }
            if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.matches('strong')) return `**${child.textContent}**`;
                if (child.matches('em'))    return `*${child.textContent}*`;
                if (child.matches('code'))  return `\`${child.textContent}\``;
                if (child.matches('a'))     return processLinkElement(child);
                if (child.matches('img'))   return processImageElement(child);
            }
            return convertNodeToMarkdown(child);
        }).join('');
    }

    // Convert an <img> element to Markdown image syntax
    function processImageElement(img) {
        const alt = img.getAttribute('alt') || '';
        const title = img.getAttribute('title') || '';
        const src = img.getAttribute('src') || '';
        return title ? `![${alt}](${src} "${title}")` : `![${alt}](${src})`;
    }

    // Convert an <a> element to Markdown link syntax
    function processLinkElement(anchor) {
        const href = anchor.getAttribute('href') || '';
        const title = anchor.getAttribute('title') || '';
        const text = Array.from(anchor.childNodes).map(child => convertNodeToMarkdown(child)).join('');
        return title ? `[${text}](${href} "${title}")` : `[${text}](${href})`;
    }

    // Convert a list element (<ul> or <ol>) and its children to Markdown list format
    function processListItems(listNode, level, marker, start = 1) {
        let result = '';
        const indent = '  '.repeat(level);
        Array.from(listNode.children).forEach((li, index) => {
            const prefix = marker ? `${marker} ` : `${Number(start) + index}. `;
            // Main content of list item (excluding nested lists)
            const main = Array.from(li.childNodes)
                .filter(child => child.nodeType === Node.ELEMENT_NODE && !child.matches('ul, ol'))
                .map(child => convertNodeToMarkdown(child, level, new WeakSet()))
                .join('').trim();
            if (main) {
                result += `${indent}${prefix}${main}\n`;
            }
            // Nested lists (if any)
            const nested = li.querySelectorAll(':scope > ul, :scope > ol');
            nested.forEach(subList => {
                result += processListItems(subList, level + 1, subList.tagName === 'UL' ? '-' : null, subList.getAttribute('start') || 1);
            });
        });
        return result;
    }

    // Convert an HTML table into Markdown table format
    function processTable(table) {
        const rows = Array.from(table.querySelectorAll('tr'));
        if (!rows.length) return '';
        const headers = Array.from(rows[0].querySelectorAll('th, td')).map(cell => cell.textContent.trim());
        let mdTable = `\n| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n`;
        for (let i = 1; i < rows.length; i++) {
            const cells = Array.from(rows[i].querySelectorAll('td')).map(cell => processInlineElements(cell));
            mdTable += `| ${cells.join(' | ')} |\n`;
        }
        return mdTable + '\n';
    }

    // Download the given markdown content as a .md file with the chat title as filename
    function downloadMarkdown(content) {
        const titleElement = document.querySelector(`.${SELECTORS.TITLE}`);
        const title = titleElement ? titleElement.textContent.trim() : 'DeepSeek Chat';
        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${title}.md`;
        document.body.appendChild(link);
        link.click();
        // Clean up the temporary link
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }, 1000);
    }

    // Show a transient toast message at the top (green for success, red for error)
    function showToast(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `ds-toast ${isError ? 'error' : 'success'}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        toast.addEventListener('animationend', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }

    // Watch for SPA navigation (URL changes) to rebuild the UI as needed
    function setupUrlChangeListener() {
        let lastUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                const existing = document.getElementById(`${BUTTON_ID}-container`);
                if (existing) existing.remove();
                createUI();
            }
        }, 1000);
        // Monkey-patch history.pushState to catch navigation events
        const pushState = history.pushState;
        history.pushState = function() {
            pushState.apply(history, arguments);
            const existing = document.getElementById(`${BUTTON_ID}-container`);
            if (existing) existing.remove();
            createUI();
        };
    }

    // Monitor DOM changes to add the UI when a conversation loads
    const observer = new MutationObserver(() => createUI());
    observer.observe(document, { childList: true, subtree: true });

    // Initialize on page load
    window.addEventListener('load', () => {
        createUI();
        setupUrlChangeListener();
    });
})();