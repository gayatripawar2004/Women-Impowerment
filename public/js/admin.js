
        // Simple script for sidebar toggle on mobile
        document.addEventListener('DOMContentLoaded', function() {
            // Add active class to current page link
            const currentPage = window.location.pathname.split('/').pop();
            const links = document.querySelectorAll('.sidebar-menu a');
            
            links.forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                }
            });
            
            // Logout confirmation
            document.querySelector('.logout-link a').addEventListener('click', function(e) {
                if (!confirm('Are you sure you want to logout?')) {
                    e.preventDefault();
                }
            });
        });
    
