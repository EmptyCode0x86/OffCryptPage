document.addEventListener('DOMContentLoaded',function(){function initNavigation(){const navTabs=document.getElementById('navTabs');const navLinks=document.querySelectorAll('.nav-link'),sections=document.querySelectorAll('#pictures,#features,#download');navLinks.forEach(link=>{link.addEventListener('click',function(e){const href=this.getAttribute('href');if(!href.startsWith('#')){return;}e.preventDefault();const targetId=href,targetSection=document.querySelector(targetId);if(targetSection){const offsetTop=targetSection.offsetTop-80;window.scrollTo({top:offsetTop,behavior:'smooth'})}})});function updateActiveNav(){let current='';const scrollPosition=window.scrollY+150;sections.forEach(section=>{const sectionTop=section.offsetTop,sectionHeight=section.offsetHeight;scrollPosition>=sectionTop&&scrollPosition<sectionTop+sectionHeight&&(current=section.getAttribute('id'))});navLinks.forEach(link=>{link.classList.remove('active');link.getAttribute('href')===`#${current}`&&link.classList.add('active')})}window.addEventListener('scroll',updateActiveNav);updateActiveNav()}function initSwiper(){const isMobile=window.matchMedia('(max-width: 768px)').matches,opts={direction:'horizontal',loop:false,centeredSlides:true,slidesPerView:1,spaceBetween:20,touchRatio:isMobile?0:1,allowTouchMove:!isMobile,touchAngle:45,grabCursor:true,autoHeight:true,effect:isMobile?'slide':'cards',navigation:{nextEl:'.swiper-button-next',prevEl:'.swiper-button-prev'},pagination:{el:'.swiper-pagination',clickable:true,dynamicBullets:true,dynamicMainBullets:3},scrollbar:{el:'.swiper-scrollbar',draggable:true},keyboard:{enabled:true},mousewheel:{enabled:true,forceToAxis:true},breakpoints:{640:{slidesPerView:1.2,spaceBetween:20},768:{slidesPerView:1.5,spaceBetween:30},1024:{slidesPerView:1.8,spaceBetween:40}}};isMobile||(opts.cardsEffect={slideShadows:true,transformEl:'.product-card'});const swiper=new Swiper('.security-swiper',Object.assign({},opts,{autoHeight:true,observeParents:true,observer:true}));swiper.on('imagesReady',()=>swiper.updateAutoHeight());swiper.on('slideChangeTransitionEnd',()=>swiper.updateAutoHeight());window.addEventListener('resize',()=>swiper.updateAutoHeight());}function initModal(){const imageCards=document.querySelectorAll('.image-card'),modal=document.getElementById('imageModal'),modalImage=document.getElementById('modalImage'),modalTitle=document.getElementById('modalTitle'),modalDesc=document.getElementById('modalDesc'),modalCounter=document.getElementById('modalCounter'),closeBtn=document.querySelector('.modal-close'),prevBtn=document.querySelector('.modal-prev'),nextBtn=document.querySelector('.modal-next');let currentImageIndex=0;const images=Array.from(imageCards).map(card=>({src:card.dataset.image,title:card.dataset.title,desc:card.dataset.desc}));function showImage(){const image=images[currentImageIndex];modalImage.src=image.src;modalTitle.textContent=image.title;modalDesc.textContent=image.desc;modalCounter.textContent=`${currentImageIndex+1} / ${images.length}`}imageCards.forEach((card,index)=>{card.addEventListener('click',()=>{currentImageIndex=index;showImage();modal.classList.add('active');document.body.style.overflow='hidden'})});closeBtn.addEventListener('click',()=>{modal.classList.remove('active');document.body.style.overflow=''});nextBtn.addEventListener('click',()=>{currentImageIndex=(currentImageIndex+1)%images.length;showImage()});prevBtn.addEventListener('click',()=>{currentImageIndex=(currentImageIndex-1+images.length)%images.length;showImage()});modal.addEventListener('click',e=>{(e.target===modal||e.target.classList.contains('modal-backdrop'))&&(modal.classList.remove('active'),document.body.style.overflow='')});document.addEventListener('keydown',e=>{if(!modal.classList.contains('active'))return;switch(e.key){case'Escape':modal.classList.remove('active');document.body.style.overflow='';break;case'ArrowLeft':currentImageIndex=(currentImageIndex-1+images.length)%images.length;showImage();break;case'ArrowRight':currentImageIndex=(currentImageIndex+1)%images.length;showImage();break}})}function initHowToUseTabs(){const init=()=>{const tabButtons=document.querySelectorAll('.tab-btn'),tabPanels=document.querySelectorAll('.tab-panel');if(!tabButtons||!tabButtons.length||!tabPanels||!tabPanels.length)return;for(let i=0;i<tabButtons.length;i++){const button=tabButtons[i];button.addEventListener('click',function(e){if(e){e.preventDefault();e.stopPropagation()}const targetTab=this.getAttribute('data-tab');for(let j=0;j<tabButtons.length;j++){tabButtons[j].classList.remove('active')}for(let k=0;k<tabPanels.length;k++){tabPanels[k].classList.remove('active')}this.classList.add('active');const targetPanel=document.getElementById(targetTab+'-tab');if(targetPanel){targetPanel.classList.add('active')}},false)}};if(document.readyState==='loading'){setTimeout(init,150)}else{init()}}initNavigation();initSwiper();initModal();initHowToUseTabs()});
// Sidebar mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const body = document.body;
    const sidebar = document.querySelector('.sidebar');
    const mainWrapper = document.querySelector('.main-wrapper');

    if (menuToggle && sidebar) {
        // Toggle menu on button click
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            body.classList.toggle('menu-open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (body.classList.contains('menu-open')) {
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    body.classList.remove('menu-open');
                }
            }
        });

        // Close menu when clicking on a menu link
        const menuLinks = sidebar.querySelectorAll('.menu-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                body.classList.remove('menu-open');
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && body.classList.contains('menu-open')) {
                body.classList.remove('menu-open');
            }
        });
    }
    
    // Set active menu item based on current page
    function setActiveMenuItem() {
        const currentPath = window.location.pathname;
        let currentPage = currentPath.split('/').pop();
        
        // Handle root/index page
        if (!currentPage || currentPage === '' || currentPage === '/') {
            currentPage = 'index.html';
        }
        
        // Remove query strings and hashes
        currentPage = currentPage.split('?')[0].split('#')[0];
        
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const link = item.querySelector('.menu-link');
            if (link) {
                let linkHref = link.getAttribute('href');
                
                // Handle external links (skip them)
                if (linkHref && (linkHref.startsWith('http://') || linkHref.startsWith('https://'))) {
                    // External link - only check if it matches current host
                    try {
                        const linkUrl = new URL(linkHref, window.location.origin);
                        const linkPage = linkUrl.pathname.split('/').pop() || 'index.html';
                        const currentUrl = new URL(window.location.href);
                        const currentPageUrl = currentUrl.pathname.split('/').pop() || 'index.html';
                        
                        if (linkUrl.hostname === currentUrl.hostname && linkPage === currentPageUrl) {
                            item.classList.add('active');
                        } else {
                            item.classList.remove('active');
                        }
                    } catch (e) {
                        item.classList.remove('active');
                    }
                } else {
                    // Internal link
                    let linkPage = linkHref.split('/').pop() || 'index.html';
                    linkPage = linkPage.split('?')[0].split('#')[0];
                    
                    if (linkPage === currentPage || (linkPage === 'index.html' && currentPage === 'index.html')) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                }
            }
        });
    }
    
    // Run on page load
    setActiveMenuItem();
    
    // Also run after a small delay to handle any dynamic content
    setTimeout(setActiveMenuItem, 100);
    
    // Re-run when page becomes visible (handles browser back/forward)
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            setActiveMenuItem();
        }
    });
    
    // Re-run when page is shown (handles browser back/forward on some browsers)
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            setActiveMenuItem();
        }
    });
    
    // Update active menu when clicking menu links (before navigation)
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Remove all active classes first
            const allMenuItems = document.querySelectorAll('.menu-item');
            allMenuItems.forEach(item => item.classList.remove('active'));

            // Add active to clicked item
            const parentItem = this.closest('.menu-item');
            if (parentItem) {
                parentItem.classList.add('active');
            }
        });
    });
});
