function initializeCaseStudies() {
    console.log('Initializing case studies...');
    const caseStudyItems = document.querySelectorAll('.case-study-item');
    console.log('Found case study items:', caseStudyItems.length);

    if (caseStudyItems.length === 0) {
        console.log('No case study items found - waiting for content to load');
        return;
    }

    caseStudyItems.forEach((item, index) => {
        const toggle = item.querySelector('.case-study-toggle');
        const content = item.querySelector('.case-study-content');
        
        console.log(`Setting up case study ${index + 1}:`, {
            hasToggle: !!toggle,
            hasContent: !!content,
            initialActiveState: item.classList.contains('active')
        });
        
        if (!toggle || !content) {
            console.error(`Missing elements for case study ${index + 1}`);
            return;
        }

        toggle.onclick = (e) => {
            console.log(`Clicked case study ${index + 1}`);
            console.log('Current state:', {
                isActive: item.classList.contains('active'),
                contentDisplay: content.style.display
            });

            // Close all other case studies
            caseStudyItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    console.log('Closing other case study');
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current case study
            const isActive = item.classList.contains('active');
            if (isActive) {
                console.log('Closing current case study');
                item.classList.remove('active');
            } else {
                console.log('Opening current case study');
                item.classList.add('active');
            }

            // Prevent default button behavior
            e.preventDefault();
            return false;
        };
    });
}

// Initialize when the section is loaded
document.addEventListener('case-studies-section-loaded', () => {
    console.log('Case studies section loaded event fired');
    initializeCaseStudies();
});

// Also initialize on DOMContentLoaded in case the section was already loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    setTimeout(() => {
        console.log('Running delayed initialization');
        initializeCaseStudies();
    }, 100);
}); 