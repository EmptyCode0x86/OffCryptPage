const fs = require('fs');
let content = fs.readFileSync('changelogPremium.html', 'utf8');

// Replacements
content = content.replace(/Screen Lock Builder Premium Changelog/g, 'Offcode Automation Tool Changelog');
content = content.replace(/Screen Lock Builder Premium changelog/g, 'Offcode Automation Tool changelog');
content = content.replace(/premium Windows screen locker builder/g, 'Windows automation tool');
content = content.replace(/Windows Screen Lock Builder Premium/g, 'Offcode Automation Tool');
content = content.replace(/SecurityApplication/g, 'BusinessApplication');
content = content.replace(/ScreenLockBuilderPremium\.html/g, 'AutomationTool.html');
content = content.replace(/Premium1\.png/g, 'OffCodeAutomation.png');
content = content.replace(/changelogPremium\.html/g, 'AutomationChangelog.html');
content = content.replace(/Premium Windows screen lock builder with advanced features including service startup, Safe Mode support, folder lock, website blocking, and AES-256-GCM encryption/g, 'Windows desktop automation tool that combines OCR text detection, UI Automation, and mouse/keyboard simulation');
content = content.replace(/Screen Lock Builder Premium - Service Startup and Safe Mode Support/g, 'Offcode Automation Tool - Multi-Region Read Inside and Stability Fixes');
content = content.replace(/2025-12-21/g, '2026-02-28');
content = content.replace(/Premium Changelog/g, 'Automation Changelog');
content = content.replace(/Welcome to the Screen Lock Builder Premium changelog!/g, 'Welcome to the Offcode Automation Tool changelog!');
content = content.replace(/Screen Lock Builder Premium's/g, 'Offcode Automation Tool\\'s');
content = content.replace(/screen locking solution for Windows/g, 'automation solution for Windows');
content = content.replace(/December 21, 2025 update introduces Windows service startup support and Safe Mode compatibility, enhancing the application's boot performance and security resilience\./g, 'February 28, 2026 update introduces the powerful Multi-Region Read Inside feature and rewrites the background scanning process for perfect stability.');

// Replace the specific changelog wrapper
const entryStart = content.indexOf('<div class="changelog-wrapper">');
const entryEnd = content.indexOf('</div>\n                </div>\n            </div>\n        </main>', entryStart);

const newEntry = `<div class="changelog-wrapper">
                        <!-- February 28, 2026 Update -->
                        <div class="changelog-entry">
                            <div class="changelog-version">
                                <span class="version-tag">Update</span>
                                <span class="version-date">February 28, 2026</span>
                            </div>
                            <div class="changelog-changes">
                                <h3>✨ New Features</h3>
                                <h4>Multi-Region "Read / Click inside" feature</h4>
                                <ul>
                                    <li>Added a new powerful feature to the Visual Reader's Multi-Region Text Collector. When enabled, this completely restricts the bot's vision so that it will only search for text and colors exactly inside the screen regions you have drawn. It ignores everything outside your selected regions, making your automation scripts much more accurate and preventing accidental clicks on wrong targets.</li>
                                </ul>

                                <h3>🐛 Bug Fixes</h3>
                                <h4>Visual Reader Stability Fix</h4>
                                <ul>
                                    <li>Fixed an issue that caused the application to crash immediately if you enabled "Auto Scan" while the Visual Reader was active. The background scanning process has been rewritten to be perfectly stable and prevent these crashes from happening.</li>
                                </ul>
                            </div>
                        </div>`;

content = content.substring(0, entryStart) + newEntry + content.substring(entryEnd);

fs.writeFileSync('AutomationChangelog.html', content, 'utf8');
