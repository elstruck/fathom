console.log('Script starting...');

// Simple initialization - no DOMContentLoaded wrapper
const track = document.querySelector('.testimonial-track');
const slides = document.querySelectorAll('.testimonial-slide');
const prevButton = document.querySelector('.carousel-arrow.prev');
const nextButton = document.querySelector('.carousel-arrow.next');
const dots = document.querySelectorAll('.dot');

console.log('Elements found:', {
    track: track,
    slides: slides.length,
    prevButton: prevButton,
    nextButton: nextButton,
    dots: dots.length
});

let currentSlide = 0;

// Simple next/prev functions
function nextSlide() {
    console.log('Next clicked');
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlidePosition();
}

function prevSlide() {
    console.log('Prev clicked');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlidePosition();
}

function updateSlidePosition() {
    console.log('Updating to slide:', currentSlide);
    const offset = -currentSlide * 100;
    track.style.transform = `translateX(${offset}%)`;
    updateDots();
}

function updateDots() {
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Direct click handlers
prevButton.onclick = (e) => {
    console.log('Prev button clicked');
    e.preventDefault();
    prevSlide();
};

nextButton.onclick = (e) => {
    console.log('Next button clicked');
    e.preventDefault();
    nextSlide();
};

// Initialize dots
dots.forEach((dot, index) => {
    dot.onclick = () => {
        currentSlide = index;
        updateSlidePosition();
    };
});

// Initial position
updateSlidePosition();
console.log('Script setup complete'); 