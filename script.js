        let isTextVisible = false;
        let currentSlide = 0;
        let slideInterval;
        let startX = 0;
        let isDragging = false;
        const totalSlides = 5;

        function toggleText() {
            const hiddenText = document.getElementById('hiddenText');
            const toggleBtn = document.querySelector('.toggle-btn');
            
            if (isTextVisible) {
                hiddenText.classList.remove('show');
                toggleBtn.textContent = 'Show Info';
                isTextVisible = false;
            } else {
                hiddenText.classList.add('show');
                toggleBtn.textContent = 'Hide Info';
                isTextVisible = true;
            }
        }

        // Carousel functionality
        function updateCarousel() {
            const container = document.getElementById('carouselContainer');
            const indicators = document.querySelectorAll('.carousel-indicator');
            
            container.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentSlide);
            });
        }

        function changeSlide(direction) {
            currentSlide += direction;
            if (currentSlide >= totalSlides) currentSlide = 0;
            if (currentSlide < 0) currentSlide = totalSlides - 1;
            updateCarousel();
            resetAutoSlide();
        }

        function goToSlide(slideIndex) {
            currentSlide = slideIndex;
            updateCarousel();
            resetAutoSlide();
        }

        function autoSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        }

        function startAutoSlide() {
            slideInterval = setInterval(autoSlide, 3000);
        }

        function stopAutoSlide() {
            clearInterval(slideInterval);
        }

        function resetAutoSlide() {
            stopAutoSlide();
            startAutoSlide();
        }

        // Mouse drag functionality
        function handleMouseDown(e) {
            isDragging = true;
            startX = e.clientX;
            document.getElementById('carouselContainer').style.cursor = 'grabbing';
        }

        function handleMouseMove(e) {
            if (!isDragging) return;
            e.preventDefault();
        }

        function handleMouseUp(e) {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) { // Minimum drag distance
                if (diffX > 0) {
                    changeSlide(1); // Drag left, go to next slide
                } else {
                    changeSlide(-1); // Drag right, go to previous slide
                }
            }
            
            document.getElementById('carouselContainer').style.cursor = 'grab';
        }

        // Navigation bar hover effect
        function initNavbarHover() {
            const navbar = document.querySelector('.navbar');
            navbar.addEventListener('mouseenter', () => {
                navbar.classList.add('dark');
            });
            navbar.addEventListener('mouseleave', () => {
                navbar.classList.remove('dark');
            });
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-links a, .footer-links a').forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Scroll Animation Observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Initialize animations
        function initScrollAnimations() {
            const animatedElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right, .scale-up');
            animatedElements.forEach(el => observer.observe(el));

            // Staggered animation for list items
            const staggerItems = document.querySelectorAll('.stagger-item');
            staggerItems.forEach((item, index) => {
                const itemObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            setTimeout(() => {
                                entry.target.classList.add('visible');
                            }, index * 200);
                        }
                    });
                }, observerOptions);
                itemObserver.observe(item);
            });
        }

        // Initialize when page loads
        document.addEventListener('DOMContentLoaded', function() {
            initScrollAnimations();
            initNavbarHover();
            startAutoSlide();
            
            // Add mouse events to carousel
            const carouselContainer = document.getElementById('carouselContainer');
            carouselContainer.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            // Pause auto-slide on hover
            const carousel = document.querySelector('.product-carousel');
            carousel.addEventListener('mouseenter', stopAutoSlide);
            carousel.addEventListener('mouseleave', startAutoSlide);
        });

        // Navbar background change on scroll
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50 && !navbar.classList.contains('dark')) {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.15)';
            } else if (window.scrollY <= 50 && !navbar.classList.contains('dark')) {
                navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.72)';
                navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.1)';
            }
        });