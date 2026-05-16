// Main entry point for frontend logic
import { initMenu } from './menu.js';
import { updateNotificationCount } from './notifications.js';
import { validateForm } from './formValidation.js';
import { setupFileUpload } from './fileUpload.js';
import { simulateDiagnosis, loadWeatherData, loadMarketData } from './dataSimulation.js';
import { injectHeader } from './shared-header.js';

document.addEventListener('DOMContentLoaded', function() {
    injectHeader();
    initMenu();
    updateNotificationCount();
    setupFileUpload();
    // Page-specific logic
    const currentPage = window.location.pathname.split('/').pop();
    if (currentPage === 'weather.html' || currentPage === '') {
        loadWeatherData();
    }
    if (currentPage === 'market.html' || currentPage === '') {
        loadMarketData();
    }
    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this.id)) {
                e.preventDefault();
            }
        });
    });
});
// Export for use in inline scripts if needed
window.simulateDiagnosis = simulateDiagnosis;
