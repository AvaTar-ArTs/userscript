// ==UserScript==
// @name         2Universal AI Conversation & GPT Exporter
// @namespace    http://tampermonkey.net/
// @version      3.1.0
// @description  Comprehensive AI conversation and GPT configuration exporter with cross-platform intelligence
// @author       Enhanced by Claude
// @match        https://chatgpt.com/*
// @match        https://yuanbao.tencent.com/*
// @match        https://chat.deepseek.com/*
// @match        https://claude.ai/*
// @match        https://bard.google.com/*
// @match        https://chat.anthropic.com/*
// @grant        GM_setClipboard
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ═══════════════════════════════════════════════════════════════
    // PLATFORM CONFIGURATIONS - Digital Ecosystem Architecture
    // ═══════════════════════════════════════════════════════════════
    
    const PLATFORMS = {
        'chatgpt.com': {
            name: 'ChatGPT',
            emoji: '🤖',
            capabilities: ['conversations', 'gpts'],
            selectors: {
                conversations: {
                    articles: 'div[data-message-author-role], article',
                    userContent: 'div.whitespace-pre-wrap:not([data-message-author-role="assistant"])',
                    assistantContent: 'div[data-message-author-role="assistant"] div.markdown',
                    copyButton: 'button[aria-label*="Copy"], span[data-state="closed"] button',
                    title: 'title, h1, [data-testid="conversation-title"]'
                },
                gpts: {
                    apiEndpoint: '/public-api/gizmos/discovery/mine',
                    listContainer: '.gizmo-list, .gpts-list',
                    gptItem: '.gizmo-item, .gpt-card'
                }
            },
            colors: { primary: '#10a37f', secondary: '#19c37d', accent: '#0ea5e9' }
        },
        'claude.ai': {
            name: 'Claude',
            emoji: '🎭',
            capabilities: ['conversations'],
            selectors: {
                conversations: {
                    articles: 'div[data-is-streaming], div.font-claude-message',
                    userContent: 'div[data-is-author="true"], div.font-user-message',
                    assistantContent: 'div[data-is-author="false"], div.font-claude-message',
                    copyButton: 'button[aria-label*="Copy"], button.copy-button',
                    title: 'title, .conversation-title, [data-testid="chat-title"]'
                }
            },
            colors: { primary: '#cc785c', secondary: '#d4926f', accent: '#8b5cf6' }
        },
        'chat.deepseek.com': {
            name: 'DeepSeek',
            emoji: '🔍',
            capabilities: ['conversations'],
            selectors: {
                conversations: {
                    articles: 'div[data-role], div.message-item',
                    userContent: 'div[data-role="user"], .user-message',
                    assistantContent: 'div[data-role="assistant"], .assistant-message',
                    copyButton: 'button[aria-label*="copy"], .ds-icon-button',
                    title: 'title, .chat-title, h1'
                }
            },
            colors: { primary: '#667eea', secondary: '#764ba2', accent: '#06b6d4' }
        },
        'yuanbao.tencent.com': {
            name: '元宝',
            emoji: '💎',
            capabilities: ['conversations'],
            selectors: {
                conversations: {
                    articles: 'div.agent-chat__list__item',
                    userContent: 'div.hyc-content-text',
                    assistantContent: 'div.agent-chat__content',
                    copyButton: 'div.agent-chat__toolbar__item.agent-chat__toolbar__copy',
                    title: 'span.agent-dialogue__content--common__header__name__title'
                }
            },
            colors: { primary: '#1890ff', secondary: '#40a9ff', accent: '#f59e0b' }
        }
    };

    // ═══════════════════════════════════════════════════════════════
    // UNIFIED EXPORTER ENGINE - The Digital Archaeologist
    // ═══════════════════════════════════════════════════════════════

    class UniversalAIExporter {
        constructor() {
            this.platform = this.detectPlatform();
            this.config = PLATFORMS[this.platform.hostname] || this.createFallbackConfig();
            this.ui = null;
            this.isInitialized = false;
            this.gptsData = [];
            this.conversations = [];
            this.isDragging = false;
            
            this.init();
        }

        detectPlatform() {
            return {
                hostname: window.location.hostname,
                url: window.location.href,
                title: document.title,
                path: window.location.pathname
            };
        }

        createFallbackConfig() {
            return {
                name: 'Unknown Platform',
                emoji: '💬',
                capabilities: ['conversations'],
                selectors: {
                    conversations: {
                        articles: '[role="article"], .message, .chat-item',
                        userContent: '.user, [data-role="user"], .human',
                        copyButton: '[aria-label*="copy" i], .copy, button[title*="copy" i]',
                        title: 'title, h1, .title'
                    }
                },
                colors: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899' }
            };
        }

        // ═══════════════════════════════════════════════════════════════
        // VISUAL INTERFACE ORCHESTRATION - Design as Experience
        // ═══════════════════════════════════════════════════════════════

        async init() {
            if (this.isInitialized) return;
            
            await this.injectStyles();
            await this.createUnifiedInterface();
            this.bindKeyboardShortcuts();
            this.observePageChanges();
            this.interceptDataStreams();
            
            this.isInitialized = true;
            console.log(`🎨 Universal AI Exporter initialized for ${this.config.name}`);
        }

        async injectStyles() {
            const styleId = 'universal-ai-exporter-styles';
            if (document.getElementById(styleId)) return;

            const styles = `
                <style id="${styleId}">
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                    
                    .ai-exporter-panel {
                        position: fixed;
                        top: 60px;
                        right: 20px;
                        z-index: 99999;
                        
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(20px);
                        border-radius: 16px;
                        padding: 20px;
                        box-shadow: 
                            0 20px 25px -5px rgba(0, 0, 0, 0.1),
                            0 10px 10px -5px rgba(0, 0, 0, 0.04),
                            inset 0 1px 0 rgba(255, 255, 255, 0.9);
                        
                        min-width: 280px;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        
                        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                        transform: translateZ(0);
                        cursor: move;
                    }
                    
                    .ai-exporter-panel.collapsed {
                        transform: translateX(calc(100% + 40px));
                    }
                    
                    .ai-exporter-panel.dragging {
                        user-select: none;
                        transition: none;
                    }
                    
                    .ai-exporter-header {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-bottom: 16px;
                        padding-bottom: 12px;
                        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
                    }
                    
                    .ai-exporter-title {
                        font-size: 16px;
                        font-weight: 600;
                        color: #1a1a1a;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }
                    
                    .ai-exporter-toggle {
                        position: absolute;
                        left: -40px;
                        top: 50%;
                        transform: translateY(-50%);
                        
                        width: 32px;
                        height: 32px;
                        background: linear-gradient(135deg, ${this.config.colors.primary}, ${this.config.colors.secondary});
                        border: none;
                        border-radius: 8px 0 0 8px;
                        color: white;
                        cursor: pointer;
                        
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    }
                    
                    .ai-exporter-toggle:hover {
                        transform: translateY(-50%) translateX(-2px);
                        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
                    }
                    
                    .ai-exporter-stats {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 8px;
                        margin-bottom: 16px;
                    }
                    
                    .ai-exporter-stat {
                        background: rgba(0, 0, 0, 0.02);
                        border-radius: 8px;
                        padding: 8px 12px;
                        text-align: center;
                        border: 1px solid rgba(0, 0, 0, 0.04);
                    }
                    
                    .ai-exporter-stat-value {
                        font-size: 18px;
                        font-weight: 600;
                        color: ${this.config.colors.primary};
                    }
                    
                    .ai-exporter-stat-label {
                        font-size: 11px;
                        color: #666;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-top: 2px;
                    }
                    
                    .ai-exporter-actions {
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                    }
                    
                    .ai-exporter-btn {
                        padding: 12px 16px;
                        border: none;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: 500;
                        cursor: pointer;
                        
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        
                        transition: all 0.2s ease;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .ai-exporter-btn:before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: -100%;
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                        transition: left 0.6s ease;
                    }
                    
                    .ai-exporter-btn:hover:before {
                        left: 100%;
                    }
                    
                    .ai-exporter-btn.primary {
                        background: linear-gradient(135deg, ${this.config.colors.primary}, ${this.config.colors.secondary});
                        color: white;
                    }
                    
                    .ai-exporter-btn.secondary {
                        background: linear-gradient(135deg, ${this.config.colors.accent}, ${this.config.colors.secondary});
                        color: white;
                    }
                    
                    .ai-exporter-btn.tertiary {
                        background: rgba(0, 0, 0, 0.04);
                        color: #666;
                        font-size: 12px;
                        padding: 8px 12px;
                    }
                    
                    .ai-exporter-btn:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    }
                    
                    .ai-exporter-btn:active {
                        transform: translateY(0);
                    }
                    
                    .ai-exporter-btn:disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                        transform: none;
                    }
                    
                    .ai-exporter-notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 100000;
                        
                        background: rgba(0, 0, 0, 0.9);
                        color: white;
                        border-radius: 8px;
                        padding: 12px 16px;
                        
                        font-family: 'Inter', sans-serif;
                        font-size: 13px;
                        font-weight: 500;
                        
                        opacity: 0;
                        transform: translateX(100%);
                        transition: all 0.3s ease-out;
                    }
                    
                    .ai-exporter-notification.show {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    
                    .ai-exporter-notification.success {
                        background: linear-gradient(135deg, #10b981, #059669);
                    }
                    
                    .ai-exporter-notification.error {
                        background: linear-gradient(135deg, #ef4444, #dc2626);
                    }
                    
                    .ai-exporter-notification.info {
                        background: linear-gradient(135deg, #3b82f6, #2563eb);
                    }
                    
                    @media (prefers-color-scheme: dark) {
                        .ai-exporter-panel {
                            background: rgba(30, 30, 30, 0.95);
                            border: 1px solid rgba(255, 255, 255, 0.1);
                        }
                        
                        .ai-exporter-title {
                            color: #ffffff;
                        }
                        
                        .ai-exporter-stat {
                            background: rgba(255, 255, 255, 0.05);
                            border: 1px solid rgba(255, 255, 255, 0.08);
                        }
                        
                        .ai-exporter-btn.tertiary {
                            background: rgba(255, 255, 255, 0.08);
                            color: #ccc;
                        }
                    }
                </style>
            `;
            
            document.head.insertAdjacentHTML('beforeend', styles);
        }

        async createUnifiedInterface() {
            if (this.ui) return;

            const savedPosition = await this.getSavedPosition();
            const savedCollapsed = await GM_getValue(`${this.platform.hostname}_collapsed`, false);
            
            this.ui = document.createElement('div');
            this.ui.className = `ai-exporter-panel ${savedCollapsed ? 'collapsed' : ''}`;
            this.ui.style.top = `${savedPosition.top}px`;
            this.ui.style.right = `${savedPosition.right}px`;
            
            this.ui.innerHTML = this.createInterfaceHTML();
            this.bindInterfaceEvents();
            this.makeDraggable(this.ui);
            
            document.body.appendChild(this.ui);
            
            // Update stats
            this.updateStats();
        }

        createInterfaceHTML() {
            const capabilities = this.config.capabilities || ['conversations'];
            const hasGPTs = capabilities.includes('gpts');
            const hasConversations = capabilities.includes('conversations');
            
            return `
                <button class="ai-exporter-toggle" title="Toggle Export Panel">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                    </svg>
                </button>
                
                <div class="ai-exporter-header">
                    <div class="ai-exporter-title">
                        ${this.config.emoji} ${this.config.name} Exporter
                    </div>
                </div>
                
                <div class="ai-exporter-stats">
                    ${hasConversations ? `
                        <div class="ai-exporter-stat">
                            <div class="ai-exporter-stat-value" id="conversations-count">0</div>
                            <div class="ai-exporter-stat-label">Messages</div>
                        </div>
                    ` : ''}
                    ${hasGPTs ? `
                        <div class="ai-exporter-stat">
                            <div class="ai-exporter-stat-value" id="gpts-count">0</div>
                            <div class="ai-exporter-stat-label">GPTs</div>
                        </div>
                    ` : ''}
                    ${!hasGPTs ? `
                        <div class="ai-exporter-stat">
                            <div class="ai-exporter-stat-value" id="platform-status">●</div>
                            <div class="ai-exporter-stat-label">Active</div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="ai-exporter-actions">
                    ${hasConversations ? `
                        <button class="ai-exporter-btn primary" data-action="export-conversation">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Export Conv0
                        </button>
                    ` : ''}
                    ${hasGPTs ? `
                        <button class="ai-exporter-btn secondary" data-action="export-gpts-json">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                            </svg>
                            Export GPTs (JSON)
                        </button>
                        <button class="ai-exporter-btn secondary" data-action="export-gpts-csv">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                                <line x1="16" y1="13" x2="8" y2="13"/>
                                <line x1="16" y1="17" x2="8" y2="17"/>
                            </svg>
                            Export GPTs (CSV)
                        </button>
                        <button class="ai-exporter-btn tertiary" data-action="clear-gpts">
                            Clear GPT Data
                        </button>
                    ` : ''}
                </div>
            `;
        }

        bindInterfaceEvents() {
            // Toggle button
            const toggleBtn = this.ui.querySelector('.ai-exporter-toggle');
            toggleBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const isCollapsed = this.ui.classList.toggle('collapsed');
                await GM_setValue(`${this.platform.hostname}_collapsed`, isCollapsed);
            });

            // Action buttons
            const actionBtns = this.ui.querySelectorAll('[data-action]');
            actionBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = e.target.closest('[data-action]').dataset.action;
                    this.handleAction(action);
                });
            });
        }

        makeDraggable(element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            
            element.addEventListener('mousedown', dragMouseDown);
            
            function dragMouseDown(e) {
                // Don't start drag if clicking on buttons
                if (e.target.closest('button')) return;
                
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.addEventListener('mouseup', closeDragElement);
                document.addEventListener('mousemove', elementDrag);
                element.classList.add('dragging');
            }
            
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                
                const newTop = element.offsetTop - pos2;
                const newLeft = element.offsetLeft - pos1;
                
                // Keep within viewport bounds
                const maxTop = window.innerHeight - element.offsetHeight;
                const maxLeft = window.innerWidth - element.offsetWidth;
                
                element.style.top = Math.max(0, Math.min(newTop, maxTop)) + "px";
                element.style.left = Math.max(0, Math.min(newLeft, maxLeft)) + "px";
                element.style.right = "auto";
            }
            
            function closeDragElement() {
                document.removeEventListener('mouseup', closeDragElement);
                document.removeEventListener('mousemove', elementDrag);
                element.classList.remove('dragging');
                
                // Save position
                this.savePosition({
                    top: parseInt(element.style.top),
                    right: window.innerWidth - element.offsetLeft - element.offsetWidth
                });
            }
        }

        async getSavedPosition() {
            const defaultPos = { top: 60, right: 20 };
            try {
                const saved = await GM_getValue(`${this.platform.hostname}_position`, JSON.stringify(defaultPos));
                return JSON.parse(saved);
            } catch {
                return defaultPos;
            }
        }

        async savePosition(pos) {
            try {
                await GM_setValue(`${this.platform.hostname}_position`, JSON.stringify(pos));
            } catch (error) {
                console.error('Error saving position:', error);
            }
        }

        async handleAction(action) {
            switch (action) {
                case 'export-conversation':
                    await this.exportConversation();
                    break;
                case 'export-gpts-json':
                    await this.exportGPTs('json');
                    break;
                case 'export-gpts-csv':
                    await this.exportGPTs('csv');
                    break;
                case 'clear-gpts':
                    await this.clearGPTsData();
                    break;
            }
        }

        // ═══════════════════════════════════════════════════════════════
        // DATA INTERCEPTION - Stream Consciousness Harvesting
        // ═══════════════════════════════════════════════════════════════

        interceptDataStreams() {
            if (!this.config.capabilities.includes('gpts')) return;

            // Intercept ChatGPT GPTs API calls
            const originalFetch = unsafeWindow.fetch;
            unsafeWindow.fetch = async (...args) => {
                const response = await originalFetch(...args);
                const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;

                if (url && url.includes('/public-api/gizmos/discovery/mine')) {
                    try {
                        const clonedResponse = response.clone();
                        const data = await clonedResponse.json();
                        if (data?.list?.items) {
                            this.processGPTsData(data.list.items);
                        }
                    } catch (error) {
                        console.error('Error intercepting GPTs data:', error);
                    }
                }

                return response;
            };
        }

        processGPTsData(items) {
            const processedGPTs = items.map(item => {
                const gpt = item.resource.gizmo;
                return {
                    id: gpt.id,
                    name: gpt.display.name || '',
                    description: gpt.display.description || '',
                    instructions: gpt.instructions || '',
                    created_at: gpt.created_at,
                    updated_at: gpt.updated_at,
                    version: gpt.version,
                    tools: item.resource.tools.map(tool => tool.type),
                    prompt_starters: gpt.display.prompt_starters || [],
                    share_recipient: gpt.share_recipient,
                    num_interactions: gpt.num_interactions
                };
            });

            this.gptsData = this.persistGPTsData(processedGPTs);
            this.updateStats();
        }

        persistGPTsData(newData) {
            try {
                const existingData = this.loadPersistedGPTs();
                const dataMap = new Map(existingData.map(item => [item.id, item]));
                
                newData.forEach(item => {
                    dataMap.set(item.id, item);
                });
                
                const mergedData = Array.from(dataMap.values());
                localStorage.setItem('ai_exporter_gpts_data', JSON.stringify(mergedData));
                
                return mergedData;
            } catch (error) {
                console.error('Error persisting GPTs data:', error);
                return newData;
            }
        }

        loadPersistedGPTs() {
            try {
                const stored = localStorage.getItem('ai_exporter_gpts_data');
                return stored ? JSON.parse(stored) : [];
            } catch (error) {
                console.error('Error loading persisted GPTs data:', error);
                return [];
            }
        }

        // ═══════════════════════════════════════════════════════════════
        // CONVERSATION EXTRACTION - Narrative Archaeology
        // ═══════════════════════════════════════════════════════════════

        async exportConversation() {
            try {
                this.showNotification('Extracting conversation...', 'info');
                
                const messages = await this.extractMessages();
                
                if (messages.length === 0) {
                    this.showNotification('No messages found', 'error');
                    return;
                }

                const formattedContent = this.formatConversation(messages);
                const fileName = this.generateFileName();
                
                this.downloadAsFile(formattedContent, fileName);
                GM_setClipboard(formattedContent);
                
                // Try Obsidian integration if available
                try {
                    const obsidianUri = `obsidian://new?file=Chats/${this.config.name}/${fileName}&clipboard`;
                    window.open(obsidianUri, '_blank');
                } catch {}
                
                this.showNotification(`Exported ${messages.length} messages`, 'success');
                
            } catch (error) {
                console.error('Export error:', error);
                this.showNotification('Export failed', 'error');
            }
        }

        async extractMessages() {
            switch (this.platform.hostname) {
                case 'chatgpt.com':
                    return await this.extractChatGPTMessages();
                case 'claude.ai':
                case 'chat.anthropic.com':
                    return await this.extractClaudeMessages();
                case 'chat.deepseek.com':
                    return await this.extractDeepSeekMessages();
                case 'yuanbao.tencent.com':
                    return await this.extractYuanbaoMessages();
                default:
                    return await this.extractGenericMessages();
            }
        }

        async extractChatGPTMessages() {
            const messages = [];
            const messageContainers = document.querySelectorAll('div[data-message-author-role]');
            
            for (const container of messageContainers) {
                const role = container.getAttribute('data-message-author-role');
                const contentElement = container.querySelector('div.whitespace-pre-wrap, div.markdown');
                
                if (contentElement) {
                    let content;
                    if (role === 'assistant') {
                        const copyBtn = container.querySelector('button[aria-label*="Copy"]');
                        if (copyBtn) {
                            copyBtn.click();
                            await this.delay(200);
                            try {
                                content = await navigator.clipboard.readText();
                            } catch {
                                content = this.extractTextContent(contentElement);
                            }
                        } else {
                            content = this.extractTextContent(contentElement);
                        }
                    } else {
                        content = this.extractTextContent(contentElement);
                    }
                    
                    messages.push({
                        role: role === 'user' ? 'user' : 'assistant',
                        content: this.cleanText(content)
                    });
                }
            }
            
            return messages;
        }

        async extractClaudeMessages() {
            const messages = [];
            const messageElements = document.querySelectorAll('div[data-is-streaming="false"], div.font-claude-message, div.font-user-message');
            
            for (const element of messageElements) {
                const isUser = element.classList.contains('font-user-message') || 
                              element.getAttribute('data-is-author') === 'true';
                
                let content;
                if (!isUser) {
                    const copyBtn = element.querySelector('button[aria-label*="Copy"]');
                    if (copyBtn) {
                        copyBtn.click();
                        await this.delay(200);
                        try {
                            content = await navigator.clipboard.readText();
                        } catch {
                            content = this.extractTextContent(element);
                        }
                    } else {
                        content = this.extractTextContent(element);
                    }
                } else {
                    content = this.extractTextContent(element);
                }
                
                messages.push({
                    role: isUser ? 'user' : 'assistant',
                    content: this.cleanText(content)
                });
            }
            
            return messages;
        }

        async extractDeepSeekMessages() {
            const messages = [];
            const copyButtons = document.querySelectorAll('button[aria-label*="copy" i], .ds-icon-button');
            
            if (copyButtons.length > 0) {
                let isUserTurn = true;
                
                for (const button of copyButtons) {
                    try {
                        button.click();
                        await this.delay(300);
                        
                        const content = await navigator.clipboard.readText();
                        if (content && content.trim()) {
                            messages.push({
                                role: isUserTurn ? 'user' : 'assistant',
                                content: this.cleanText(content)
                            });
                            isUserTurn = !isUserTurn;
                        }
                    } catch (e) {
                        console.warn('DeepSeek copy failed, trying text extraction');
                    }
                }
            }
            
            if (messages.length === 0) {
                const messageElements = document.querySelectorAll('div[data-role], .message-item');
                for (const element of messageElements) {
                    const role = element.getAttribute('data-role') || 
                                (element.classList.contains('user-message') ? 'user' : 'assistant');
                    
                    const content = this.extractTextContent(element);
                    if (content) {
                        messages.push({
                            role: role,
                            content: this.cleanText(content)
                        });
                    }
                }
            }
            
            return messages;
        }

        async extractYuanbaoMessages() {
            const messages = [];
            const messageItems = document.querySelectorAll('div.agent-chat__list__item');
            
            for (let i = 0; i < messageItems.length; i++) {
                const item = messageItems[i];
                const isUser = i % 2 === 0; // Assuming alternating pattern
                
                // Try copy button first
                const copyBtn = item.querySelector('div.agent-chat__toolbar__item.agent-chat__toolbar__copy');
                let content;
                
                if (copyBtn && !isUser) {
                    copyBtn.click();
                    await this.delay(300);
                    try {
                        content = await navigator.clipboard.readText();
                    } catch {
                        content = this.extractTextContent(item);
                    }
                } else {
                    content = this.extractTextContent(item);
                }
                
                if (content && content.trim()) {
                    messages.push({
                        role: isUser ? 'user' : 'assistant',
                        content: this.cleanText(content)
                    });
                }
            }
            
            return messages;
        }

        async extractGenericMessages() {
            const messages = [];
            const messageElements = document.querySelectorAll(this.config.selectors.conversations.articles);
            
            for (const element of messageElements) {
                const isUser = element.classList.contains('user') || 
                              element.classList.contains('human') ||
                              element.querySelector('[data-role="user"]');
                
                const content = this.extractTextContent(element);
                if (content && content.trim()) {
                    messages.push({
                        role: isUser ? 'user' : 'assistant',
                        content: this.cleanText(content)
                    });
                }
            }
            
            return messages;
        }

        extractTextContent(element) {
            if (!element) return '';
            
            // Remove copy buttons and other UI elements
            const clone = element.cloneNode(true);
            const buttons = clone.querySelectorAll('button, .copy-button, [aria-label*="copy" i]');
            buttons.forEach(btn => btn.remove());
            
            // Extract text while preserving some formatting
            let text = clone.innerText || clone.textContent || '';
            
            // Clean up common artifacts
            text = text.replace(/\n{3,}/g, '\n\n'); // Reduce multiple newlines
            text = text.replace(/^\s*[\r\n]/gm, ''); // Remove empty lines
            text = text.trim();
            
            return text;
        }

        cleanText(text) {
            if (!text) return '';
            
            return text
                .replace(/\u00A0/g, ' ') // Replace non-breaking spaces
                .replace(/\s+/g, ' ') // Normalize whitespace
                .replace(/^\s*Copy\s*$/gm, '') // Remove standalone "Copy" text
                .replace(/^[\s\n]*|[\s\n]*$/g, '') // Trim
                .trim();
        }

        formatConversation(messages) {
            const timestamp = new Date().toISOString().split('T')[0];
            const title = this.getConversationTitle();
            
            let formatted = `# ${title}\n\n`;
            formatted += `**Platform:** ${this.config.name}\n`;
            formatted += `**Exported:** ${timestamp}\n`;
            formatted += `**Messages:** ${messages.length}\n\n`;
            formatted += `---\n\n`;
            
            messages.forEach((message, index) => {
                const roleIcon = message.role === 'user' ? '👤' : this.config.emoji;
                const roleName = message.role === 'user' ? 'Human' : this.config.name;
                
                formatted += `## ${roleIcon} ${roleName}\n\n`;
                formatted += `${message.content}\n\n`;
                
                if (index < messages.length - 1) {
                    formatted += `---\n\n`;
                }
            });
            
            return formatted;
        }

        getConversationTitle() {
            const titleElement = document.querySelector(this.config.selectors.conversations.title);
            if (titleElement) {
                return titleElement.textContent || titleElement.innerText || 'Untitled Conversation';
            }
            
            // Fallback to page title or URL
            const pageTitle = document.title;
            if (pageTitle && !pageTitle.includes(this.config.name)) {
                return pageTitle;
            }
            
            return `${this.config.name} Conversation - ${new Date().toISOString().split('T')[0]}`;
        }

        generateFileName() {
            const title = this.getConversationTitle()
                .replace(/[^\w\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-') // Replace spaces with hyphens
                .substring(0, 50); // Limit length
            
            const timestamp = new Date().toISOString().split('T')[0];
            return `${title}-${timestamp}.md`;
        }

        // ═══════════════════════════════════════════════════════════════
        // GPT DATA EXPORT - Knowledge Architecture Preservation
        // ═══════════════════════════════════════════════════════════════

        async exportGPTs(format) {
            try {
                this.showNotification('Exporting GPT data...', 'info');
                
                const gptsData = this.loadPersistedGPTs();
                if (gptsData.length === 0) {
                    this.showNotification('No GPT data found', 'error');
                    return;
                }

                let content, fileName, mimeType;
                
                if (format === 'json') {
                    content = JSON.stringify(gptsData, null, 2);
                    fileName = `gpts-export-${new Date().toISOString().split('T')[0]}.json`;
                    mimeType = 'application/json';
                } else if (format === 'csv') {
                    content = this.convertGPTsToCSV(gptsData);
                    fileName = `gpts-export-${new Date().toISOString().split('T')[0]}.csv`;
                    mimeType = 'text/csv';
                }
                
                this.downloadAsFile(content, fileName, mimeType);
                GM_setClipboard(content);
                
                this.showNotification(`Exported ${gptsData.length} GPTs as ${format.toUpperCase()}`, 'success');
                
            } catch (error) {
                console.error('GPT export error:', error);
                this.showNotification('GPT export failed', 'error');
            }
        }

        convertGPTsToCSV(gptsData) {
            if (gptsData.length === 0) return '';
            
            const headers = [
                'ID', 'Name', 'Description', 'Instructions', 'Created At', 'Updated At',
                'Version', 'Tools', 'Prompt Starters', 'Share Recipient', 'Interactions'
            ];
            
            const rows = gptsData.map(gpt => [
                this.escapeCSV(gpt.id || ''),
                this.escapeCSV(gpt.name || ''),
                this.escapeCSV(gpt.description || ''),
                this.escapeCSV(gpt.instructions || ''),
                this.escapeCSV(gpt.created_at || ''),
                this.escapeCSV(gpt.updated_at || ''),
                this.escapeCSV(gpt.version || ''),
                this.escapeCSV((gpt.tools || []).join('; ')),
                this.escapeCSV((gpt.prompt_starters || []).join('; ')),
                this.escapeCSV(gpt.share_recipient || ''),
                this.escapeCSV(gpt.num_interactions || '0')
            ]);
            
            return [headers, ...rows]
                .map(row => row.join(','))
                .join('\n');
        }

        escapeCSV(value) {
            if (typeof value !== 'string') {
                value = String(value);
            }
            
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            
            return value;
        }

        async clearGPTsData() {
            try {
                localStorage.removeItem('ai_exporter_gpts_data');
                this.gptsData = [];
                this.updateStats();
                this.showNotification('GPT data cleared', 'success');
            } catch (error) {
                console.error('Error clearing GPT data:', error);
                this.showNotification('Failed to clear GPT data', 'error');
            }
        }

        // ═══════════════════════════════════════════════════════════════
        // UTILITY FUNCTIONS - Digital Craftsmanship Tools
        // ═══════════════════════════════════════════════════════════════

        downloadAsFile(content, fileName, mimeType = 'text/plain') {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
        }

        showNotification(message, type = 'info') {
            // Remove existing notifications
            const existing = document.querySelectorAll('.ai-exporter-notification');
            existing.forEach(n => n.remove());
            
            const notification = document.createElement('div');
            notification.className = `ai-exporter-notification ${type}`;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Trigger animation
            setTimeout(() => notification.classList.add('show'), 100);
            
            // Auto remove
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        updateStats() {
            if (!this.ui) return;
            
            const conversationsCount = document.getElementById('conversations-count');
            const gptsCount = document.getElementById('gpts-count');
            const platformStatus = document.getElementById('platform-status');
            
            if (conversationsCount) {
                const messageCount = document.querySelectorAll(this.config.selectors.conversations.articles).length;
                conversationsCount.textContent = messageCount;
            }
            
            if (gptsCount) {
                gptsCount.textContent = this.gptsData.length;
            }
            
            if (platformStatus) {
                platformStatus.style.color = this.config.colors.primary;
            }
        }

        bindKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + Shift + E: Export conversation
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'E') {
                    e.preventDefault();
                    this.exportConversation();
                }
                
                // Ctrl/Cmd + Shift + G: Export GPTs (if available)
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'G' && 
                    this.config.capabilities.includes('gpts')) {
                    e.preventDefault();
                    this.exportGPTs('json');
                }
                
                // Ctrl/Cmd + Shift + H: Toggle panel
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'H') {
                    e.preventDefault();
                    const toggleBtn = this.ui?.querySelector('.ai-exporter-toggle');
                    if (toggleBtn) toggleBtn.click();
                }
            });
        }

        observePageChanges() {
            const observer = new MutationObserver((mutations) => {
                let shouldUpdate = false;
                
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        const addedNodes = Array.from(mutation.addedNodes);
                        const hasNewMessages = addedNodes.some(node => 
                            node.nodeType === 1 && 
                            node.matches && 
                            node.matches(this.config.selectors.conversations.articles)
                        );
                        
                        if (hasNewMessages) {
                            shouldUpdate = true;
                        }
                    }
                });
                
                if (shouldUpdate) {
                    setTimeout(() => this.updateStats(), 500);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // INITIALIZATION - Digital Genesis
    // ═══════════════════════════════════════════════════════════════

    // Wait for DOM to be ready
    function initializeExporter() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => new UniversalAIExporter(), 1000);
            });
        } else {
            setTimeout(() => new UniversalAIExporter(), 1000);
        }
    }

    // Register menu commands for Tampermonkey
    GM_registerMenuCommand('Export Current Conversation', () => {
        if (window.aiExporter) {
            window.aiExporter.exportConversation();
        }
    });

    if (PLATFORMS[window.location.hostname]?.capabilities.includes('gpts')) {
        GM_registerMenuCommand('Export GPTs (JSON)', () => {
            if (window.aiExporter) {
                window.aiExporter.exportGPTs('json');
            }
        });
        
        GM_registerMenuCommand('Export GPTs (CSV)', () => {
            if (window.aiExporter) {
                window.aiExporter.exportGPTs('csv');
            }
        });
    }

    // Initialize the exporter
    initializeExporter();

})();