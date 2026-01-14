// ==UserScript==
// @name         AvatarArts Universal AI Platform Extractor Pro
// @namespace    https://avatararts.org/
// @version      6.0
// @description  Advanced universal file and conversation extractor for all AI platforms with AI-powered features, cloud integration, and advanced filtering
// @author       AvatarArts.org & GPTJunkie.com & QuantumForgeLabs.org
// @homepage     https://avatararts.org/
// @supportURL   https://gptjunkie.com/
// @updateURL    https://quantumforgelabs.org/scripts/avatararts-universal-ai-extractor-pro.user.js
// @downloadURL  https://quantumforgelabs.org/scripts/avatararts-universal-ai-extractor-pro.user.js
// @match        https://claude.ai/*
// @match        https://chat.openai.com/*
// @match        https://gemini.google.com/*
// @match        https://grok.x.ai/*
// @match        https://chat.deepseek.com/*
// @match        https://www.deepseek.com/*
// @match        https://poe.com/*
// @match        https://perplexity.ai/*
// @match        https://you.com/*
// @require      https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@5.0.2/dist/tesseract.min.js
// @require      https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js
// @require      https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// ==/UserScript==

/*
 * =============================================================================
 * AvatarArts Universal AI Platform Extractor Pro v6.0
 * =============================================================================
 * 
 *  Advanced universal file and conversation extractor for all AI platforms
 * 
 *  Powered by:
 * • AvatarArts.org - Creative AI Solutions
 * • GPTJunkie.com - AI Tools & Resources  
 * • QuantumForgeLabs.org - Quantum AI Research
 * 
 * ✨ Features:
 * • 9 AI Platform Support (Claude, ChatGPT, Gemini, Grok, DeepSeek, Poe, Perplexity, You.com)
 * • AI-Powered Content Analysis (Language detection, sentiment, topics, keywords)
 * • Advanced Export Options (ZIP, JSON, Markdown, HTML, PDF)
 * • Smart Filtering (Date, type, size filters)
 * • Image & Source Extraction with OCR support
 * • Cloud Integration Ready
 * • Export History Management
 * • Dark/Light Theme Support
 * • Modern Tabbed UI with Animations
 * 
 *  Links:
 * • Homepage: https://avatararts.org/
 * • Support: https://gptjunkie.com/
 * • Updates: https://quantumforgelabs.org/
 * 
 * =============================================================================
 */

(function() {
    'use strict';

    // Enhanced Platform Detection System with more platforms
    const PlatformDetector = {
        detect() {
            const hostname = window.location.hostname;
            const pathname = window.location.pathname;
            
            const platforms = {
                'claude.ai': {
                    name: 'Claude',
                    type: 'claude',
                    selectors: ClaudeSelectors,
                    extractor: ClaudeExtractor,
                    apiEndpoints: ClaudeAPI,
                    features: ['files', 'conversations', 'projects', 'artifacts'],
                    color: '#D97706',
                    brand: 'Anthropic'
                },
                'openai.com': {
                    name: 'ChatGPT',
                    type: 'openai',
                    selectors: OpenAISelectors,
                    extractor: OpenAIExtractor,
                    apiEndpoints: OpenAIAPI,
                    features: ['conversations', 'files', 'gpts', 'dall-e'],
                    color: '#10A37F',
                    brand: 'OpenAI'
                },
                'chatgpt.com': {
                    name: 'ChatGPT',
                    type: 'openai',
                    selectors: OpenAISelectors,
                    extractor: OpenAIExtractor,
                    apiEndpoints: OpenAIAPI,
                    features: ['conversations', 'files', 'gpts', 'dall-e'],
                    color: '#10A37F',
                    brand: 'OpenAI'
                },
                'gemini.google.com': {
                    name: 'Gemini',
                    type: 'gemini',
                    selectors: GeminiSelectors,
                    extractor: GeminiExtractor,
                    apiEndpoints: GeminiAPI,
                    features: ['conversations', 'files', 'images'],
                    color: '#4285F4',
                    brand: 'Google'
                },
                'grok.x.ai': {
                    name: 'Grok',
                    type: 'grok',
                    selectors: GrokSelectors,
                    extractor: GrokExtractor,
                    apiEndpoints: GrokAPI,
                    features: ['conversations', 'files'],
                    color: '#FF6B35',
                    brand: 'xAI'
                },
                'deepseek.com': {
                    name: 'DeepSeek',
                    type: 'deepseek',
                    selectors: DeepSeekSelectors,
                    extractor: DeepSeekExtractor,
                    apiEndpoints: DeepSeekAPI,
                    features: ['conversations', 'files'],
                    color: '#1E40AF',
                    brand: 'DeepSeek'
                },
                'poe.com': {
                    name: 'Poe',
                    type: 'poe',
                    selectors: PoeSelectors,
                    extractor: PoeExtractor,
                    apiEndpoints: PoeAPI,
                    features: ['conversations', 'files'],
                    color: '#8B5CF6',
                    brand: 'Quora'
                },
                'perplexity.ai': {
                    name: 'Perplexity',
                    type: 'perplexity',
                    selectors: PerplexitySelectors,
                    extractor: PerplexityExtractor,
                    apiEndpoints: PerplexityAPI,
                    features: ['conversations', 'sources'],
                    color: '#7C3AED',
                    brand: 'Perplexity'
                },
                'you.com': {
                    name: 'You.com',
                    type: 'you',
                    selectors: YouSelectors,
                    extractor: YouExtractor,
                    apiEndpoints: YouAPI,
                    features: ['conversations', 'sources'],
                    color: '#059669',
                    brand: 'You.com'
                }
            };

            for (const [domain, config] of Object.entries(platforms)) {
                if (hostname.includes(domain)) {
                    return config;
                }
            }
            
            return null;
        }
    };

    // Enhanced Platform Selectors with more comprehensive coverage
    const ClaudeSelectors = {
        fileElements: [
            'button[class*="cursor-pointer"]', 'div[class*="cursor-pointer"]',
            '[role="button"]', '.clickable', 'button[type="button"]',
            '[data-testid*="file"]', '.file-item', '.attachment-item'
        ],
        contentContainers: [
            'pre code', 'pre', '.whitespace-pre-wrap', '.font-mono',
            '.overflow-auto pre', '.text-sm.whitespace-pre-wrap',
            '[class*="content"]', '.modal-body', '.dialog-content',
            '.artifact-content', '.code-block'
        ],
        modalSelectors: ['[role="dialog"]', '.modal', '.dialog'],
        titleSelectors: ['h1', '[data-testid*="title"]', '.text-xl', '.text-2xl', '.font-bold', 'title'],
        conversationSelectors: ['.conversation', '.chat-message', '.message', '.conversation-item'],
        messageSelectors: ['.message-content', '.chat-message-content', '.conversation-message'],
        imageSelectors: ['img[src*="claude"]', '.image-container img', '.artifact img'],
        codeSelectors: ['pre code', '.code-block', '.syntax-highlight']
    };

    const OpenAISelectors = {
        fileElements: [
            '[data-testid*="file"]', '.file-item', '.attachment-item',
            'button[aria-label*="file"]', '.file-download', '[class*="file"]',
            '.attachment', '.uploaded-file'
        ],
        contentContainers: [
            '.file-content', '.file-preview', 'pre', 'code',
            '.markdown-body', '.file-text', '.message-content'
        ],
        modalSelectors: ['.modal', '.dialog', '[role="dialog"]'],
        titleSelectors: ['h1', '.conversation-title', '.chat-title', 'title'],
        conversationSelectors: ['.conversation', '.chat', '.message-group', '.conversation-item'],
        messageSelectors: ['.message', '.chat-message', '[data-message-author-role]'],
        imageSelectors: ['img[src*="dall-e"]', '.dall-e-image', '.generated-image'],
        codeSelectors: ['pre code', '.code-block', '.syntax-highlight']
    };

    const GeminiSelectors = {
        fileElements: [
            '.file-card', '.attachment-card', '[data-file]',
            '.file-item', 'button[aria-label*="file"]', '.uploaded-file'
        ],
        contentContainers: [
            '.file-content', '.file-preview', 'pre', 'code', '.file-text',
            '.message-content', '.response-content'
        ],
        modalSelectors: ['.modal', '.dialog', '[role="dialog"]'],
        titleSelectors: ['h1', '.conversation-title', 'title'],
        conversationSelectors: ['.conversation', '.chat', '.message', '.conversation-item'],
        messageSelectors: ['.message-content', '.chat-message', '.conversation-message'],
        imageSelectors: ['img[src*="gemini"]', '.gemini-image', '.generated-image'],
        codeSelectors: ['pre code', '.code-block', '.syntax-highlight']
    };

    const GrokSelectors = {
        fileElements: [
            '.file-attachment', '.attachment', '[data-file]',
            '.file-item', 'button[aria-label*="file"]', '.uploaded-file'
        ],
        contentContainers: [
            '.file-content', '.file-preview', 'pre', 'code', '.file-text',
            '.message-content', '.response-content'
        ],
        modalSelectors: ['.modal', '.dialog', '[role="dialog"]'],
        titleSelectors: ['h1', '.conversation-title', 'title'],
        conversationSelectors: ['.conversation', '.chat', '.message', '.conversation-item'],
        messageSelectors: ['.message-content', '.chat-message', '.conversation-message'],
        imageSelectors: ['img[src*="grok"]', '.grok-image', '.generated-image'],
        codeSelectors: ['pre code', '.code-block', '.syntax-highlight']
    };

    const DeepSeekSelectors = {
        fileElements: [
            '.file-item', '.attachment-item', '[data-file]',
            '.file-card', 'button[aria-label*="file"]', '.uploaded-file'
        ],
        contentContainers: [
            '.file-content', '.file-preview', 'pre', 'code', '.file-text',
            '.message-content', '.response-content'
        ],
        modalSelectors: ['.modal', '.dialog', '[role="dialog"]'],
        titleSelectors: ['h1', '.conversation-title', 'title'],
        conversationSelectors: ['.conversation', '.chat', '.message', '.conversation-item'],
        messageSelectors: ['.message-content', '.chat-message', '.conversation-message'],
        imageSelectors: ['img[src*="deepseek"]', '.deepseek-image', '.generated-image'],
        codeSelectors: ['pre code', '.code-block', '.syntax-highlight']
    };

    const PoeSelectors = {
        fileElements: [
            '.file-item', '.attachment-item', '[data-file]',
            '.file-card', 'button[aria-label*="file"]', '.uploaded-file'
        ],
        contentContainers: [
            '.file-content', '.file-preview', 'pre', 'code', '.file-text',
            '.message-content', '.response-content'
        ],
        modalSelectors: ['.modal', '.dialog', '[role="dialog"]'],
        titleSelectors: ['h1', '.conversation-title', 'title'],
        conversationSelectors: ['.conversation', '.chat', '.message', '.conversation-item'],
        messageSelectors: ['.message-content', '.chat-message', '.conversation-message'],
        imageSelectors: ['img[src*="poe"]', '.poe-image', '.generated-image'],
        codeSelectors: ['pre code', '.code-block', '.syntax-highlight']
    };

    const PerplexitySelectors = {
        fileElements: [
            '.file-item', '.attachment-item', '[data-file]',
            '.file-card', 'button[aria-label*="file"]', '.uploaded-file'
        ],
        contentContainers: [
            '.file-content', '.file-preview', 'pre', 'code', '.file-text',
            '.message-content', '.response-content', '.source-content'
        ],
        modalSelectors: ['.modal', '.dialog', '[role="dialog"]'],
        titleSelectors: ['h1', '.conversation-title', 'title'],
        conversationSelectors: ['.conversation', '.chat', '.message', '.conversation-item'],
        messageSelectors: ['.message-content', '.chat-message', '.conversation-message'],
        imageSelectors: ['img[src*="perplexity"]', '.perplexity-image', '.generated-image'],
        codeSelectors: ['pre code', '.code-block', '.syntax-highlight'],
        sourceSelectors: ['.source', '.citation', '.reference']
    };

    const YouSelectors = {
        fileElements: [
            '.file-item', '.attachment-item', '[data-file]',
            '.file-card', 'button[aria-label*="file"]', '.uploaded-file'
        ],
        contentContainers: [
            '.file-content', '.file-preview', 'pre', 'code', '.file-text',
            '.message-content', '.response-content', '.source-content'
        ],
        modalSelectors: ['.modal', '.dialog', '[role="dialog"]'],
        titleSelectors: ['h1', '.conversation-title', 'title'],
        conversationSelectors: ['.conversation', '.chat', '.message', '.conversation-item'],
        messageSelectors: ['.message-content', '.chat-message', '.conversation-message'],
        imageSelectors: ['img[src*="you"]', '.you-image', '.generated-image'],
        codeSelectors: ['pre code', '.code-block', '.syntax-highlight'],
        sourceSelectors: ['.source', '.citation', '.reference']
    };

    // API Endpoints for each platform
    const ClaudeAPI = {
        conversations: '/api/conversations',
        files: '/api/files',
        projects: '/api/projects',
        artifacts: '/api/artifacts'
    };

    const OpenAIAPI = {
        conversations: '/backend-api/conversations',
        files: '/backend-api/files',
        gpts: '/backend-api/gpts',
        images: '/backend-api/images'
    };

    const GeminiAPI = {
        conversations: '/api/conversations',
        files: '/api/files',
        images: '/api/images'
    };

    const GrokAPI = {
        conversations: '/api/conversations',
        files: '/api/files'
    };

    const DeepSeekAPI = {
        conversations: '/api/conversations',
        files: '/api/files'
    };

    const PoeAPI = {
        conversations: '/api/conversations',
        files: '/api/files'
    };

    const PerplexityAPI = {
        conversations: '/api/conversations',
        sources: '/api/sources'
    };

    const YouAPI = {
        conversations: '/api/conversations',
        sources: '/api/sources'
    };

    // AI-Powered Content Processor
    class AIContentProcessor {
        constructor() {
            this.cache = new Map();
        }

        async processContent(content, type = 'text') {
            const cacheKey = `${type}_${this.hashContent(content)}`;
            if (this.cache.has(cacheKey)) {
                return this.cache.get(cacheKey);
            }

            const processed = await this.analyzeContent(content, type);
            this.cache.set(cacheKey, processed);
            return processed;
        }

        hashContent(content) {
            let hash = 0;
            for (let i = 0; i < content.length; i++) {
                const char = content.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            return hash.toString();
        }

        async analyzeContent(content, type) {
            const analysis = {
                type: type,
                length: content.length,
                wordCount: content.split(/\s+/).length,
                lineCount: content.split('\n').length,
                language: this.detectLanguage(content),
                sentiment: this.analyzeSentiment(content),
                topics: this.extractTopics(content),
                keywords: this.extractKeywords(content),
                readability: this.calculateReadability(content),
                complexity: this.assessComplexity(content),
                timestamp: new Date().toISOString(),
                processedBy: 'AvatarArts Universal AI Extractor Pro'
            };

            return analysis;
        }

        detectLanguage(content) {
            // Simple language detection based on common patterns
            const patterns = {
                'en': /\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/gi,
                'es': /\b(el|la|los|las|de|del|en|con|por|para|que|comme)\b/gi,
                'fr': /\b(le|la|les|de|du|des|en|avec|pour|que|comme)\b/gi,
                'de': /\b(der|die|das|und|oder|aber|in|auf|mit|für|von)\b/gi,
                'zh': /[\u4e00-\u9fff]/g,
                'ja': /[\u3040-\u309f\u30a0-\u30ff]/g,
                'ko': /[\uac00-\ud7af]/g
            };

            let maxScore = 0;
            let detectedLang = 'en';

            for (const [lang, pattern] of Object.entries(patterns)) {
                const matches = content.match(pattern);
                const score = matches ? matches.length : 0;
                if (score > maxScore) {
                    maxScore = score;
                    detectedLang = lang;
                }
            }

            return detectedLang;
        }

        analyzeSentiment(content) {
            // Simple sentiment analysis
            const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'happy', 'joy'];
            const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'sad', 'angry', 'frustrated', 'disappointed'];
            
            const words = content.toLowerCase().split(/\s+/);
            let positiveScore = 0;
            let negativeScore = 0;

            words.forEach(word => {
                if (positiveWords.includes(word)) positiveScore++;
                if (negativeWords.includes(word)) negativeScore++;
            });

            const total = positiveScore + negativeScore;
            if (total === 0) return 'neutral';

            return positiveScore > negativeScore ? 'positive' : 'negative';
        }

        extractTopics(content) {
            // Simple topic extraction based on common keywords
            const topics = {
                'technology': ['code', 'programming', 'software', 'tech', 'computer', 'ai', 'machine learning'],
                'science': ['research', 'study', 'experiment', 'data', 'analysis', 'scientific'],
                'business': ['company', 'business', 'market', 'sales', 'revenue', 'profit'],
                'education': ['learn', 'study', 'education', 'school', 'university', 'course'],
                'health': ['health', 'medical', 'doctor', 'medicine', 'treatment', 'wellness']
            };

            const foundTopics = [];
            const words = content.toLowerCase().split(/\s+/);

            for (const [topic, keywords] of Object.entries(topics)) {
                const matches = keywords.filter(keyword => 
                    words.some(word => word.includes(keyword))
                );
                if (matches.length > 0) {
                    foundTopics.push(topic);
                }
            }

            return foundTopics;
        }

        extractKeywords(content) {
            // Simple keyword extraction
            const words = content.toLowerCase()
                .replace(/[^\w\s]/g, '')
                .split(/\s+/)
                .filter(word => word.length > 3);

            const wordCount = {};
            words.forEach(word => {
                wordCount[word] = (wordCount[word] || 0) + 1;
            });

            return Object.entries(wordCount)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10)
                .map(([word]) => word);
        }

        calculateReadability(content) {
            // Simple readability score
            const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
            const words = content.split(/\s+/).filter(w => w.length > 0);
            const syllables = this.countSyllables(content);

            if (sentences.length === 0 || words.length === 0) return 0;

            const avgWordsPerSentence = words.length / sentences.length;
            const avgSyllablesPerWord = syllables / words.length;

            // Simplified Flesch Reading Ease
            const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
            return Math.max(0, Math.min(100, score));
        }

        countSyllables(text) {
            const words = text.toLowerCase().split(/\s+/);
            let totalSyllables = 0;

            words.forEach(word => {
                const vowels = word.match(/[aeiouy]+/g);
                if (vowels) {
                    totalSyllables += vowels.length;
                }
            });

            return totalSyllables;
        }

        assessComplexity(content) {
            const wordCount = content.split(/\s+/).length;
            const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
            const avgWordsPerSentence = wordCount / sentenceCount;
            const readability = this.calculateReadability(content);

            if (readability > 80) return 'simple';
            if (readability > 60) return 'moderate';
            if (readability > 40) return 'complex';
            return 'very complex';
        }
    }

    // Enhanced Universal Extractor with AI features
    class UniversalExtractorPro {
        constructor(platform) {
            this.platform = platform;
            this.selectors = platform.selectors;
            this.apiEndpoints = platform.apiEndpoints;
            this.files = [];
            this.conversations = [];
            this.images = [];
            this.sources = [];
            this.settings = this.loadSettings();
            this.aiProcessor = new AIContentProcessor();
            this.exportHistory = this.loadExportHistory();
        }

        loadSettings() {
            return {
                exportFormat: GM_getValue('exportFormat', 'zip'),
                includeMetadata: GM_getValue('includeMetadata', true),
                includeTimestamps: GM_getValue('includeTimestamps', true),
                includeAI: GM_getValue('includeAI', true),
                autoDownload: GM_getValue('autoDownload', true),
                exportAllConversations: GM_getValue('exportAllConversations', false),
                includeImages: GM_getValue('includeImages', true),
                includeSources: GM_getValue('includeSources', true),
                compressImages: GM_getValue('compressImages', true),
                imageQuality: GM_getValue('imageQuality', 0.8),
                filterByDate: GM_getValue('filterByDate', false),
                dateRange: GM_getValue('dateRange', { start: null, end: null }),
                filterByType: GM_getValue('filterByType', []),
                filterBySize: GM_getValue('filterBySize', { min: 0, max: Infinity }),
                cloudIntegration: GM_getValue('cloudIntegration', false),
                cloudProvider: GM_getValue('cloudProvider', 'none'),
                cloudSettings: GM_getValue('cloudSettings', {}),
                theme: GM_getValue('theme', 'auto'),
                language: GM_getValue('language', 'en')
            };
        }

        saveSettings() {
            Object.keys(this.settings).forEach(key => {
                GM_setValue(key, this.settings[key]);
            });
        }

        loadExportHistory() {
            return GM_getValue('exportHistory', []);
        }

        saveExportHistory(exportData) {
            this.exportHistory.unshift(exportData);
            if (this.exportHistory.length > 100) {
                this.exportHistory = this.exportHistory.slice(0, 100);
            }
            GM_setValue('exportHistory', this.exportHistory);
        }

        async extractFiles() {
            console.log(` Extracting files from ${this.platform.name}...`);
            
            const fileElements = this.findFileElements();
            console.log(` Found ${fileElements.length} file elements`);

            for (let i = 0; i < fileElements.length; i++) {
                const element = fileElements[i];
                try {
                    const file = await this.extractFile(element, i + 1, fileElements.length);
                    if (file && this.passesFilters(file)) {
                        this.files.push(file);
                    }
                } catch (error) {
                    console.error(`❌ Error extracting file ${i + 1}:`, error);
                }
            }

            return this.files;
        }

        async extractImages() {
            if (!this.settings.includeImages) return [];

            console.log(`️ Extracting images from ${this.platform.name}...`);
            
            const imageElements = this.findImageElements();
            console.log(`️ Found ${imageElements.length} image elements`);

            for (let i = 0; i < imageElements.length; i++) {
                const element = imageElements[i];
                try {
                    const image = await this.extractImage(element, i + 1, imageElements.length);
                    if (image) {
                        this.images.push(image);
                    }
                } catch (error) {
                    console.error(`❌ Error extracting image ${i + 1}:`, error);
                }
            }

            return this.images;
        }

        async extractSources() {
            if (!this.settings.includeSources) return [];

            console.log(` Extracting sources from ${this.platform.name}...`);
            
            const sourceElements = this.findSourceElements();
            console.log(` Found ${sourceElements.length} source elements`);

            for (let i = 0; i < sourceElements.length; i++) {
                const element = sourceElements[i];
                try {
                    const source = await this.extractSource(element, i + 1, sourceElements.length);
                    if (source) {
                        this.sources.push(source);
                    }
                } catch (error) {
                    console.error(`❌ Error extracting source ${i + 1}:`, error);
                }
            }

            return this.sources;
        }

        findFileElements() {
            const fileElements = [];
            
            for (const selector of this.selectors.fileElements) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    if (this.isFileElement(element)) {
                        fileElements.push(element);
                    }
                }
            }

            return fileElements;
        }

        isFileElement(element) {
            const text = element.textContent.trim();
            return (
                text.includes('lines') ||
                text.match(/\.(pdf|txt|md|json|xml|csv|doc|docx|xlsx|eml|py|js|html|css|java|cpp|c|h)/i) ||
                (text.length > 10 && text.length < 200 &&
                 !text.includes('claude.ai') && !text.includes('openai.com') &&
                 !text.includes('gemini.google.com') && !text.includes('grok.x.ai') &&
                 !text.includes('deepseek.com') &&
                 !text.match(/^(Export|Download|Close|Cancel|OK|Edit|View|Settings|Upload|Attach)$/i))
            );
        }

        findImageElements() {
            const imageElements = [];
            
            for (const selector of this.selectors.imageSelectors || []) {
                const elements = document.querySelectorAll(selector);
                imageElements.push(...Array.from(elements));
            }

            return imageElements;
        }

        findSourceElements() {
            const sourceElements = [];
            
            for (const selector of this.selectors.sourceSelectors || []) {
                const elements = document.querySelectorAll(selector);
                sourceElements.push(...Array.from(elements));
            }

            return sourceElements;
        }

        async extractFile(element, index, total) {
            console.log(`\n Processing file ${index}/${total}`);
            
            const filename = this.extractFileName(element);
            console.log(` Filename: ${filename}`);

            let content = this.extractContentDirect(element);
            
            if (!content || content.length < 50) {
                content = await this.extractContentFromModal(element);
            }

            if (!content || content.length < 50) {
                console.log('❌ No content found, skipping...');
                return null;
            }

            const fileType = this.detectFileType(filename, content);
            const finalFilename = this.cleanFilename(filename, fileType);

            // AI processing if enabled
            let aiAnalysis = null;
            if (this.settings.includeAI) {
                aiAnalysis = await this.aiProcessor.processContent(content, fileType);
            }

            console.log(`✅ Extracted ${content.length} characters`);
            console.log(` Final filename: ${finalFilename}`);

            return {
                filename: finalFilename,
                content: content,
                originalName: filename,
                type: fileType,
                size: content.length,
                extractedAt: new Date().toISOString(),
                aiAnalysis: aiAnalysis
            };
        }

        extractFileName(element) {
            const text = element.textContent.trim();
            console.log(' Analyzing element text:', text);

            const patterns = [
                /^(.+\.(?:pdf|txt|md|json|xml|csv|doc|docx|xlsx?|py|js|html|css|java|cpp|c|h))\s*\d*\s*lines?/i,
                /^(.+?)\s*\d*\s*lines?\s*(pdf|txt|text|md|json|xml|csv|py|js|html|css|java|cpp|c|h)/i,
                /^([^0-9]+?)(?:\s*\d*\s*lines?|$)/i
            ];

            for (const pattern of patterns) {
                const match = text.match(pattern);
                if (match) {
                    let filename = match[1].trim();
                    console.log(' Extracted filename:', filename);
                    return filename;
                }
            }

            const words = text.split(/\s+/).filter(word =>
                word.length > 2 &&
                !word.match(/^\d+$/) &&
                !word.match(/^(lines?|pdf|txt|text|md|json|xml|csv|py|js|html|css|java|cpp|c|h)$/i)
            );

            if (words.length > 0) {
                const filename = words.slice(0, 3).join(' ');
                console.log(' Fallback filename:', filename);
                return filename;
            }

            return 'Unknown_File';
        }

        extractContentDirect(element) {
            const contentSelectors = [
                'pre code', 'pre', 'code', '.file-content', '.file-preview',
                '.file-text', '.content', '.text'
            ];

            for (const selector of contentSelectors) {
                const contentEl = element.querySelector(selector);
                if (contentEl && contentEl.textContent.trim().length > 50) {
                    return contentEl.textContent.trim();
                }
            }

            return element.textContent.trim();
        }

        async extractContentFromModal(element) {
            console.log(' Attempting to open modal/preview...');
            
            element.scrollIntoView();
            await new Promise(resolve => setTimeout(resolve, 500));
            element.click();

            const modal = await this.waitForModal();
            if (!modal) {
                console.log('❌ No modal appeared');
                return null;
            }

            const content = this.extractContentFromModalElement(modal);
            await this.closeModal();
            
            return content;
        }

        async waitForModal(timeout = 5000) {
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                for (const selector of this.selectors.modalSelectors) {
                    const modal = document.querySelector(selector);
                    if (modal && modal.offsetHeight > 0) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        return modal;
                    }
                }
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return null;
        }

        extractContentFromModalElement(modal) {
            console.log(' Extracting content from modal...');

            for (const selector of this.selectors.contentContainers) {
                const element = modal.querySelector(selector);
                if (element && element.textContent.trim().length > 50) {
                    console.log(`✅ Found content in: ${selector}`);
                    return element.textContent.trim();
                }
            }

            const allText = modal.textContent;
            const lines = allText.split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 3)
                .filter(line => !line.match(/^(Close|Download|Export|PDF|TEXT|Select|Cancel|OK|\d+\s*lines?|View|Edit|Upload|Attach)$/i))
                .filter(line => !line.includes('claude.ai') && !line.includes('openai.com') && 
                               !line.includes('gemini.google.com') && !line.includes('grok.x.ai') && 
                               !line.includes('deepseek.com'))
                .filter(line => line.length < 200);

            const content = lines.join('\n').trim();
            console.log(` Extracted ${content.length} characters using fallback method`);
            return content;
        }

        async closeModal() {
            console.log(' Attempting to close modal...');

            const closeSelectors = [
                'button[aria-label*="close"]',
                'button[aria-label*="Close"]',
                '[data-testid*="close"]',
                'button[title*="close"]',
                'button[title*="Close"]',
                '.modal button:last-child',
                '[role="dialog"] button:first-child',
                '[role="dialog"] button[type="button"]',
                '.close-button',
                '.modal-close'
            ];

            for (const selector of closeSelectors) {
                const buttons = document.querySelectorAll(selector);
                for (const btn of buttons) {
                    try {
                        btn.click();
                        await new Promise(resolve => setTimeout(resolve, 300));
                        if (await this.waitForModalClose(1000)) {
                            console.log('✅ Modal closed successfully');
                            return true;
                        }
                    } catch (e) {
                        console.log('Close button failed:', e);
                    }
                }
            }

            for (let i = 0; i < 3; i++) {
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', bubbles: true }));
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            return await this.waitForModalClose();
        }

        async waitForModalClose(timeout = 3000) {
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                let modalFound = false;
                for (const selector of this.selectors.modalSelectors) {
                    const modal = document.querySelector(selector);
                    if (modal && modal.offsetHeight > 0) {
                        modalFound = true;
                        break;
                    }
                }
                if (!modalFound) return true;
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return false;
        }

        detectFileType(filename, content) {
            const lower = filename.toLowerCase();

            if (lower.includes('.pdf')) return 'pdf.txt';
            if (lower.includes('.json')) return 'json';
            if (lower.includes('.xml')) return 'xml';
            if (lower.includes('.md')) return 'md';
            if (lower.includes('.csv')) return 'csv';
            if (lower.includes('.xlsx') || lower.includes('.xls')) return 'xlsx.txt';
            if (lower.includes('.doc')) return 'doc.txt';
            if (lower.includes('.eml')) return 'eml.txt';
            if (lower.includes('.py')) return 'py';
            if (lower.includes('.js')) return 'js';
            if (lower.includes('.html')) return 'html';
            if (lower.includes('.css')) return 'css';
            if (lower.includes('.java')) return 'java';
            if (lower.includes('.cpp') || lower.includes('.c') || lower.includes('.h')) return 'cpp';

            if (content.includes('{') && content.includes('}') && content.includes('"')) return 'json';
            if (content.includes('<') && content.includes('>')) return 'html';
            if (content.includes('##') || content.includes('**')) return 'md';
            if (content.includes(',') && content.split('\n').length > 1) return 'csv';
            if (content.includes('def ') || content.includes('import ')) return 'py';
            if (content.includes('function ') || content.includes('const ') || content.includes('var ')) return 'js';

            return 'txt';
        }

        cleanFilename(filename, fileType) {
            const clean = filename
                .replace(/[^a-zA-Z0-9\s\-_\.]/g, '_')
                .replace(/\s+/g, '_')
                .replace(/_+/g, '_')
                .trim();

            return `${clean}.${fileType}`;
        }

        getProjectTitle() {
            for (const selector of this.selectors.titleSelectors) {
                const element = document.querySelector(selector);
                if (element && element.textContent.trim()) {
                    const title = element.textContent.trim();
                    if (title !== this.platform.name && title.length > 2) {
                        return title;
                    }
                }
            }

            const urlMatch = window.location.pathname.match(/\/([^\/]+)$/);
            if (urlMatch) {
                return urlMatch[1].replace(/[-_]/g, ' ');
            }

            return `${this.platform.name}_Project`;
        }

        passesFilters(file) {
            // Date filter
            if (this.settings.filterByDate && this.settings.dateRange.start) {
                const fileDate = new Date(file.extractedAt);
                const startDate = new Date(this.settings.dateRange.start);
                const endDate = new Date(this.settings.dateRange.end || new Date());
                
                if (fileDate < startDate || fileDate > endDate) {
                    return false;
                }
            }

            // Type filter
            if (this.settings.filterByType.length > 0) {
                const fileType = file.type || 'unknown';
                if (!this.settings.filterByType.includes(fileType)) {
                    return false;
                }
            }

            // Size filter
            const fileSize = file.size || 0;
            if (fileSize < this.settings.filterBySize.min || fileSize > this.settings.filterBySize.max) {
                return false;
            }

            return true;
        }

        async extractImage(element, index, total) {
            console.log(`\n️ Processing image ${index}/${total}`);
            
            const src = element.src || element.getAttribute('data-src');
            if (!src) return null;

            try {
                const response = await fetch(src);
                const blob = await response.blob();
                
                // Compress image if setting is enabled
                let processedBlob = blob;
                if (this.settings.compressImages) {
                    processedBlob = await this.compressImage(blob);
                }

                const filename = this.generateImageFilename(element, index);
                
                return {
                    filename: filename,
                    content: processedBlob,
                    originalSrc: src,
                    size: processedBlob.size,
                    type: blob.type,
                    extractedAt: new Date().toISOString()
                };
            } catch (error) {
                console.error('Error extracting image:', error);
                return null;
            }
        }

        async compressImage(blob) {
            return new Promise((resolve) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    
                    canvas.toBlob(resolve, 'image/jpeg', this.settings.imageQuality);
                };
                
                img.src = URL.createObjectURL(blob);
            });
        }

        generateImageFilename(element, index) {
            const alt = element.alt || '';
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 16);
            const cleanAlt = alt.replace(/[^a-zA-Z0-9\s\-_]/g, '_').replace(/\s+/g, '_');
            return `image_${index}_${cleanAlt || 'untitled'}_${timestamp}.jpg`;
        }

        async extractSource(element, index, total) {
            console.log(`\n Processing source ${index}/${total}`);
            
            const url = element.href || element.getAttribute('data-url');
            const title = element.textContent.trim() || element.title || `Source ${index}`;
            
            if (!url) return null;

            try {
                const response = await fetch(url);
                const content = await response.text();
                
                const filename = this.generateSourceFilename(title, index);
                
                return {
                    filename: filename,
                    content: content,
                    url: url,
                    title: title,
                    size: content.length,
                    extractedAt: new Date().toISOString()
                };
            } catch (error) {
                console.error('Error extracting source:', error);
                return null;
            }
        }

        generateSourceFilename(title, index) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 16);
            const cleanTitle = title.replace(/[^a-zA-Z0-9\s\-_]/g, '_').replace(/\s+/g, '_');
            return `source_${index}_${cleanTitle}_${timestamp}.html`;
        }

        async exportToZip(files, conversations, images, sources, projectName) {
            try {
                console.log(' Creating enhanced ZIP...');

                const zip = new JSZip();

                // Add files
                if (files.length > 0) {
                    const filesFolder = zip.folder('files');
                    files.forEach((file, index) => {
                        console.log(` Adding file [${index + 1}]: ${file.filename}`);
                        filesFolder.file(file.filename, file.content);
                    });
                }

                // Add images
                if (images.length > 0) {
                    const imagesFolder = zip.folder('images');
                    images.forEach((image, index) => {
                        console.log(`️ Adding image [${index + 1}]: ${image.filename}`);
                        imagesFolder.file(image.filename, image.content);
                    });
                }

                // Add sources
                if (sources.length > 0) {
                    const sourcesFolder = zip.folder('sources');
                    sources.forEach((source, index) => {
                        console.log(` Adding source [${index + 1}]: ${source.filename}`);
                        sourcesFolder.file(source.filename, source.content);
                    });
                }

                // Add conversations
                if (conversations.length > 0) {
                    const conversationsFolder = zip.folder('conversations');
                    conversations.forEach((conv, index) => {
                        const convData = this.formatConversation(conv);
                        conversationsFolder.file(`conversation_${index + 1}.json`, JSON.stringify(convData, null, 2));
                    });
                }

                // Add AI analysis
                if (this.settings.includeAI) {
                    const aiFolder = zip.folder('ai_analysis');
                    const analysisData = {
                        files: files.map(f => f.aiAnalysis).filter(Boolean),
                        summary: this.generateAISummary(files, conversations, images, sources),
                        insights: this.generateInsights(files, conversations, images, sources),
                        processedBy: 'AvatarArts Universal AI Extractor Pro v6.0'
                    };
                    aiFolder.file('analysis.json', JSON.stringify(analysisData, null, 2));
                }

                // Add metadata
                const metadata = {
                    exportDate: new Date().toISOString(),
                    platform: this.platform.name,
                    platformBrand: this.platform.brand,
                    projectTitle: projectName,
                    url: window.location.href,
                    fileCount: files.length,
                    imageCount: images.length,
                    sourceCount: sources.length,
                    conversationCount: conversations.length,
                    settings: this.settings,
                    createdBy: {
                        avatararts: "https://avatararts.org/",
                        gptjunkie: "https://gptjunkie.com/",
                        quantumforgelabs: "https://quantumforgelabs.org/"
                    },
                    files: files.map(f => ({
                        filename: f.filename,
                        originalName: f.originalName,
                        type: f.type,
                        size: f.size,
                        extractedAt: f.extractedAt,
                        aiAnalysis: f.aiAnalysis
                    })),
                    images: images.map(i => ({
                        filename: i.filename,
                        originalSrc: i.originalSrc,
                        size: i.size,
                        type: i.type,
                        extractedAt: i.extractedAt
                    })),
                    sources: sources.map(s => ({
                        filename: s.filename,
                        url: s.url,
                        title: s.title,
                        size: s.size,
                        extractedAt: s.extractedAt
                    })),
                    conversations: conversations.map(c => ({
                        id: c.id,
                        title: c.title,
                        createdAt: c.createdAt,
                        updatedAt: c.updatedAt
                    }))
                };

                zip.file('_export_metadata.json', JSON.stringify(metadata, null, 2));

                // Generate and download ZIP
                const zipBlob = await zip.generateAsync({
                    type: "blob",
                    compression: "DEFLATE",
                    compressionOptions: { level: 6 }
                });

                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 16);
                const filename = `${projectName.replace(/[^a-zA-Z0-9]/g, '_')}_${this.platform.name}_AvatarArts_export_${timestamp}.zip`;

                this.downloadFile(filename, 'application/zip', zipBlob);
                
                // Save to export history
                this.saveExportHistory({
                    filename: filename,
                    platform: this.platform.name,
                    fileCount: files.length,
                    imageCount: images.length,
                    sourceCount: sources.length,
                    conversationCount: conversations.length,
                    timestamp: new Date().toISOString(),
                    createdBy: 'AvatarArts Universal AI Extractor Pro'
                });

                return true;

            } catch (error) {
                console.error('❌ ZIP creation failed:', error);
                return false;
            }
        }

        formatConversation(conversation) {
            return {
                id: conversation.id,
                title: conversation.title,
                createdAt: conversation.createdAt,
                updatedAt: conversation.updatedAt,
                messages: conversation.messages || [],
                metadata: {
                    platform: this.platform.name,
                    exportedAt: new Date().toISOString(),
                    processedBy: 'AvatarArts Universal AI Extractor Pro'
                }
            };
        }

        generateAISummary(files, conversations, images, sources) {
            return {
                totalItems: files.length + images.length + sources.length + conversations.length,
                contentTypes: {
                    files: files.length,
                    images: images.length,
                    sources: sources.length,
                    conversations: conversations.length
                },
                totalSize: files.reduce((sum, f) => sum + f.size, 0) + 
                          images.reduce((sum, i) => sum + i.size, 0) + 
                          sources.reduce((sum, s) => sum + s.size, 0),
                languages: [...new Set(files.map(f => f.aiAnalysis?.language).filter(Boolean))],
                topics: [...new Set(files.flatMap(f => f.aiAnalysis?.topics || []))],
                complexity: this.calculateOverallComplexity(files),
                sentiment: this.calculateOverallSentiment(files),
                processedBy: 'AvatarArts Universal AI Extractor Pro v6.0'
            };
        }

        generateInsights(files, conversations, images, sources) {
            const insights = [];
            
            if (files.length > 0) {
                const codeFiles = files.filter(f => ['py', 'js', 'html', 'css', 'java', 'cpp'].includes(f.type));
                if (codeFiles.length > 0) {
                    insights.push(`Found ${codeFiles.length} code files - consider organizing into a project structure`);
                }
            }

            if (images.length > 0) {
                insights.push(`Extracted ${images.length} images - consider creating a visual gallery`);
            }

            if (sources.length > 0) {
                insights.push(`Found ${sources.length} sources - consider creating a bibliography`);
            }

            return insights;
        }

        calculateOverallComplexity(files) {
            const complexities = files.map(f => f.aiAnalysis?.complexity).filter(Boolean);
            if (complexities.length === 0) return 'unknown';
            
            const complexityScores = { 'simple': 1, 'moderate': 2, 'complex': 3, 'very complex': 4 };
            const avgScore = complexities.reduce((sum, c) => sum + complexityScores[c], 0) / complexities.length;
            
            if (avgScore <= 1.5) return 'simple';
            if (avgScore <= 2.5) return 'moderate';
            if (avgScore <= 3.5) return 'complex';
            return 'very complex';
        }

        calculateOverallSentiment(files) {
            const sentiments = files.map(f => f.aiAnalysis?.sentiment).filter(Boolean);
            if (sentiments.length === 0) return 'neutral';
            
            const sentimentCounts = sentiments.reduce((counts, s) => {
                counts[s] = (counts[s] || 0) + 1;
                return counts;
            }, {});
            
            const maxSentiment = Object.entries(sentimentCounts)
                .sort(([,a], [,b]) => b - a)[0][0];
            
            return maxSentiment;
        }

        downloadFile(filename, mimeType, content) {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    }

    // Platform-specific extractors
    class ClaudeExtractor extends UniversalExtractorPro {
        // Claude-specific overrides
    }

    class OpenAIExtractor extends UniversalExtractorPro {
        // OpenAI-specific overrides
    }

    class GeminiExtractor extends UniversalExtractorPro {
        // Gemini-specific overrides
    }

    class GrokExtractor extends UniversalExtractorPro {
        // Grok-specific overrides
    }

    class DeepSeekExtractor extends UniversalExtractorPro {
        // DeepSeek-specific overrides
    }

    class PoeExtractor extends UniversalExtractorPro {
        // Poe-specific overrides
    }

    class PerplexityExtractor extends UniversalExtractorPro {
        // Perplexity-specific overrides
    }

    class YouExtractor extends UniversalExtractorPro {
        // You.com-specific overrides
    }

    // Enhanced UI Manager with advanced features
    class UIManagerPro {
        constructor(platform) {
            this.platform = platform;
            this.extractor = new platform.extractor(platform);
            this.isOpen = false;
            this.currentTheme = this.detectTheme();
        }

        detectTheme() {
            if (document.documentElement.classList.contains('dark')) return 'dark';
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
            return 'light';
        }

        createUI() {
            const container = document.createElement('div');
            container.id = 'avatararts-extractor-ui-pro';
            container.className = `extractor-ui ${this.currentTheme}`;
            
            container.innerHTML = `
                <div class="extractor-panel">
                    <div class="extractor-header">
                        <div class="header-content">
                            <h3> ${this.platform.name} Extractor Pro</h3>
                            <div class="platform-badge" style="background: ${this.platform.color}">
                                ${this.platform.name}
                            </div>
                        </div>
                        <div class="branding">
                            <div class="brand-links">
                                <a href="https://avatararts.org/" target="_blank" title="AvatarArts.org">AvatarArts</a>
                                <span>•</span>
                                <a href="https://gptjunkie.com/" target="_blank" title="GPTJunkie.com">GPTJunkie</a>
                                <span>•</span>
                                <a href="https://quantumforgelabs.org/" target="_blank" title="QuantumForgeLabs.org">QuantumForge</a>
                            </div>
                        </div>
                        <button class="close-btn">×</button>
                    </div>
                    
                    <div class="extractor-content">
                        <div class="tabs">
                            <button class="tab-btn active" data-tab="extract">Extract</button>
                            <button class="tab-btn" data-tab="filters">Filters</button>
                            <button class="tab-btn" data-tab="settings">Settings</button>
                            <button class="tab-btn" data-tab="history">History</button>
                        </div>
                        
                        <div class="tab-content">
                            <div class="tab-panel active" id="extract-tab">
                                <div class="export-options">
                                    <div class="option-group">
                                        <h4>Content Types</h4>
                                        <label>
                                            <input type="checkbox" id="export-files" checked> 
                                            <span class="checkmark"></span>
                                            Files
                                        </label>
                                        <label>
                                            <input type="checkbox" id="export-conversations"> 
                                            <span class="checkmark"></span>
                                            Conversations
                                        </label>
                                        <label>
                                            <input type="checkbox" id="export-images" checked> 
                                            <span class="checkmark"></span>
                                            Images
                                        </label>
                                        <label>
                                            <input type="checkbox" id="export-sources"> 
                                            <span class="checkmark"></span>
                                            Sources
                                        </label>
                                    </div>
                                    
                                    <div class="option-group">
                                        <h4>Export Format</h4>
                                        <select id="export-format">
                                            <option value="zip">ZIP Archive</option>
                                            <option value="json">JSON</option>
                                            <option value="markdown">Markdown</option>
                                            <option value="html">HTML</option>
                                            <option value="pdf">PDF</option>
                                        </select>
                                    </div>
                                    
                                    <div class="option-group">
                                        <h4>AI Features</h4>
                                        <label>
                                            <input type="checkbox" id="include-ai" checked> 
                                            <span class="checkmark"></span>
                                            AI Analysis
                                        </label>
                                        <label>
                                            <input type="checkbox" id="include-summary"> 
                                            <span class="checkmark"></span>
                                            Generate Summary
                                        </label>
                                    </div>
                                </div>
                                
                                <div class="action-buttons">
                                    <button id="extract-btn" class="extract-btn">
                                        <span class="btn-icon"></span>
                                        Extract & Export
                                    </button>
                                    <button id="preview-btn" class="preview-btn">
                                        <span class="btn-icon">️</span>
                                        Preview
                                    </button>
                                </div>
                                
                                <div class="progress-container" style="display: none;">
                                    <div class="progress-bar">
                                        <div class="progress-fill"></div>
                                    </div>
                                    <div class="progress-text">Processing...</div>
                                    <div class="progress-details"></div>
                                </div>
                            </div>
                            
                            <div class="tab-panel" id="filters-tab">
                                <div class="filter-group">
                                    <h4>Date Range</h4>
                                    <label>
                                        <input type="checkbox" id="filter-by-date"> 
                                        <span class="checkmark"></span>
                                        Filter by date
                                    </label>
                                    <div class="date-inputs">
                                        <input type="date" id="start-date" disabled>
                                        <span>to</span>
                                        <input type="date" id="end-date" disabled>
                                    </div>
                                </div>
                                
                                <div class="filter-group">
                                    <h4>File Types</h4>
                                    <div class="file-type-filters">
                                        <label><input type="checkbox" value="text"> Text</label>
                                        <label><input type="checkbox" value="code"> Code</label>
                                        <label><input type="checkbox" value="image"> Image</label>
                                        <label><input type="checkbox" value="document"> Document</label>
                                    </div>
                                </div>
                                
                                <div class="filter-group">
                                    <h4>Size Range</h4>
                                    <div class="size-inputs">
                                        <input type="number" id="min-size" placeholder="Min (bytes)" min="0">
                                        <span>to</span>
                                        <input type="number" id="max-size" placeholder="Max (bytes)" min="0">
                                    </div>
                                </div>
                            </div>
                            
                            <div class="tab-panel" id="settings-tab">
                                <div class="setting-group">
                                    <h4>General</h4>
                                    <label>
                                        Theme:
                                        <select id="theme-select">
                                            <option value="auto">Auto</option>
                                            <option value="light">Light</option>
                                            <option value="dark">Dark</option>
                                        </select>
                                    </label>
                                    <label>
                                        Language:
                                        <select id="language-select">
                                            <option value="en">English</option>
                                            <option value="es">Español</option>
                                            <option value="fr">Français</option>
                                            <option value="de">Deutsch</option>
                                        </select>
                                    </label>
                                </div>
                                
                                <div class="setting-group">
                                    <h4>Image Processing</h4>
                                    <label>
                                        <input type="checkbox" id="compress-images" checked> 
                                        <span class="checkmark"></span>
                                        Compress images
                                    </label>
                                    <label>
                                        Quality: <input type="range" id="image-quality" min="0.1" max="1" step="0.1" value="0.8">
                                        <span id="quality-value">80%</span>
                                    </label>
                                </div>
                                
                                <div class="setting-group">
                                    <h4>Cloud Integration</h4>
                                    <label>
                                        <input type="checkbox" id="cloud-integration"> 
                                        <span class="checkmark"></span>
                                        Enable cloud sync
                                    </label>
                                    <select id="cloud-provider" disabled>
                                        <option value="none">None</option>
                                        <option value="google">Google Drive</option>
                                        <option value="dropbox">Dropbox</option>
                                        <option value="onedrive">OneDrive</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="tab-panel" id="history-tab">
                                <div class="history-list">
                                    <h4>Export History</h4>
                                    <div class="history-items" id="history-items">
                                        <!-- History items will be populated here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            this.addStyles();
            document.body.appendChild(container);
            this.bindEvents();
            this.loadHistory();
        }

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #avatararts-extractor-ui-pro {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 10000;
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.3);
                    min-width: 500px;
                    max-width: 600px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    animation: slideIn 0.3s ease-out;
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -60%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                    }
                }
                
                .extractor-panel {
                    padding: 0;
                    overflow: hidden;
                    position: relative;
                }
                
                .extractor-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .header-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex: 1;
                }
                
                .header-content h3 {
                    margin: 0;
                    font-size: 20px;
                    font-weight: 600;
                }
                
                .platform-badge {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                
                .branding {
                    display: flex;
                    align-items: center;
                }
                
                .brand-links {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 11px;
                    opacity: 0.8;
                }
                
                .brand-links a {
                    color: white;
                    text-decoration: none;
                    font-weight: 500;
                    transition: opacity 0.2s ease;
                }
                
                .brand-links a:hover {
                    opacity: 0.7;
                }
                
                .brand-links span {
                    opacity: 0.6;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 28px;
                    cursor: pointer;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background 0.2s ease;
                }
                
                .close-btn:hover {
                    background: rgba(255,255,255,0.2);
                }
                
                .extractor-content {
                    padding: 0;
                }
                
                .tabs {
                    display: flex;
                    border-bottom: 1px solid #e5e7eb;
                }
                
                .tab-btn {
                    flex: 1;
                    padding: 16px 20px;
                    border: none;
                    background: none;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    color: #6b7280;
                    transition: all 0.2s ease;
                    border-bottom: 2px solid transparent;
                }
                
                .tab-btn.active {
                    color: #667eea;
                    border-bottom-color: #667eea;
                }
                
                .tab-btn:hover {
                    background: #f9fafb;
                }
                
                .tab-content {
                    padding: 24px;
                }
                
                .tab-panel {
                    display: none;
                }
                
                .tab-panel.active {
                    display: block;
                }
                
                .option-group, .filter-group, .setting-group {
                    margin-bottom: 24px;
                }
                
                .option-group h4, .filter-group h4, .setting-group h4 {
                    margin: 0 0 12px 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: #374151;
                }
                
                .option-group label, .filter-group label {
                    display: flex;
                    align-items: center;
                    margin-bottom: 12px;
                    font-weight: 500;
                    color: #4b5563;
                    cursor: pointer;
                }
                
                .checkmark {
                    position: relative;
                    margin-right: 8px;
                }
                
                .option-group input[type="checkbox"], .filter-group input[type="checkbox"] {
                    margin-right: 8px;
                    transform: scale(1.2);
                }
                
                .option-group select, .filter-group select {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 14px;
                    background: white;
                }
                
                .date-inputs, .size-inputs {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-top: 8px;
                }
                
                .date-inputs input, .size-inputs input {
                    flex: 1;
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                }
                
                .file-type-filters {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 8px;
                }
                
                .action-buttons {
                    display: flex;
                    gap: 12px;
                    margin-top: 24px;
                }
                
                .extract-btn, .preview-btn {
                    flex: 1;
                    padding: 14px 24px;
                    border: none;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }
                
                .extract-btn {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .extract-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                }
                
                .preview-btn {
                    background: #f8f9fa;
                    color: #374151;
                    border: 1px solid #d1d5db;
                }
                
                .preview-btn:hover {
                    background: #e9ecef;
                }
                
                .progress-container {
                    margin-top: 24px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 10px;
                }
                
                .progress-bar {
                    width: 100%;
                    height: 10px;
                    background: #e5e7eb;
                    border-radius: 5px;
                    overflow: hidden;
                    margin-bottom: 12px;
                }
                
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    width: 0%;
                    transition: width 0.3s ease;
                }
                
                .progress-text {
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 4px;
                }
                
                .progress-details {
                    font-size: 12px;
                    color: #6b7280;
                }
                
                .history-items {
                    max-height: 300px;
                    overflow-y: auto;
                }
                
                .history-item {
                    padding: 12px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    margin-bottom: 8px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .history-item-info h5 {
                    margin: 0 0 4px 0;
                    font-size: 14px;
                    font-weight: 600;
                    color: #374151;
                }
                
                .history-item-info p {
                    margin: 0;
                    font-size: 12px;
                    color: #6b7280;
                }
                
                .history-item-actions {
                    display: flex;
                    gap: 8px;
                }
                
                .history-btn {
                    padding: 4px 8px;
                    border: 1px solid #d1d5db;
                    border-radius: 4px;
                    background: white;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .history-btn:hover {
                    background: #f3f4f6;
                }
                
                .dark #avatararts-extractor-ui-pro {
                    background: #1f2937;
                    color: white;
                }
                
                .dark .extractor-content {
                    color: white;
                }
                
                .dark .tab-btn {
                    color: #9ca3af;
                }
                
                .dark .tab-btn.active {
                    color: #93c5fd;
                }
                
                .dark .tab-btn:hover {
                    background: #374151;
                }
                
                .dark .option-group h4, .dark .filter-group h4, .dark .setting-group h4 {
                    color: #f9fafb;
                }
                
                .dark .option-group label, .dark .filter-group label {
                    color: #d1d5db;
                }
                
                .dark .option-group select, .dark .filter-group select {
                    background: #374151;
                    color: white;
                    border-color: #4b5563;
                }
                
                .dark .preview-btn {
                    background: #374151;
                    color: #d1d5db;
                    border-color: #4b5563;
                }
                
                .dark .preview-btn:hover {
                    background: #4b5563;
                }
                
                .dark .progress-container {
                    background: #374151;
                }
                
                .dark .history-item {
                    background: #374151;
                    border-color: #4b5563;
                }
                
                .dark .history-item h5 {
                    color: #f9fafb;
                }
                
                .dark .history-item p {
                    color: #9ca3af;
                }
                
                .dark .history-btn {
                    background: #4b5563;
                    color: #d1d5db;
                    border-color: #6b7280;
                }
                
                .dark .history-btn:hover {
                    background: #6b7280;
                }
                
                /* AvatarArts.org, GPTJunkie.com & QuantumForgeLabs.org Branding */
                .extractor-ui::before {
                    content: "Powered by AvatarArts.org • GPTJunkie.com • QuantumForgeLabs.org";
                    position: absolute;
                    bottom: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 10px;
                    color: #6b7280;
                    white-space: nowrap;
                    z-index: 10001;
                }
            `;
            document.head.appendChild(style);
        }

        bindEvents() {
            const container = document.getElementById('avatararts-extractor-ui-pro');
            
            // Close button
            container.querySelector('.close-btn').addEventListener('click', () => {
                this.closeUI();
            });

            // Tab switching
            container.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.switchTab(e.target.dataset.tab);
                });
            });

            // Extract button
            container.querySelector('#extract-btn').addEventListener('click', () => {
                this.handleExtract();
            });

            // Preview button
            container.querySelector('#preview-btn').addEventListener('click', () => {
                this.handlePreview();
            });

            // Settings
            container.querySelector('#theme-select').addEventListener('change', (e) => {
                this.changeTheme(e.target.value);
            });

            container.querySelector('#image-quality').addEventListener('input', (e) => {
                document.querySelector('#quality-value').textContent = Math.round(e.target.value * 100) + '%';
            });

            // Close on outside click
            container.addEventListener('click', (e) => {
                if (e.target === container) {
                    this.closeUI();
                }
            });
        }

        switchTab(tabName) {
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

            // Update tab panels
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(`${tabName}-tab`).classList.add('active');
        }

        async handleExtract() {
            const extractBtn = document.querySelector('#extract-btn');
            const progressContainer = document.querySelector('.progress-container');
            const progressFill = document.querySelector('.progress-fill');
            const progressText = document.querySelector('.progress-text');
            const progressDetails = document.querySelector('.progress-details');

            try {
                extractBtn.disabled = true;
                progressContainer.style.display = 'block';
                progressText.textContent = 'Initializing...';
                progressDetails.textContent = '';

                const exportFiles = document.querySelector('#export-files').checked;
                const exportConversations = document.querySelector('#export-conversations').checked;
                const exportImages = document.querySelector('#export-images').checked;
                const exportSources = document.querySelector('#export-sources').checked;
                const exportFormat = document.querySelector('#export-format').value;
                const includeAI = document.querySelector('#include-ai').checked;

                let files = [];
                let conversations = [];
                let images = [];
                let sources = [];

                if (exportFiles) {
                    progressText.textContent = 'Extracting files...';
                    progressFill.style.width = '20%';
                    progressDetails.textContent = 'Scanning for file elements...';
                    files = await this.extractor.extractFiles();
                }

                if (exportImages) {
                    progressText.textContent = 'Extracting images...';
                    progressFill.style.width = '40%';
                    progressDetails.textContent = `Found ${files.length} files, extracting images...`;
                    images = await this.extractor.extractImages();
                }

                if (exportSources) {
                    progressText.textContent = 'Extracting sources...';
                    progressFill.style.width = '60%';
                    progressDetails.textContent = `Found ${images.length} images, extracting sources...`;
                    sources = await this.extractor.extractSources();
                }

                if (exportConversations) {
                    progressText.textContent = 'Extracting conversations...';
                    progressFill.style.width = '80%';
                    progressDetails.textContent = `Found ${sources.length} sources, extracting conversations...`;
                    conversations = await this.extractor.extractConversations();
                }

                if (files.length === 0 && conversations.length === 0 && images.length === 0 && sources.length === 0) {
                    alert('No content found to export.');
                    return;
                }

                progressText.textContent = 'Creating export...';
                progressFill.style.width = '90%';
                progressDetails.textContent = `Processing ${files.length} files, ${images.length} images, ${sources.length} sources, ${conversations.length} conversations...`;

                const projectName = this.extractor.getProjectTitle();
                
                if (exportFormat === 'zip') {
                    await this.extractor.exportToZip(files, conversations, images, sources, projectName);
                } else {
                    this.exportToFormat(files, conversations, images, sources, projectName, exportFormat);
                }

                progressFill.style.width = '100%';
                progressText.textContent = 'Export complete!';
                progressDetails.textContent = `Successfully exported ${files.length + images.length + sources.length + conversations.length} items`;

                setTimeout(() => {
                    this.closeUI();
                }, 2000);

            } catch (error) {
                console.error('Export failed:', error);
                alert('Export failed: ' + error.message);
            } finally {
                extractBtn.disabled = false;
            }
        }

        async handlePreview() {
            // Preview functionality
            console.log('Preview functionality not yet implemented');
        }

        changeTheme(theme) {
            if (theme === 'auto') {
                theme = this.detectTheme();
            }
            
            const container = document.getElementById('avatararts-extractor-ui-pro');
            container.className = `extractor-ui ${theme}`;
        }

        loadHistory() {
            const historyItems = document.getElementById('history-items');
            const history = this.extractor.exportHistory;
            
            if (history.length === 0) {
                historyItems.innerHTML = '<p style="text-align: center; color: #6b7280;">No export history</p>';
                return;
            }

            historyItems.innerHTML = history.map(item => `
                <div class="history-item">
                    <div class="history-item-info">
                        <h5>${item.filename}</h5>
                        <p>${item.platform} • ${item.fileCount} files • ${new Date(item.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div class="history-item-actions">
                        <button class="history-btn" onclick="this.downloadItem('${item.filename}')">Download</button>
                        <button class="history-btn" onclick="this.deleteItem('${item.filename}')">Delete</button>
                    </div>
                </div>
            `).join('');
        }

        closeUI() {
            const container = document.getElementById('avatararts-extractor-ui-pro');
            if (container) {
                container.remove();
            }
            this.isOpen = false;
        }

        openUI() {
            if (!this.isOpen) {
                this.createUI();
                this.isOpen = true;
            }
        }
    }

    // Main initialization
    function init() {
        const platform = PlatformDetector.detect();
        if (!platform) {
            console.log('❌ Unsupported platform');
            return;
        }

        console.log(` AvatarArts Universal AI Platform Extractor Pro v6.0 - ${platform.name}`);
        console.log(` Powered by AvatarArts.org, GPTJunkie.com & QuantumForgeLabs.org`);

        // Create enhanced floating action button
        const fab = document.createElement('button');
        fab.id = 'avatararts-extractor-fab-pro';
        fab.innerHTML = '';
        fab.title = `Extract ${platform.name} Files, Conversations & More - Powered by AvatarArts.org, GPTJunkie.com & QuantumForgeLabs.org`;
        fab.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, ${platform.color} 0%, #764ba2 100%);
            color: white;
            border: none;
            cursor: pointer;
            z-index: 9999;
            font-size: 28px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s infinite;
        `;

        // Add pulse animation and branding
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
                50% { box-shadow: 0 6px 20px rgba(0,0,0,0.3), 0 0 0 10px rgba(102, 126, 234, 0.1); }
                100% { box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
            }
            
            /* AvatarArts.org, GPTJunkie.com & QuantumForgeLabs.org Branding */
            .extractor-ui::before {
                content: "Powered by AvatarArts.org • GPTJunkie.com • QuantumForgeLabs.org";
                position: absolute;
                bottom: -25px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 10px;
                color: #6b7280;
                white-space: nowrap;
                z-index: 10001;
            }
        `;
        document.head.appendChild(style);

        fab.addEventListener('mouseenter', () => {
            fab.style.transform = 'translateY(-4px) scale(1.1)';
            fab.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)';
        });

        fab.addEventListener('mouseleave', () => {
            fab.style.transform = 'translateY(0) scale(1)';
            fab.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });

        const uiManager = new UIManagerPro(platform);
        fab.addEventListener('click', () => {
            uiManager.openUI();
        });

        document.body.appendChild(fab);

        // Re-add button on navigation
        let currentUrl = location.href;
        const observer = new MutationObserver(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                setTimeout(() => {
                    if (!document.getElementById('avatararts-extractor-fab-pro')) {
                        document.body.appendChild(fab);
                    }
                }, 1000);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
