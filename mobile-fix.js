/* mobile-fix.js — lightboxin scroll-lukitus, pyyhkäisy ja napautuszoomi puhelimella */
(function () {
    function init() {
        var modal = document.getElementById('imageModal');
        if (!modal) return;
        var mobile = window.matchMedia('(max-width: 768px)');
        var locked = false, savedY = 0;
        var body = document.body, html = document.documentElement;

        function lock() {
            if (locked) return;
            locked = true;
            savedY = window.scrollY || html.scrollTop || 0;
            body.style.position = 'fixed';
            body.style.top = (-savedY) + 'px';
            body.style.left = '0';
            body.style.right = '0';
            body.style.width = '100%';
        }
        function unlock() {
            if (!locked) return;
            locked = false;
            body.style.position = '';
            body.style.top = '';
            body.style.left = '';
            body.style.right = '';
            body.style.width = '';
            var prev = html.style.scrollBehavior;
            html.style.scrollBehavior = 'auto';
            window.scrollTo(0, savedY);
            html.style.scrollBehavior = prev;
        }
        function unzoom() {
            if (modal.classList.contains('mf-zoomed')) modal.classList.remove('mf-zoomed');
        }
        function sync() {
            if (modal.classList.contains('active')) lock();
            else { unzoom(); unlock(); }
        }
        new MutationObserver(sync).observe(modal, { attributes: true, attributeFilter: ['class'] });
        // Uusi kuva (navigointi) -> zoomi pois
        new MutationObserver(unzoom)
            .observe(modal, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });

        // Napautus kuvaan -> zoomi päälle/pois (vain puhelin)
        modal.addEventListener('click', function (e) {
            if (!mobile.matches || !e.target || e.target.tagName !== 'IMG') return;
            e.stopPropagation();
            modal.classList.toggle('mf-zoomed');
        });

        // Pyyhkäisy vasen/oikea -> edellinen/seuraava
        var sx = 0, sy = 0, multi = false;
        modal.addEventListener('touchstart', function (e) {
            multi = e.touches.length > 1;
            sx = e.touches[0].clientX; sy = e.touches[0].clientY;
        }, { passive: true });
        modal.addEventListener('touchmove', function (e) {
            if (e.touches.length > 1) multi = true;
        }, { passive: true });
        modal.addEventListener('touchend', function (e) {
            if (multi || modal.classList.contains('mf-zoomed')) return;
            if (window.visualViewport && window.visualViewport.scale > 1.05) return;
            var t = e.changedTouches[0];
            var dx = t.clientX - sx, dy = t.clientY - sy;
            if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
            var btn = modal.querySelector(dx < 0 ? '.modal-next' : '.modal-prev');
            if (btn && btn.style.display !== 'none') btn.click();
        }, { passive: true });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
