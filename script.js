document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // Set up projects carousel
    setupProjectsCarousel();
    
    // Add fade-in animation on scroll for sections
    const sections = document.querySelectorAll('section');
    
    function checkScroll() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if(sectionTop < windowHeight * 0.8) {
                section.classList.add('fade-in');
            }
        });
    }
    
    // Initial check on page load
    checkScroll();
    
    // Check on scroll
    window.addEventListener('scroll', checkScroll);
    
    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Here you would typically send the form data to a server
            // For demonstration, we'll just show an alert
            alert(`Thank you, ${name}! Your message has been received. I'll get back to you at ${email} soon.`);
            
            // Reset form
            this.reset();
        });
    }
});

function setupProjectsCarousel() {
    const projectsSection = document.querySelector('#projects .container');
    const projectGrid = document.querySelector('.project-grid');
    const projects = document.querySelectorAll('.project-card');
    
    if(!projectGrid || projects.length === 0) return;
    
    // Create carousel container
    const carouselContainer = document.createElement('div');
    carouselContainer.className = 'project-carousel';
    
    // Wrap project grid with carousel container
    projectGrid.parentNode.insertBefore(carouselContainer, projectGrid);
    carouselContainer.appendChild(projectGrid);
    
    // Clone projects for infinite scroll effect
    projects.forEach(project => {
        const clone = project.cloneNode(true);
        projectGrid.appendChild(clone);
    });
    
    // Add navigation buttons
    const prevBtn = document.createElement('button');
    prevBtn.className = 'carousel-btn prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    carouselContainer.appendChild(prevBtn);
    
    const nextBtn = document.createElement('button');
    nextBtn.className = 'carousel-btn next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    carouselContainer.appendChild(nextBtn);
    
    // Add indicator dots
    const indicatorContainer = document.createElement('div');
    indicatorContainer.className = 'carousel-indicator';
    
    const totalGroups = Math.ceil(projects.length / 3);
    for(let i = 0; i < totalGroups; i++) {
        const dot = document.createElement('div');
        dot.className = i === 0 ? 'indicator-dot active' : 'indicator-dot';
        dot.dataset.index = i;
        indicatorContainer.appendChild(dot);
    }
    
    projectsSection.appendChild(indicatorContainer);
    
    // Initialize carousel state
    let currentIndex = 0;
    const projectWidth = projects[0].offsetWidth;
    const gap = 30; // Match the gap in CSS
    const groupSize = 3;
    const moveAmount = (projectWidth + gap) * groupSize;
    let autoScrollInterval;
    
    // Start with automatic scroll
    startAutoScroll();
    
    // Add scroll animation
    projectGrid.classList.add('scrolling');
    
    // Handle manual navigation
    prevBtn.addEventListener('click', () => {
        stopAutoScroll();
        navigateCarousel(-1);
    });
    
    nextBtn.addEventListener('click', () => {
        stopAutoScroll();
        navigateCarousel(1);
    });
    
    // Handle indicator clicks
    indicatorContainer.querySelectorAll('.indicator-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            stopAutoScroll();
            const targetIndex = parseInt(dot.dataset.index);
            goToSlide(targetIndex);
        });
    });
    
    // Pause auto-scroll on hover
    carouselContainer.addEventListener('mouseenter', () => {
        projectGrid.style.animationPlayState = 'paused';
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        projectGrid.style.animationPlayState = 'running';
    });
    
    // Navigation functions
    function navigateCarousel(direction) {
        currentIndex = (currentIndex + direction + totalGroups) % totalGroups;
        goToSlide(currentIndex);
    }
    
    function goToSlide(index) {
        projectGrid.style.transition = 'transform 0.5s ease';
        projectGrid.style.transform = `translateX(-${index * moveAmount}px)`;
        updateIndicators(index);
        currentIndex = index;
    }
    
    function updateIndicators(index) {
        indicatorContainer.querySelectorAll('.indicator-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    function startAutoScroll() {
        // Instead of interval-based scrolling, we'll use CSS animation
        projectGrid.style.animation = 'none';
        void projectGrid.offsetWidth; // Trigger reflow
        projectGrid.style.animation = 'projectScroll 30s linear infinite';
    }
    
    function stopAutoScroll() {
        projectGrid.style.animation = 'none';
    }
    
    // Handle transition end
    projectGrid.addEventListener('transitionend', () => {
        // If we're at the last cloned set, quickly jump to the first real set without animation
        if(currentIndex >= projects.length / groupSize) {
            projectGrid.style.transition = 'none';
            currentIndex = 0;
            projectGrid.style.transform = `translateX(0)`;
            void projectGrid.offsetWidth; // Trigger reflow
            projectGrid.style.transition = 'transform 0.5s ease';
            updateIndicators(currentIndex);
        }
    });
    
    // Adjust carousel on window resize
    window.addEventListener('resize', () => {
        const newProjectWidth = projects[0].offsetWidth;
        const newMoveAmount = (newProjectWidth + gap) * groupSize;
        projectGrid.style.transition = 'none';
        projectGrid.style.transform = `translateX(-${currentIndex * newMoveAmount}px)`;
    });
}

// Add intersection observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-item, .project-card').forEach(item => {
    observer.observe(item);
});

// Add visible class for CSS transitions
document.addEventListener('scroll', function() {
    var skillsSection = document.querySelector('#skills');
    var projectsSection = document.querySelector('#projects');
    var contactSection = document.querySelector('#contact');
    
    if (isInViewport(skillsSection)) {
        skillsSection.classList.add('visible');
    }
    
    if (isInViewport(projectsSection)) {
        projectsSection.classList.add('visible');
    }
    
    if (isInViewport(contactSection)) {
        contactSection.classList.add('visible');
    }
});

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
    );
}