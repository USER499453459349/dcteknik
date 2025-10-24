// Accessibility Testing - DC TEKNİK
(function() {
    'use strict';
    
    class AccessibilityTesting {
        constructor() {
            this.testResults = {
                wcag: {},
                keyboard: {},
                screenReader: {},
                colorContrast: {},
                semanticHTML: {},
                errors: [],
                warnings: [],
                recommendations: []
            };
            this.init();
        }
        
        init() {
            this.testWCAGCompliance();
            this.testKeyboardNavigation();
            this.testScreenReaderSupport();
            this.testColorContrast();
            this.testSemanticHTML();
            this.testFocusManagement();
            this.testARIALabels();
            this.generateReport();
        }
        
        testWCAGCompliance() {
            const wcag = {
                level: 'AA',
                guidelines: {},
                score: 0
            };
            
            // Test WCAG 2.1 guidelines
            wcag.guidelines = {
                perceivable: this.testPerceivable(),
                operable: this.testOperable(),
                understandable: this.testUnderstandable(),
                robust: this.testRobust()
            };
            
            // Calculate overall score
            const scores = Object.values(wcag.guidelines).map(g => g.score);
            wcag.score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
            
            this.testResults.wcag = wcag;
        }
        
        testPerceivable() {
            const perceivable = {
                score: 0,
                tests: []
            };
            
            // Test 1.1: Non-text content
            const images = document.querySelectorAll('img');
            let imagesWithAlt = 0;
            images.forEach(img => {
                if (img.alt !== undefined && img.alt !== '') {
                    imagesWithAlt++;
                } else {
                    perceivable.tests.push({
                        id: '1.1.1',
                        type: 'error',
                        message: 'Image missing alt text',
                        element: img
                    });
                }
            });
            
            if (images.length > 0) {
                perceivable.score += Math.round((imagesWithAlt / images.length) * 25);
            } else {
                perceivable.score += 25;
            }
            
            // Test 1.3: Adaptable
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            let properHeadingStructure = 0;
            let currentLevel = 0;
            
            headings.forEach(heading => {
                const level = parseInt(heading.tagName.charAt(1));
                if (level <= currentLevel + 1) {
                    properHeadingStructure++;
                    currentLevel = level;
                } else {
                    perceivable.tests.push({
                        id: '1.3.1',
                        type: 'warning',
                        message: 'Improper heading structure',
                        element: heading
                    });
                }
            });
            
            if (headings.length > 0) {
                perceivable.score += Math.round((properHeadingStructure / headings.length) * 25);
            } else {
                perceivable.score += 25;
            }
            
            // Test 1.4: Distinguishable
            const colorContrast = this.testColorContrast();
            perceivable.score += colorContrast.score;
            
            return perceivable;
        }
        
        testOperable() {
            const operable = {
                score: 0,
                tests: []
            };
            
            // Test 2.1: Keyboard accessible
            const keyboardAccessible = this.testKeyboardAccessibility();
            operable.score += keyboardAccessible.score;
            operable.tests.push(...keyboardAccessible.tests);
            
            // Test 2.4: Navigable
            const navigable = this.testNavigability();
            operable.score += navigable.score;
            operable.tests.push(...navigable.tests);
            
            return operable;
        }
        
        testUnderstandable() {
            const understandable = {
                score: 0,
                tests: []
            };
            
            // Test 3.1: Readable
            const readable = this.testReadability();
            understandable.score += readable.score;
            understandable.tests.push(...readable.tests);
            
            // Test 3.2: Predictable
            const predictable = this.testPredictability();
            understandable.score += predictable.score;
            understandable.tests.push(...predictable.tests);
            
            return understandable;
        }
        
        testRobust() {
            const robust = {
                score: 0,
                tests: []
            };
            
            // Test 4.1: Compatible
            const compatible = this.testCompatibility();
            robust.score += compatible.score;
            robust.tests.push(...compatible.tests);
            
            return robust;
        }
        
        testKeyboardNavigation() {
            const keyboard = {
                score: 0,
                tests: [],
                tabOrder: [],
                focusableElements: []
            };
            
            // Find all focusable elements
            const focusableSelectors = [
                'a[href]',
                'button',
                'input',
                'select',
                'textarea',
                '[tabindex]:not([tabindex="-1"])',
                'area[href]',
                'iframe'
            ];
            
            const focusableElements = document.querySelectorAll(focusableSelectors.join(', '));
            keyboard.focusableElements = Array.from(focusableElements);
            
            // Test tab order
            let properTabOrder = 0;
            focusableElements.forEach((element, index) => {
                const tabIndex = element.getAttribute('tabindex');
                if (tabIndex === null || tabIndex === '0' || tabIndex === index.toString()) {
                    properTabOrder++;
                } else {
                    keyboard.tests.push({
                        type: 'warning',
                        message: 'Improper tab order',
                        element: element
                    });
                }
            });
            
            if (focusableElements.length > 0) {
                keyboard.score = Math.round((properTabOrder / focusableElements.length) * 100);
            }
            
            // Test keyboard event handlers
            focusableElements.forEach(element => {
                if (element.onkeydown || element.onkeyup || element.onkeypress) {
                    keyboard.tests.push({
                        type: 'info',
                        message: 'Element has keyboard event handlers',
                        element: element
                    });
                }
            });
            
            this.testResults.keyboard = keyboard;
        }
        
        testKeyboardAccessibility() {
            const result = {
                score: 0,
                tests: []
            };
            
            // Test for keyboard traps
            const focusableElements = document.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            
            if (focusableElements.length > 0) {
                result.score += 50;
            }
            
            // Test for keyboard shortcuts
            const elementsWithAccessKey = document.querySelectorAll('[accesskey]');
            if (elementsWithAccessKey.length > 0) {
                result.score += 25;
                result.tests.push({
                    type: 'info',
                    message: 'Elements with access keys found',
                    count: elementsWithAccessKey.length
                });
            }
            
            // Test for skip links
            const skipLinks = document.querySelectorAll('a[href^="#"]');
            if (skipLinks.length > 0) {
                result.score += 25;
                result.tests.push({
                    type: 'success',
                    message: 'Skip links found',
                    count: skipLinks.length
                });
            }
            
            return result;
        }
        
        testNavigability() {
            const result = {
                score: 0,
                tests: []
            };
            
            // Test for page title
            const title = document.title;
            if (title && title.trim() !== '') {
                result.score += 25;
            } else {
                result.tests.push({
                    type: 'error',
                    message: 'Page title is missing or empty'
                });
            }
            
            // Test for headings
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            if (headings.length > 0) {
                result.score += 25;
            } else {
                result.tests.push({
                    type: 'warning',
                    message: 'No headings found on page'
                });
            }
            
            // Test for landmarks
            const landmarks = document.querySelectorAll('main, nav, aside, section, article, header, footer');
            if (landmarks.length > 0) {
                result.score += 25;
            } else {
                result.tests.push({
                    type: 'warning',
                    message: 'No landmark elements found'
                });
            }
            
            // Test for language declaration
            const lang = document.documentElement.lang;
            if (lang && lang.trim() !== '') {
                result.score += 25;
            } else {
                result.tests.push({
                    type: 'error',
                    message: 'Language declaration is missing'
                });
            }
            
            return result;
        }
        
        testReadability() {
            const result = {
                score: 0,
                tests: []
            };
            
            // Test for language declaration
            const lang = document.documentElement.lang;
            if (lang && lang.trim() !== '') {
                result.score += 50;
            } else {
                result.tests.push({
                    type: 'error',
                    message: 'Language declaration is missing'
                });
            }
            
            // Test for abbreviations
            const abbreviations = document.querySelectorAll('abbr, acronym');
            if (abbreviations.length > 0) {
                result.score += 25;
                result.tests.push({
                    type: 'info',
                    message: 'Abbreviations found',
                    count: abbreviations.length
                });
            }
            
            // Test for definitions
            const definitions = document.querySelectorAll('dfn');
            if (definitions.length > 0) {
                result.score += 25;
                result.tests.push({
                    type: 'info',
                    message: 'Definitions found',
                    count: definitions.length
                });
            }
            
            return result;
        }
        
        testPredictability() {
            const result = {
                score: 0,
                tests: []
            };
            
            // Test for consistent navigation
            const navElements = document.querySelectorAll('nav');
            if (navElements.length > 0) {
                result.score += 50;
            } else {
                result.tests.push({
                    type: 'warning',
                    message: 'No navigation elements found'
                });
            }
            
            // Test for consistent identification
            const buttons = document.querySelectorAll('button');
            const links = document.querySelectorAll('a');
            
            if (buttons.length > 0 || links.length > 0) {
                result.score += 50;
            }
            
            return result;
        }
        
        testCompatibility() {
            const result = {
                score: 0,
                tests: []
            };
            
            // Test for valid HTML
            const htmlValidator = this.validateHTML();
            result.score += htmlValidator.score;
            result.tests.push(...htmlValidator.tests);
            
            return result;
        }
        
        validateHTML() {
            const result = {
                score: 0,
                tests: []
            };
            
            // Test for proper HTML structure
            const html = document.documentElement;
            const head = document.head;
            const body = document.body;
            
            if (html && head && body) {
                result.score += 50;
            } else {
                result.tests.push({
                    type: 'error',
                    message: 'Invalid HTML structure'
                });
            }
            
            // Test for proper nesting
            const improperlyNested = this.findImproperlyNestedElements();
            if (improperlyNested.length === 0) {
                result.score += 50;
            } else {
                result.tests.push({
                    type: 'warning',
                    message: 'Improperly nested elements found',
                    count: improperlyNested.length
                });
            }
            
            return result;
        }
        
        findImproperlyNestedElements() {
            const errors = [];
            
            // Check for inline elements containing block elements
            const inlineElements = document.querySelectorAll('span, a, em, strong, b, i, u, small, sub, sup');
            inlineElements.forEach(inline => {
                const blockElements = inline.querySelectorAll('div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, table, tr, td, th');
                if (blockElements.length > 0) {
                    errors.push({
                        element: inline,
                        message: 'Inline element contains block elements'
                    });
                }
            });
            
            return errors;
        }
        
        testScreenReaderSupport() {
            const screenReader = {
                score: 0,
                tests: []
            };
            
            // Test for ARIA labels
            const ariaLabels = document.querySelectorAll('[aria-label], [aria-labelledby]');
            if (ariaLabels.length > 0) {
                screenReader.score += 25;
                screenReader.tests.push({
                    type: 'success',
                    message: 'ARIA labels found',
                    count: ariaLabels.length
                });
            }
            
            // Test for ARIA roles
            const ariaRoles = document.querySelectorAll('[role]');
            if (ariaRoles.length > 0) {
                screenReader.score += 25;
                screenReader.tests.push({
                    type: 'success',
                    message: 'ARIA roles found',
                    count: ariaRoles.length
                });
            }
            
            // Test for ARIA states
            const ariaStates = document.querySelectorAll('[aria-expanded], [aria-selected], [aria-checked], [aria-pressed]');
            if (ariaStates.length > 0) {
                screenReader.score += 25;
                screenReader.tests.push({
                    type: 'success',
                    message: 'ARIA states found',
                    count: ariaStates.length
                });
            }
            
            // Test for alt text
            const images = document.querySelectorAll('img');
            let imagesWithAlt = 0;
            images.forEach(img => {
                if (img.alt !== undefined && img.alt !== '') {
                    imagesWithAlt++;
                }
            });
            
            if (images.length > 0) {
                screenReader.score += Math.round((imagesWithAlt / images.length) * 25);
            } else {
                screenReader.score += 25;
            }
            
            this.testResults.screenReader = screenReader;
        }
        
        testColorContrast() {
            const colorContrast = {
                score: 0,
                tests: [],
                ratios: []
            };
            
            // Test color contrast for text elements
            const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button, input, label');
            
            textElements.forEach(element => {
                const style = window.getComputedStyle(element);
                const color = style.color;
                const backgroundColor = style.backgroundColor;
                
                if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
                    const ratio = this.calculateColorContrast(color, backgroundColor);
                    colorContrast.ratios.push({
                        element: element,
                        ratio: ratio,
                        color: color,
                        backgroundColor: backgroundColor
                    });
                    
                    if (ratio >= 4.5) {
                        colorContrast.score += 1;
                    } else if (ratio >= 3) {
                        colorContrast.tests.push({
                            type: 'warning',
                            message: 'Color contrast ratio below 4.5:1',
                            element: element,
                            ratio: ratio
                        });
                    } else {
                        colorContrast.tests.push({
                            type: 'error',
                            message: 'Color contrast ratio below 3:1',
                            element: element,
                            ratio: ratio
                        });
                    }
                }
            });
            
            if (colorContrast.ratios.length > 0) {
                colorContrast.score = Math.round((colorContrast.score / colorContrast.ratios.length) * 100);
            }
            
            this.testResults.colorContrast = colorContrast;
        }
        
        calculateColorContrast(color1, color2) {
            // Simplified color contrast calculation
            // In a real implementation, you would use a proper color contrast library
            const rgb1 = this.parseRGB(color1);
            const rgb2 = this.parseRGB(color2);
            
            const luminance1 = this.calculateLuminance(rgb1);
            const luminance2 = this.calculateLuminance(rgb2);
            
            const lighter = Math.max(luminance1, luminance2);
            const darker = Math.min(luminance1, luminance2);
            
            return (lighter + 0.05) / (darker + 0.05);
        }
        
        parseRGB(color) {
            // Simplified RGB parsing
            const match = color.match(/\d+/g);
            if (match && match.length >= 3) {
                return {
                    r: parseInt(match[0]),
                    g: parseInt(match[1]),
                    b: parseInt(match[2])
                };
            }
            return { r: 0, g: 0, b: 0 };
        }
        
        calculateLuminance(rgb) {
            const r = rgb.r / 255;
            const g = rgb.g / 255;
            const b = rgb.b / 255;
            
            const sRGB = [r, g, b].map(c => {
                if (c <= 0.03928) {
                    return c / 12.92;
                } else {
                    return Math.pow((c + 0.055) / 1.055, 2.4);
                }
            });
            
            return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
        }
        
        testSemanticHTML() {
            const semanticHTML = {
                score: 0,
                tests: [],
                elements: {}
            };
            
            // Test for semantic elements
            const semanticElements = [
                'main', 'nav', 'aside', 'section', 'article', 'header', 'footer',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li',
                'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption',
                'form', 'fieldset', 'legend', 'label', 'input', 'select', 'textarea',
                'button', 'a', 'img', 'figure', 'figcaption'
            ];
            
            semanticElements.forEach(element => {
                const elements = document.querySelectorAll(element);
                semanticHTML.elements[element] = elements.length;
                
                if (elements.length > 0) {
                    semanticHTML.score += 1;
                }
            });
            
            semanticHTML.score = Math.round((semanticHTML.score / semanticElements.length) * 100);
            
            this.testResults.semanticHTML = semanticHTML;
        }
        
        testFocusManagement() {
            const focusManagement = {
                score: 0,
                tests: []
            };
            
            // Test for focus indicators
            const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            
            focusableElements.forEach(element => {
                const style = window.getComputedStyle(element);
                const outline = style.outline;
                const boxShadow = style.boxShadow;
                
                if (outline !== 'none' || boxShadow !== 'none') {
                    focusManagement.score += 1;
                } else {
                    focusManagement.tests.push({
                        type: 'warning',
                        message: 'Element lacks visible focus indicator',
                        element: element
                    });
                }
            });
            
            if (focusableElements.length > 0) {
                focusManagement.score = Math.round((focusManagement.score / focusableElements.length) * 100);
            }
            
            return focusManagement;
        }
        
        testARIALabels() {
            const ariaLabels = {
                score: 0,
                tests: []
            };
            
            // Test for proper ARIA usage
            const elementsWithARIA = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
            
            elementsWithARIA.forEach(element => {
                const ariaLabel = element.getAttribute('aria-label');
                const ariaLabelledBy = element.getAttribute('aria-labelledby');
                const ariaDescribedBy = element.getAttribute('aria-describedby');
                
                if (ariaLabel || ariaLabelledBy || ariaDescribedBy) {
                    ariaLabels.score += 1;
                }
            });
            
            if (elementsWithARIA.length > 0) {
                ariaLabels.score = Math.round((ariaLabels.score / elementsWithARIA.length) * 100);
            }
            
            return ariaLabels;
        }
        
        generateReport() {
            const report = {
                timestamp: new Date().toISOString(),
                wcag: this.testResults.wcag,
                keyboard: this.testResults.keyboard,
                screenReader: this.testResults.screenReader,
                colorContrast: this.testResults.colorContrast,
                semanticHTML: this.testResults.semanticHTML,
                summary: this.generateSummary()
            };
            
            console.log('Accessibility Testing Report:', report);
            
            // Send to analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'accessibility_test', {
                    event_category: 'testing',
                    event_label: 'accessibility',
                    custom_map: {
                        wcag_score: report.wcag.score,
                        keyboard_score: report.keyboard.score,
                        screen_reader_score: report.screenReader.score,
                        color_contrast_score: report.colorContrast.score
                    }
                });
            }
            
            return report;
        }
        
        generateSummary() {
            const summary = {
                overallScore: 0,
                wcagScore: this.testResults.wcag.score,
                keyboardScore: this.testResults.keyboard.score,
                screenReaderScore: this.testResults.screenReader.score,
                colorContrastScore: this.testResults.colorContrast.score,
                semanticHTMLScore: this.testResults.semanticHTML.score,
                recommendations: []
            };
            
            // Calculate overall score
            const scores = [
                summary.wcagScore,
                summary.keyboardScore,
                summary.screenReaderScore,
                summary.colorContrastScore,
                summary.semanticHTMLScore
            ];
            
            summary.overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
            
            // Generate recommendations
            if (summary.wcagScore < 80) {
                summary.recommendations.push('Improve WCAG compliance');
            }
            if (summary.keyboardScore < 80) {
                summary.recommendations.push('Improve keyboard navigation');
            }
            if (summary.screenReaderScore < 80) {
                summary.recommendations.push('Improve screen reader support');
            }
            if (summary.colorContrastScore < 80) {
                summary.recommendations.push('Improve color contrast');
            }
            if (summary.semanticHTMLScore < 80) {
                summary.recommendations.push('Improve semantic HTML usage');
            }
            
            return summary;
        }
        
        // Public methods
        getTestResults() {
            return this.testResults;
        }
        
        runSpecificTest(testName) {
            switch (testName) {
                case 'wcag':
                    this.testWCAGCompliance();
                    break;
                case 'keyboard':
                    this.testKeyboardNavigation();
                    break;
                case 'screenReader':
                    this.testScreenReaderSupport();
                    break;
                case 'colorContrast':
                    this.testColorContrast();
                    break;
                case 'semanticHTML':
                    this.testSemanticHTML();
                    break;
                default:
                    console.warn('Unknown test:', testName);
            }
        }
        
        exportResults() {
            const results = this.getTestResults();
            const dataStr = JSON.stringify(results, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `accessibility-test-results-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
        }
    }
    
    // Initialize accessibility testing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.accessibilityTesting = new AccessibilityTesting();
        });
    } else {
        window.accessibilityTesting = new AccessibilityTesting();
    }
})();


