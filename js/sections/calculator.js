// Wrap the initialization in a function that can be called multiple times
function initializeCalculators() {
    console.log('Initializing calculators...');
    
    // Automation Calculator
    const hourlyRate = document.getElementById('hourlyRate');
    const numAutomations = document.getElementById('numAutomations');
    const minsPerDay = document.getElementById('minsPerDay');
    const daysPerWeek = document.getElementById('daysPerWeek');
    const buildCost = document.getElementById('buildCost');
    
    const hoursSaved = document.getElementById('hoursSaved');
    const costWithout = document.getElementById('costWithout');
    const totalBuildCost = document.getElementById('totalBuildCost');
    const annualSavings = document.getElementById('annualSavings');
    const firstYearROI = document.getElementById('firstYearROI');

    // Debug check for elements
    console.log('Found elements:', {
        hourlyRate: !!hourlyRate,
        numAutomations: !!numAutomations,
        minsPerDay: !!minsPerDay,
        daysPerWeek: !!daysPerWeek,
        buildCost: !!buildCost,
        hoursSaved: !!hoursSaved,
        costWithout: !!costWithout,
        totalBuildCost: !!totalBuildCost,
        annualSavings: !!annualSavings,
        firstYearROI: !!firstYearROI
    });

    function calculateAutomation() {
        console.log('Calculating automation...');
        
        if (!hourlyRate || !numAutomations || !minsPerDay || !daysPerWeek || !buildCost) {
            console.error('Missing required elements');
            return;
        }
        
        // Get input values
        const rate = Number(hourlyRate.value) || 0;
        const autos = Number(numAutomations.value) || 0;
        const mins = Number(minsPerDay.value) || 0;
        const days = Number(daysPerWeek.value) || 0;
        
        // Calculate automation cost based on task duration
        // $500 per 30 minutes of task time
        const costPerAuto = Math.ceil(mins / 30) * 500;
        buildCost.value = costPerAuto; // Update the readonly input
        
        // Calculate time savings
        const minsPerYear = mins * autos * days * 52;
        const hoursPerYear = minsPerYear / 60;
        
        // Calculate costs and savings
        const laborCostSaved = hoursPerYear * rate;
        const totalBuildCostValue = autos * costPerAuto;
        const netSavings = laborCostSaved - totalBuildCostValue;
        
        // Calculate ROI percentage
        const roiPercentage = totalBuildCostValue > 0 ? 
            ((netSavings / totalBuildCostValue) * 100) : 0;
        
        // Update display with formatted numbers
        if (hoursSaved) hoursSaved.innerHTML = Math.round(hoursPerYear).toLocaleString();
        if (costWithout) costWithout.innerHTML = '$' + Math.round(laborCostSaved).toLocaleString();
        if (totalBuildCost) totalBuildCost.innerHTML = '$' + Math.round(totalBuildCostValue).toLocaleString();
        if (annualSavings) annualSavings.innerHTML = '$' + Math.round(netSavings).toLocaleString();
        if (firstYearROI) firstYearROI.innerHTML = Math.round(roiPercentage) + '%';
    }

    function attachInputListeners(element, callback) {
        if (!element) return;
        
        const events = ['input', 'change', 'keyup', 'mouseup', 'click'];
        
        events.forEach(eventType => {
            element.addEventListener(eventType, () => {
                console.log(`${eventType} event triggered on`, element.id);
                callback();
            });
        });

        // Add event listeners for the spinner buttons
        element.addEventListener('mousedown', function(e) {
            if (e.target === element) {
                console.log('Spinner button pressed on', element.id);
                callback();
                const interval = setInterval(callback, 50);
                window.addEventListener('mouseup', function() {
                    console.log('Spinner button released');
                    clearInterval(interval);
                }, { once: true });
            }
        });
    }

    // Attach listeners to automation calculator inputs
    [hourlyRate, numAutomations, minsPerDay, daysPerWeek, buildCost].forEach(input => {
        if (input) {
            console.log('Attaching listeners to', input.id);
            attachInputListeners(input, calculateAutomation);
        }
    });

    // Initial calculations
    calculateAutomation();
}

// Initialize immediately if possible
initializeCalculators();

// Also initialize when the section is loaded
window.addEventListener('load', initializeCalculators);
document.addEventListener('calculator-section-loaded', initializeCalculators);

// Backup initialization after a short delay
setTimeout(initializeCalculators, 1000); 