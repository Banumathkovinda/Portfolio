// ==========================================================================
// Navigation & Theme System (Matching Framer Motion / React Pill Navbar)
// ==========================================================================

const navItems = [
    { id: "home", title: "Home" },
    { id: "about", title: "About" },
    { id: "projects", title: "Projects" },
    { id: "certifications", title: "Certifications" },
    { id: "contact", title: "Contact" }
];

let activeSection = "home";

// Smooth Scroll with -110px offset for fixed floating navbar
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;

    const yOffset = -110;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
}

// Update Active Section Indicator & Links
function updateActiveNav(currentId) {
    activeSection = currentId;

    // Desktop nav items
    const desktopLinks = document.querySelectorAll('.nav-links-desktop .nav-link');
    let activeDesktopLink = null;
    desktopLinks.forEach(link => {
        if (link.getAttribute('data-section') === currentId) {
            link.classList.add('active');
            activeDesktopLink = link;
        } else {
            link.classList.remove('active');
        }
    });

    // Mobile nav items
    const mobileLinks = document.querySelectorAll('.mobile-dropdown-menu .mobile-nav-item');
    mobileLinks.forEach(link => {
        if (link.getAttribute('data-section') === currentId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Animate sliding indicator (layoutId="nav-indicator")
    const indicator = document.getElementById('nav-indicator');
    const container = document.querySelector('.nav-links-desktop');
    if (indicator && container && activeDesktopLink) {
        const indicatorWidth = 32; // w-8 = 32px
        const left = activeDesktopLink.offsetLeft + (activeDesktopLink.offsetWidth - indicatorWidth) / 2;
        indicator.style.left = `${left}px`;
        indicator.style.opacity = '1';
    } else if (indicator) {
        indicator.style.opacity = '0';
    }
}

// Scroll detection matching exact React algorithm
function detectActiveSectionOnScroll() {
    let current = "home";

    for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
            current = item.id;
            break;
        }
    }

    if (current !== activeSection) {
        updateActiveNav(current);
    }
}

// Handle nav link clicks
function handleNavClick(e, id) {
    e.preventDefault();
    closeMobileMenu();
    updateActiveNav(id);
    scrollToSection(id);
}

// Mobile Menu Controls
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileDropdown = document.getElementById('mobile-dropdown-menu');

function openMobileMenu() {
    if (mobileDropdown && mobileMenuBtn) {
        mobileDropdown.classList.add('open');
        mobileMenuBtn.classList.add('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
}

function closeMobileMenu() {
    if (mobileDropdown && mobileMenuBtn) {
        mobileDropdown.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
}

function toggleMobileMenu() {
    if (mobileDropdown && mobileDropdown.classList.contains('open')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu();
    });
}

// Close mobile menu on click outside
document.addEventListener('click', (e) => {
    if (mobileDropdown && mobileMenuBtn) {
        if (!mobileMenuBtn.contains(e.target) && !mobileDropdown.contains(e.target)) {
            closeMobileMenu();
        }
    }
});

// Setup click handlers for all desktop and mobile nav links
document.querySelectorAll('.nav-links-desktop .nav-link, .mobile-dropdown-menu .mobile-nav-item').forEach(link => {
    link.addEventListener('click', (e) => {
        const sectionId = link.getAttribute('data-section') || link.getAttribute('href').replace('#', '');
        handleNavClick(e, sectionId);
    });
});

// Logo click handler
const navLogo = document.getElementById('nav-logo');
if (navLogo) {
    navLogo.addEventListener('click', (e) => {
        handleNavClick(e, 'home');
    });
}

// CTA buttons (Hire Me) click handlers
document.querySelectorAll('.btn-hire-cta, .mobile-hire-cta').forEach(btn => {
    btn.addEventListener('click', (e) => {
        handleNavClick(e, 'contact');
    });
});

// Theme Management
const themeToggle = document.getElementById('theme-toggle');

function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-mode');
    } else {
        // Default to dark mode matching reference design
        document.body.classList.add('dark-mode');
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

initTheme();

// Event Listeners for scroll, progress bar, back-to-top, and resize
const navElement = document.getElementById('navbar');
const scrollProgressBar = document.getElementById('scroll-progress-bar');
const backToTopBtn = document.getElementById('back-to-top');

let scrollTicking = false;

function handleScroll() {
    // 1. Detect active section for sliding pill indicator
    detectActiveSectionOnScroll();

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // 2. Navbar compact & cyber glass state
    if (navElement) {
        navElement.classList.toggle('scrolled', scrollY > 30);
    }

    // 3. Top Cyber Scroll Progress Bar
    if (scrollProgressBar) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (scrollY / totalHeight) * 100 : 0;
        scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    // 4. Back-To-Top button appearance
    if (backToTopBtn) {
        backToTopBtn.classList.toggle('visible', scrollY > 350);
    }

    // 5. Subtle hero parallax (smooth depth movement)
    if (scrollY < window.innerHeight) {
        const heroContent = document.querySelector('.hero-content');
        const heroImage = document.querySelector('.hero-image');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrollY * 0.12}px)`;
        }
        if (heroImage) {
            heroImage.style.transform = `translateY(${scrollY * 0.2}px)`;
        }
    }
}

function onScrollRequest() {
    if (!scrollTicking) {
        window.requestAnimationFrame(() => {
            handleScroll();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}

window.addEventListener('scroll', onScrollRequest, { passive: true });
window.addEventListener('resize', () => {
    updateActiveNav(activeSection);
    handleScroll();
});
window.addEventListener('load', () => {
    handleScroll();
    updateActiveNav(activeSection);
});

// Back to top click handler
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Immediate initial calculation
handleScroll();
updateActiveNav(activeSection);

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Basic validation
        if (!name || !email || !subject || !message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate form submission (replace with actual implementation)
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
    });
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#4299e1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-weight: 500;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Enhanced Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger stagger animations for children
                if (entry.target.classList.contains('stagger-animation')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 80);
                    });
                }
            }
        });
    }, observerOptions);

    // Observe different elements with different animation classes
    const animatedElements = [
        { selector: '.section-title', animation: 'fade-in' },
        { selector: '.about-left', animation: 'slide-in-left' },
        { selector: '.about-right', animation: 'slide-in-right' },
        { selector: '.education-card', animation: 'fade-in' },
        { selector: '.skill-category', animation: 'fade-in' },
        { selector: '.project-card', animation: 'scale-in' },
        { selector: '.contact-content', animation: 'fade-in' },
        { selector: '.skill-tags', animation: 'stagger-animation' },
        { selector: '.about-stats', animation: 'stagger-animation' },
        { selector: '.skills-list', animation: 'stagger-animation' }
    ];

    animatedElements.forEach(({ selector, animation }) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add(animation);
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
                if (el.classList.contains('stagger-animation')) {
                    Array.from(el.children).forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('visible');
                        }, index * 80);
                    });
                }
            } else {
                observer.observe(el);
            }
        });
    });
}

// Smooth scroll reveal for sections
function revealSections() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const scrollPos = window.pageYOffset + window.innerHeight;
        
        if (scrollPos > sectionTop + 100) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
}

// Parallax scrolling effects
function initParallaxEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Parallax for hero section
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            const heroContent = document.querySelector('.hero-content');
            const heroImage = document.querySelector('.hero-image');
            
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            if (heroImage) {
                heroImage.style.transform = `translateY(${scrolled * 0.5}px) scale(${1 + scrolled * 0.0005})`;
            }
        }
        
        // Floating animation for about profile image
        const aboutProfile = document.querySelector('.about-profile-img');
        if (aboutProfile && scrolled > 400 && scrolled < 1200) {
            const floatY = Math.sin((scrolled - 400) * 0.01) * 10;
            aboutProfile.style.transform = `translateY(${floatY}px)`;
        }
    });
}

// Progress indicators for sections
function addProgressIndicators() {
    const sections = document.querySelectorAll('section[id]');
    const progressContainer = document.createElement('div');
    progressContainer.className = 'scroll-progress';
    progressContainer.innerHTML = `
        <style>
            .scroll-progress {
                position: fixed;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                z-index: 1000;
            }
            .progress-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(0, 102, 204, 0.3);
                margin: 15px 0;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .progress-dot.active {
                background: var(--primary-color);
                transform: scale(1.5);
            }
            .progress-dot:hover {
                background: var(--primary-color);
                transform: scale(1.3);
            }
        </style>
    `;
    
    sections.forEach(section => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        dot.addEventListener('click', () => {
            section.scrollIntoView({ behavior: 'smooth' });
        });
        progressContainer.appendChild(dot);
    });
    
    document.body.appendChild(progressContainer);
    
    // Update active dot on scroll
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const dots = progressContainer.querySelectorAll('.progress-dot');
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                dots.forEach(dot => dot.classList.remove('active'));
                dots[index].classList.add('active');
            }
        });
    });
}

// Initialize all animations
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initParallaxEffects();
    
    // Initial reveal
    setTimeout(revealSections, 100);
    
    // Reveal on scroll
    window.addEventListener('scroll', revealSections);
});

// Typing Effect for Hero Title
function initHeroTyping() {
    const greetingEl = document.querySelector('.hero-greeting');
    const nameEl = document.querySelector('#hero-typing-name') || document.querySelector('.hero-title .highlight');
    const cursorEl = document.querySelector('.typing-cursor');

    if (!nameEl) return;

    const greetingText = greetingEl ? (greetingEl.getAttribute('data-text') || greetingEl.textContent.trim() || "Hi, I'm") : "Hi, I'm";
    const nameText = nameEl.getAttribute('data-text') || nameEl.textContent.trim() || "Banumath Kovinda";

    if (greetingEl) greetingEl.textContent = '';
    nameEl.textContent = '';

    let greetingIndex = 0;
    let nameIndex = 0;

    function typeGreeting() {
        if (greetingEl && greetingIndex < greetingText.length) {
            greetingEl.textContent += greetingText.charAt(greetingIndex);
            greetingIndex++;
            setTimeout(typeGreeting, 50);
        } else {
            setTimeout(typeName, 150);
        }
    }

    function typeName() {
        if (nameIndex < nameText.length) {
            nameEl.textContent += nameText.charAt(nameIndex);
            nameIndex++;
            setTimeout(typeName, 75);
        }
    }

    // Start typing smoothly
    setTimeout(typeGreeting, 250);
}

// Initialize typing effect when page is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroTyping);
} else {
    initHeroTyping();
}

// Skill Bars Animation (if you want to add skill bars)
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    skillBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease';
            bar.style.width = width;
        }, 200);
    });
}

// Portfolio Filter (if you want to add filtering)
function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    handleScroll();
    updateActiveNav(activeSection);
    
    // Don't create loading screen - remove it if it exists
    const existingLoadingScreen = document.querySelector('.loading-screen');
    if (existingLoadingScreen) {
        existingLoadingScreen.remove();
    }
});

// Console welcome message
console.log('%c👋 Welcome to Banumath Kovinda\'s Portfolio!', 'font-size: 20px; font-weight: bold; color: #00d4ff;');
console.log('%cBuilt with passion and lots of ☕', 'font-size: 14px; color: #0066cc;');
