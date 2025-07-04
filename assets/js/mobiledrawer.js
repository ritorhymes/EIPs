// Mobile Drawer Component
(function() {
  'use strict';
  
  // State management
  const state = {
    isOpen: false,
    activeMode: 'menu', // 'menu' or 'toc'
    hasToc: false
  };
  
  // DOM elements
  let drawer, topBar, scrollTopBtn, tocBtn, menuBtn;
  let menuContent, tocContent, bottomDrawer;
  
  // Initialize component
  function init() {
    // Get DOM elements
    drawer = document.getElementById('mobile-drawer');
    if (!drawer) return;
    
    topBar = drawer.querySelector('.mobile-drawer__top-bar');
    scrollTopBtn = drawer.querySelector('.mobile-drawer__scroll-top');
    tocBtn = drawer.querySelector('.mobile-drawer__toc-btn');
    menuBtn = drawer.querySelector('.mobile-drawer__menu-btn');
    menuContent = drawer.querySelector('.mobile-drawer__content--menu');
    tocContent = drawer.querySelector('.mobile-drawer__content--toc');
    bottomDrawer = drawer.querySelector('.mobile-drawer__bottom');
    
    // Check for ToC on page
    checkForToc();
    
    // Set initial states
    scrollTopBtn.classList.add('is-hidden'); // Ensure hidden on load
    updateScrollTopVisibility();
    menuContent.classList.add('is-active');
    
    // Event listeners
    scrollTopBtn.addEventListener('click', handleScrollTop);
    tocBtn.addEventListener('click', handleTocClick);
    menuBtn.addEventListener('click', handleMenuClick);
    window.addEventListener('scroll', updateScrollTopVisibility);
    
    // Click outside to close
    document.addEventListener('click', handleClickOutside);
    
    // Close drawer when ToC link is clicked
    tocContent.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        closeDrawer();
      }
    });
    
    // Close drawer when menu link is clicked
    menuContent.addEventListener('click', function(e) {
      if (e.target.tagName === 'A') {
        closeDrawer();
      }
    });
  }
  
  // Check if page has ToC
  function checkForToc() {
    // Check for the actual ToC section in EIP pages
    const tocSection = document.querySelector('.toc');
    const tocLinks = tocSection ? tocSection.querySelectorAll('a') : [];
    
    state.hasToc = tocLinks.length > 0;
    
    if (state.hasToc) {
      tocBtn.classList.add('has-toc');
      populateTocFromExisting(tocLinks);
    }
  }
  
  // Populate ToC from existing ToC section
  function populateTocFromExisting(tocLinks) {
    const tocHtml = [];
    
    tocLinks.forEach(link => {
      const href = link.getAttribute('href');
      const text = link.textContent;
      
      // Determine indentation level based on link structure or heading level
      let className = 'toc-h2';
      const targetId = href.replace('#', '');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const tagName = targetElement.tagName.toLowerCase();
        className = `toc-${tagName}`;
      }
      
      tocHtml.push(`<a href="${href}" class="${className}">${text}</a>`);
    });
    
    tocContent.innerHTML = tocHtml.join('');
  }
  
  // Update scroll top button visibility
  function updateScrollTopVisibility() {
    const isAtTop = window.scrollY <= 10;
    
    if (isAtTop) {
      scrollTopBtn.classList.add('is-hidden');
    } else {
      scrollTopBtn.classList.remove('is-hidden');
    }
  }
  
  // Handle scroll to top
  function handleScrollTop() {
    // Close drawer if open
    if (state.isOpen) {
      closeDrawer();
    }
    
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Force hide button
    scrollTopBtn.classList.add('is-hidden');
  }
  
  // Handle ToC button click
  function handleTocClick() {
    if (state.isOpen && state.activeMode === 'toc') {
      closeDrawer();
    } else if (state.isOpen && state.activeMode === 'menu') {
      switchMode('toc');
    } else {
      openDrawer('toc');
    }
  }
  
  // Handle menu button click
  function handleMenuClick() {
    if (state.isOpen && state.activeMode === 'menu') {
      closeDrawer();
    } else if (state.isOpen && state.activeMode === 'toc') {
      switchMode('menu');
    } else {
      openDrawer('menu');
    }
  }
  
  // Open drawer
  function openDrawer(mode) {
    state.isOpen = true;
    state.activeMode = mode;
    
    drawer.classList.add('is-open');
    
    // Reset opacity for both contents
    menuContent.style.opacity = '';
    tocContent.style.opacity = '';
    
    // Show appropriate content and reset scroll
    if (mode === 'menu') {
      menuContent.classList.add('is-active');
      tocContent.classList.remove('is-active');
      bottomDrawer.scrollTop = 0;
    } else {
      tocContent.classList.add('is-active');
      menuContent.classList.remove('is-active');
      bottomDrawer.scrollTop = 0;
    }
  }
  
  // Close drawer
  function closeDrawer() {
    state.isOpen = false;
    
    drawer.classList.remove('is-open');
  }
  
  // Switch between modes
  function switchMode(newMode) {
    const oldContent = state.activeMode === 'menu' ? menuContent : tocContent;
    const newContent = newMode === 'menu' ? menuContent : tocContent;
    
    // Fade out old content
    oldContent.style.opacity = '0';
    
    setTimeout(() => {
      oldContent.classList.remove('is-active');
      newContent.classList.add('is-active');
      
      // Reset opacity
      newContent.style.opacity = '';
      
      // Reset scroll position
      bottomDrawer.scrollTop = 0;
      
      // Fade in new content
      setTimeout(() => {
        newContent.style.opacity = '1';
      }, 10);
    }, 200);
    
    state.activeMode = newMode;
  }
  
  // Handle click outside
  function handleClickOutside(e) {
    if (!state.isOpen) return;
    
    // Check if click was outside the drawer
    if (!drawer.contains(e.target)) {
      closeDrawer();
    }
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();