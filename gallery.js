// YKSINKERTAINEN JA TOIMIVA SCREENSHOT GALLERIA + VIDEO SUPPORT

document.addEventListener('DOMContentLoaded', function() {

    // Etsi modal
    const modal = document.getElementById('imageModal');
    const imageCards = document.querySelectorAll('.image-card');
    let currentImageIndex = 0;

    if (!modal || imageCards.length === 0) {
        console.log('Gallery elements not found');
        return;
    }

    // Prevent scrolling when modal is open on mobile
    function preventScroll(e) {
        if (modal.classList.contains('active')) {
            e.preventDefault();
        }
    }

    // Close-funktio
    function closeModal() {
        modal.classList.remove('active');
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Remove scroll prevention
        document.removeEventListener('touchmove', preventScroll);
        document.removeEventListener('wheel', preventScroll);
    }

    // Modal opening function
    function openImageModal(card, index) {
        // Tallenna nykyinen indeksi
        if (index !== undefined) {
            currentImageIndex = index;
        }

        // Hae tiedot
        const dataImage = card.dataset.image || '';
        const imgTitle = card.dataset.title || '';
        const imgDesc = card.dataset.desc || '';

        // Etsi modal-content
        const modalContent = modal.querySelector('.modal-content');
        if (!modalContent) return;

        // Tarkista onko video vai kuva
        if (dataImage === 'youtube-demo' || dataImage.includes('youtube')) {
            // VIDEO - etsi iframe kortista
            const iframe = card.querySelector('iframe');
            if (iframe) {
                const videoSrc = iframe.src;
                modalContent.innerHTML = `
                    <span class="close">&times;</span>
                    <button class="modal-nav-btn modal-prev" aria-label="Previous">‹</button>
                    <button class="modal-nav-btn modal-next" aria-label="Next">›</button>
                    <div style="position: relative; width: 100%; max-width: 1000px; margin: 0 auto;">
                        <iframe src="${videoSrc}"
                                style="width: 100%; height: 600px; border: none;"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                        </iframe>
                    </div>
                    <div class="modal-info" style="${imgTitle || imgDesc ? '' : 'display: none;'}">
                        <h3></h3>
                        <p></p>
                    </div>
                `;
                // XSS-suojaus: käytä textContent, älä innerHTML
                const modalInfo = modalContent.querySelector('.modal-info');
                if (modalInfo) {
                    const h3 = modalInfo.querySelector('h3');
                    const p = modalInfo.querySelector('p');
                    if (h3) h3.textContent = imgTitle || '';
                    if (p) p.textContent = imgDesc || '';
                }
            }
        } else {
            // KUVA — prefer data-full (full-res), then data-image, then img src
            const imgElement = card.querySelector('img');
            const fullSrc = (imgElement && (imgElement.getAttribute('data-full') || imgElement.dataset.full)) || '';
            const imgSrc = fullSrc || dataImage || (imgElement ? imgElement.getAttribute('src') : '') || '';
            if (imgSrc) {
                modalContent.innerHTML = `
                    <span class="close">&times;</span>
                    <button class="modal-nav-btn modal-prev" aria-label="Previous">‹</button>
                    <button class="modal-nav-btn modal-next" aria-label="Next">›</button>
                    <img class="modal-full-image" src="" alt="" decoding="async">
                    <div class="modal-info" style="${imgTitle || imgDesc ? '' : 'display: none;'}">
                        <h3></h3>
                        <p></p>
                    </div>
                `;
                const modalImg = modalContent.querySelector('img.modal-full-image');
                const modalInfo = modalContent.querySelector('.modal-info');
                if (modalImg) {
                    modalImg.alt = imgTitle || (imgElement ? imgElement.alt : '') || '';
                    // Cap display size at native resolution so small sources are not blurry-upscaled
                    modalImg.onload = function () {
                        const nw = modalImg.naturalWidth || 0;
                        const nh = modalImg.naturalHeight || 0;
                        if (nw > 0) {
                            modalImg.style.maxWidth = 'min(86vw, ' + nw + 'px)';
                        }
                        if (nh > 0) {
                            modalImg.style.maxHeight = 'min(86vh, ' + nh + 'px)';
                        }
                    };
                    modalImg.src = imgSrc;
                }
                // XSS-suojaus: käytä textContent, älä innerHTML
                if (modalInfo) {
                    const h3 = modalInfo.querySelector('h3');
                    const p = modalInfo.querySelector('p');
                    if (h3) h3.textContent = imgTitle || '';
                    if (p) p.textContent = imgDesc || '';
                }
            }
        }

        // Näytä modal
        modal.classList.add('active');
        modal.style.display = 'flex';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Lisää close event uudelle napille
        const newCloseBtn = modal.querySelector('.close');
        if (newCloseBtn) {
            newCloseBtn.addEventListener('click', closeModal);
        }

        // Lisää navigaatio-napit
        const prevBtn = modal.querySelector('.modal-prev');
        const nextBtn = modal.querySelector('.modal-next');

        if (prevBtn) {
            prevBtn.onclick = function(e) {
                e.stopPropagation();
                navigateImage(-1);
            };
            // Piilota jos ensimmäinen kuva
            prevBtn.style.display = currentImageIndex === 0 ? 'none' : 'block';
        }

        if (nextBtn) {
            nextBtn.onclick = function(e) {
                e.stopPropagation();
                navigateImage(1);
            };
            // Piilota jos viimeinen kuva
            nextBtn.style.display = currentImageIndex === imageCards.length - 1 ? 'none' : 'block';
        }
    }

    // Navigaatio-funktio
    function navigateImage(direction) {
        const newIndex = currentImageIndex + direction;
        if (newIndex >= 0 && newIndex < imageCards.length) {
            currentImageIndex = newIndex;
            openImageModal(imageCards[currentImageIndex], currentImageIndex);
        }
    }

    // Lisää click event jokaiselle kortille (toimii myös touch-eventeillä)
    imageCards.forEach(function(card, index) {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        let isTouchMoving = false;

        // Track touch start position
        card.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            isTouchMoving = false;
        }, { passive: true });

        // Track if user is scrolling
        card.addEventListener('touchmove', function(e) {
            const touchMoveX = e.touches[0].clientX;
            const touchMoveY = e.touches[0].clientY;
            const deltaX = Math.abs(touchMoveX - touchStartX);
            const deltaY = Math.abs(touchMoveY - touchStartY);

            // If moved more than 10px, consider it scrolling
            if (deltaX > 10 || deltaY > 10) {
                isTouchMoving = true;
            }
        }, { passive: true });

        // Click event
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            try {
                openImageModal(this, index);
            } catch (error) {
                console.error('Error opening image modal:', error);
            }
        });

        // Touch event for mobile devices - only trigger if not scrolling
        card.addEventListener('touchend', function(e) {
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;

            // Only open modal if:
            // 1. User didn't scroll (isTouchMoving is false)
            // 2. Touch duration was less than 500ms (quick tap)
            if (!isTouchMoving && touchDuration < 500) {
                e.preventDefault();
                e.stopPropagation();
                try {
                    openImageModal(this, index);
                } catch (error) {
                    console.error('Error opening image modal:', error);
                }
            }
        }, { passive: false });
    });

    // Sulje modal kun klikataan taustaa
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Touch event for mobile background close
    modal.addEventListener('touchend', function(e) {
        if (e.target === modal) {
            e.preventDefault();
            closeModal();
        }
    });

    // Sulje modal ESC-näppäimellä ja navigoi nuolinäppäimillä
    document.addEventListener('keydown', function(e) {
        if (!modal.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'ArrowLeft') {
            navigateImage(-1);
        } else if (e.key === 'ArrowRight') {
            navigateImage(1);
        }
    });

    // Poistettu: globaalit touchmove/wheel preventDefault -kuuntelijat (passive:false)
    // hidastivat jokaista sivun vieritystä ja estivät nipistyszoomin lightboxissa.
    // Taustan vierityksen lukitus hoidetaan mobile-fix.js:ssä.
});
