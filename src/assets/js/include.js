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
        // Calculate the correct path to the footer based on the current page location
        const path = window.location.pathname;
        let footerPath = 'assets/includes/footer.html';
        
        // If we're in a subfolder (contains more than one slash), adjust the path
        if ((path.match(/\//g) || []).length > 1) {
            // Count folder depth (number of slashes minus 1 to account for the filename)
            const depth = path.split('/').length - 2;
            let prefix = '';
            for (let i = 0; i < depth; i++) {
                prefix += '../';
            }
            footerPath = prefix + 'assets/includes/footer.html';
        }
        
        console.log('Loading footer from:', footerPath);
        includeHTML('footer-placeholder', footerPath);
        
        // Update copyright year after footer is loaded
        setTimeout(updateCopyrightYear, 100);
    }
});
