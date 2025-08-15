// Function to include HTML files
function includeHTML(elementId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch ${filePath}: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => {
            console.error('Error including HTML:', error);
            document.getElementById(elementId).innerHTML = `<p>Error loading content: ${error.message}</p>`;
        });
}

// Function to dynamically update the copyright year
function updateCopyrightYear() {
    const footerContent = document.getElementById('footerContent');
    if (footerContent) {
        const currentYear = new Date().getFullYear();
        const content = footerContent.innerHTML;
        footerContent.innerHTML = content.replace(/&copy; \d{4}/, `&copy; ${currentYear}`);
    }
}

// Initialize includes when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check for footer placeholder
    if (document.getElementById('footer-placeholder')) {
        includeHTML('footer-placeholder', '/assets/includes/footer.html');
        
        // Update copyright year after footer is loaded
        setTimeout(updateCopyrightYear, 100);
    }
});
