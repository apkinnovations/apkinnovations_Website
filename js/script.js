document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Current Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if(currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();

    // --- 2. Mobile Menu Logic ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if(hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            // Animate Hamburger to X
            const spans = hamburger.querySelectorAll('span');
            spans[0].classList.toggle('translate-y-2');
            spans[0].classList.toggle('rotate-45');
            spans[1].classList.toggle('opacity-0');
            spans[2].classList.toggle('-translate-y-2');
            spans[2].classList.toggle('-rotate-45');
            
            // Toggle Menu Overlay
            mobileMenu.classList.toggle('opacity-0');
            mobileMenu.classList.toggle('pointer-events-none');
            document.body.classList.toggle('overflow-hidden');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Revert Hamburger
                const spans = hamburger.querySelectorAll('span');
                spans[0].classList.remove('translate-y-2', 'rotate-45');
                spans[1].classList.remove('opacity-0');
                spans[2].classList.remove('-translate-y-2', '-rotate-45');
                
                // Hide Menu Overlay
                mobileMenu.classList.add('opacity-0', 'pointer-events-none');
                document.body.classList.remove('overflow-hidden');
            });
        });
    }

    // --- 3. Scroll Logic: Header, Back-To-Top, & Smooth Parallax ---
    const header = document.getElementById('header');
    const headerContainer = document.getElementById('header-container');
    const backToTop = document.getElementById('backToTop');
    const parallaxElements = document.querySelectorAll('.parallax');

    // Using requestAnimationFrame for flawless parallax performance
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;

                // Header Shrink
                if (scrollY > 50) {
                    headerContainer.classList.replace('h-20', 'h-16');
                    header.classList.add('shadow-sm');
                } else {
                    headerContainer.classList.replace('h-16', 'h-20');
                    header.classList.remove('shadow-sm');
                }

                // Back to Top Visibility
                if (scrollY > 500) {
                    backToTop.classList.remove('opacity-0', 'pointer-events-none');
                } else {
                    backToTop.classList.add('opacity-0', 'pointer-events-none');
                }

                // Smooth Parallax for Blur Orbs
                parallaxElements.forEach(el => {
                    const speed = el.getAttribute('data-speed') || 0.1;
                    // Apply translation based on scroll position
                    el.style.transform = `translateY(${scrollY * speed}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });

    // --- 4. Scroll Spy (Active Links highlighting) ---
    const sections = document.querySelectorAll('section[id], div[id="bpo"], div[id="it-services"]');
    const navLinksList = document.querySelectorAll('.nav-link');
    
    const scrollSpy = () => {
        let scrollY = window.pageYOffset;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 150; 
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href*=${sectionId}]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                if(navLink) {
                    navLinksList.forEach(l => l.classList.remove('text-brand-blue'));
                    navLink.classList.add('text-brand-blue');
                }
            }
        });
    };
    window.addEventListener('scroll', scrollSpy);

    // --- 5. Intersection Observer (Reveal Animations) ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-right, .reveal-left');
    const revealOptions = { 
        threshold: 0.15, 
        rootMargin: "0px 0px -40px 0px" 
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // --- 6. Perfect Typewriter Loop ---
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const words = ["BPO Solutions.", "IT Services.", "Web Development.", "Business Growth."];
        let wordIndex = 0;
        let letterIndex = 0;
        let isDeleting = false;
        
        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                letterIndex--;
            } else {
                letterIndex++;
            }
            
            typewriterElement.textContent = currentWord.substring(0, letterIndex);
            
            let typingSpeed = 80; // Default typing speed
            if (isDeleting) typingSpeed = 40; // Deleting is faster
            
            if (!isDeleting && letterIndex === currentWord.length) {
                // Finished typing word, pause before deleting
                typingSpeed = 2500;
                isDeleting = true;
            } else if (isDeleting && letterIndex === 0) {
                // Finished deleting word, move to next
                isDeleting = false;
                wordIndex++;
                if (wordIndex === words.length) wordIndex = 0;
                typingSpeed = 500; // Pause before typing new word
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Start typing after 1 second delay
        setTimeout(type, 1000);
    }

    // --- 7. Contact Form Logic (Mailto Intercept) ---
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const companyName = document.getElementById('companyName').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();

            if(!fullName || !email || !service || !message) {
                showStatus('Please fill in all required fields.', 'error');
                return;
            }

            const subject = encodeURIComponent(`Website Inquiry: ${service} - ${fullName}`);
            const body = encodeURIComponent(
`Name: ${fullName}
Company: ${companyName || 'N/A'}
Email: ${email}
Phone: ${phone || 'N/A'}
Service Required: ${service}

Message:
${message}`
            );

            // Trigger Email Client
            const mailtoLink = `mailto:apkinnovations2@gmail.com?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
            
            showStatus('Your default email app is opening to send this inquiry. Thank you!', 'success');
            contactForm.reset();
        });
    }

    function showStatus(msg, type) {
        formStatus.textContent = msg;
        formStatus.classList.remove('hidden', 'bg-emerald-50', 'text-emerald-700', 'border-emerald-200', 'bg-red-50', 'text-red-700', 'border-red-200');
        
        if(type === 'success') {
            formStatus.classList.add('bg-emerald-50', 'text-emerald-700', 'border-emerald-200');
        } else {
            formStatus.classList.add('bg-red-50', 'text-red-700', 'border-red-200');
        }

        setTimeout(() => { 
            formStatus.classList.add('hidden'); 
        }, 6000);
    }
});