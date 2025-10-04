// YKSINKERTAINEN JA TOIMIVA SCREENSHOT GALLERIA + VIDEO SUPPORT

document.addEventListener('DOMContentLoaded', function() {

    // Etsi modal
    const modal = document.getElementById('imageModal');
    const imageCards = document.querySelectorAll('.image-card');

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
        document.body.style.overflow = '';
        
        // Remove scroll prevention
        document.removeEventListener('touchmove', preventScroll);
        document.removeEventListener('wheel', preventScroll);
    }

    // Lisää click event jokaiselle kortille (toimii myös touch-eventeillä)
    imageCards.forEach(function(card) {
        // Click event
        card.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openImageModal(this);
        });

        // Touch event for mobile devices
        card.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openImageModal(this);
        });
    });

    // Modal opening function
    function openImageModal(card) {
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
                    <div style="position: relative; width: 100%; max-width: 1000px; margin: 0 auto;">
                        <iframe src="${videoSrc}"
                                style="width: 100%; height: 600px; border: none;"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                        </iframe>
                    </div>
                    ${imgTitle || imgDesc ? `
                    <div class="modal-info">
                        ${imgTitle ? `<h3>${imgTitle}</h3>` : ''}
                        ${imgDesc ? `<p>${imgDesc}</p>` : ''}
                    </div>
                    ` : ''}
                `;
            }
        } else {
            // KUVA
            const imgSrc = dataImage || card.querySelector('img')?.src;
            if (imgSrc) {
                modalContent.innerHTML = `
                    <span class="close">&times;</span>
                    <img src="${imgSrc}" alt="${imgTitle}" style="width: 100%; height: auto; max-height: 80vh; object-fit: contain; display: block; margin: 0 auto;">
                    ${imgTitle || imgDesc ? `
                    <div class="modal-info">
                        ${imgTitle ? `<h3>${imgTitle}</h3>` : ''}
                        ${imgDesc ? `<p>${imgDesc}</p>` : ''}
                    </div>
                    ` : ''}
                `;
            }
        }

        // Näytä modal
        modal.classList.add('active');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Lisää close event uudelle napille
        const newCloseBtn = modal.querySelector('.close');
        if (newCloseBtn) {
            newCloseBtn.addEventListener('click', closeModal);
        }
    }

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

    // Sulje modal ESC-näppäimellä
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Add scroll prevention for mobile
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('wheel', preventScroll, { passive: false });
});
