class SectionLoader {
    constructor() {
        this.sections = [
            { id: 'hero-section', path: 'sections/hero.html' },
            { id: 'partners-section', path: 'sections/partners.html' },
            { id: 'process-section', path: 'sections/process.html' },
            { id: 'about-section', path: 'sections/about.html' },
            { id: 'calculator-section', path: 'sections/calculator.html' },
            { id: 'case-studies-section', path: 'sections/case-studies.html' },
            { id: 'pricing-section', path: 'sections/pricing.html' },
            { id: 'testimonials-section', path: 'sections/testimonials.html' },
            { id: 'contact-section', path: 'sections/contact.html' }
        ];
    }

    async loadSection(elementId, path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const content = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = content;
                
                // Execute any scripts in the content
                const scripts = element.getElementsByTagName('script');
                Array.from(scripts).forEach(script => {
                    const newScript = document.createElement('script');
                    Array.from(script.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    newScript.textContent = script.textContent;
                    script.parentNode.replaceChild(newScript, script);
                });

                // Dispatch custom event after content is loaded and scripts are executed
                const event = new CustomEvent(`${elementId}-loaded`);
                document.dispatchEvent(event);
            }
            return true;
        } catch (error) {
            console.error(`Error loading section ${elementId}:`, error);
            return false;
        }
    }

    async loadAllSections() {
        const results = await Promise.allSettled(
            this.sections.map(section => 
                this.loadSection(section.id, section.path)
            )
        );

        // Log any sections that failed to load
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(`Failed to load section: ${this.sections[index].id}`);
            }
        });
    }

    // Add a new section dynamically
    addSection(id, path) {
        this.sections.push({ id, path });
    }

    // Reload a specific section
    async reloadSection(id) {
        const section = this.sections.find(s => s.id === id);
        if (section) {
            return await this.loadSection(section.id, section.path);
        }
        return false;
    }
} 