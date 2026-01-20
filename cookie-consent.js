/**
 * Cookie Consent Banner for OffCrypt Website
 * GDPR-compliant cookie consent management
 */

(function () {
    'use strict';

    const CONSENT_KEY = 'cookieConsent';
    const CONSENT_ACCEPTED = 'accepted';
    const CONSENT_REJECTED = 'rejected';

    // Check if consent already given
    function hasConsent() {
        return localStorage.getItem(CONSENT_KEY) !== null;
    }

    function getConsent() {
        return localStorage.getItem(CONSENT_KEY);
    }

    function setConsent(value) {
        localStorage.setItem(CONSENT_KEY, value);
    }

    // Create the banner HTML
    function createBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-banner-text">
                    <span class="cookie-icon">🍪</span>
                    <div class="cookie-message">
                        <strong>We use cookies</strong>
                        <p>We use cookies and similar technologies for analytics and advertising. 
                        By clicking "Accept", you consent to the use of these technologies. 
                        <a href="PrivacyPolicy.html" class="cookie-link">Learn more</a></p>
                    </div>
                </div>
                <div class="cookie-banner-buttons">
                    <button id="cookie-reject" class="cookie-btn cookie-btn-reject">
                        <span class="btn-icon">✕</span>
                        <span class="btn-text">Reject</span>
                    </button>
                    <button id="cookie-accept" class="cookie-btn cookie-btn-accept">
                        <span class="btn-icon">✓</span>
                        <span class="btn-text">Accept</span>
                    </button>
                </div>
            </div>
        `;
        return banner;
    }

    // Show the banner with animation
    function showBanner() {
        const banner = createBanner();
        document.body.appendChild(banner);

        // Trigger animation
        requestAnimationFrame(() => {
            banner.classList.add('cookie-banner-visible');
        });

        // Add event listeners
        document.getElementById('cookie-accept').addEventListener('click', acceptCookies);
        document.getElementById('cookie-reject').addEventListener('click', rejectCookies);
    }

    // Hide the banner with animation
    function hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('cookie-banner-visible');
            banner.classList.add('cookie-banner-hiding');
            setTimeout(() => {
                banner.remove();
            }, 300);
        }
    }

    // Accept cookies - load tracking scripts
    function acceptCookies() {
        setConsent(CONSENT_ACCEPTED);
        hideBanner();
        loadTrackingScripts();
    }

    // Reject cookies - don't load tracking scripts
    function rejectCookies() {
        setConsent(CONSENT_REJECTED);
        hideBanner();
    }

    // Load tracking scripts dynamically
    function loadTrackingScripts() {
        // Ahrefs Analytics
        if (!document.querySelector('script[src*="analytics.ahrefs.com"]')) {
            const ahrefsScript = document.createElement('script');
            ahrefsScript.src = 'https://analytics.ahrefs.com/analytics.js';
            ahrefsScript.setAttribute('data-key', 'RJwHY6ZleUxbf9RWbtqXOA');
            ahrefsScript.async = true;
            document.head.appendChild(ahrefsScript);
        }

        // Twitter Conversion Tracking
        if (typeof window.twq === 'undefined') {
            !function (e, t, n, s, u, a) {
                e.twq || (s = e.twq = function () {
                    s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
                }, s.version = '1.1', s.queue = [], u = t.createElement(n), u.async = !0,
                    u.src = 'https://static.ads-twitter.com/uwt.js',
                    a = t.getElementsByTagName(n)[0], a.parentNode.insertBefore(u, a))
            }(window, document, 'script');
            window.twq('config', 'qg0d8');
        }

        // PIA Affiliate Script
        if (typeof window.__pia_affiliate_id === 'undefined') {
            window.__pia_affiliate_id = 5404;
            (function () {
                var wa = document.createElement('script');
                wa.type = 'text/javascript';
                wa.async = true;
                wa.src = 'https://www.privateinternetaccess.com/affiliate.min.js';
                var s = document.getElementsByTagName('script')[0];
                s.parentNode.insertBefore(wa, s);
            })();
        }
    }

    // Initialize on DOM ready
    function init() {
        if (!hasConsent()) {
            // No consent given yet, show banner
            showBanner();
        } else if (getConsent() === CONSENT_ACCEPTED) {
            // Consent was given previously, load scripts
            loadTrackingScripts();
        }
        // If rejected, do nothing - scripts won't load
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
