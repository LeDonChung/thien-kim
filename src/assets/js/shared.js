// ERP Thiên Kim - Shared JavaScript Functions

// Navigation functionality
class Navigation {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.highlightCurrentPage();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page') || link.getAttribute('href').replace('.html', '').replace('./', '');
                this.navigateToPage(page, link);
            });
        });
    }

    navigateToPage(page, clickedLink) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to clicked link
        if (clickedLink) {
            clickedLink.classList.add('active');
        }

        // Navigate to page
        if (page && page !== this.currentPage) {
            const pageUrl = page === 'dashboard' ? 'index.html' : `${page}.html`;
            window.location.href = pageUrl;
        }
    }

    highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop() || 'index.html';
        
        let pageName = 'dashboard';
        if (fileName !== 'index.html' && fileName !== 'dashboard.html') {
            pageName = fileName.replace('.html', '');
        }

        const currentNavLink = document.querySelector(`[data-page="${pageName}"]`);
        if (currentNavLink) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            currentNavLink.classList.add('active');
        }
    }

    setupMobileMenu() {
        // Add mobile menu toggle if needed
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
        }
    }
}

// Table functionality
class DataTable {
    constructor(tableSelector, options = {}) {
        this.table = document.querySelector(tableSelector);
        this.options = {
            sortable: true,
            searchable: true,
            ...options
        };
        this.init();
    }

    init() {
        if (!this.table) return;
        
        if (this.options.sortable) {
            this.setupSorting();
        }
        
        if (this.options.searchable) {
            this.setupSearch();
        }
    }

    setupSorting() {
        const headers = this.table.querySelectorAll('th[data-sort]');
        headers.forEach(header => {
            header.style.cursor = 'pointer';
            header.innerHTML += ' <i class="fas fa-sort"></i>';
            
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-sort');
                const currentDirection = header.getAttribute('data-direction') || 'asc';
                const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
                
                this.sortTable(column, newDirection);
                
                // Update header indicators
                headers.forEach(h => {
                    h.setAttribute('data-direction', '');
                    const icon = h.querySelector('i');
                    if (icon) icon.className = 'fas fa-sort';
                });
                
                header.setAttribute('data-direction', newDirection);
                const icon = header.querySelector('i');
                if (icon) {
                    icon.className = newDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
                }
            });
        });
    }

    sortTable(column, direction) {
        const tbody = this.table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            const aValue = a.querySelector(`td[data-${column}]`)?.textContent || '';
            const bValue = b.querySelector(`td[data-${column}]`)?.textContent || '';
            
            if (direction === 'asc') {
                return aValue.localeCompare(bValue, 'vi');
            } else {
                return bValue.localeCompare(aValue, 'vi');
            }
        });
        
        rows.forEach(row => tbody.appendChild(row));
    }

    setupSearch() {
        const searchInput = document.querySelector('.search-input input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterTable(e.target.value);
            });
        }
    }

    filterTable(searchTerm) {
        const tbody = this.table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const match = text.includes(searchTerm.toLowerCase());
            row.style.display = match ? '' : 'none';
        });
    }
}

// Form validation
class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.rules = {};
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => {
            if (!this.validate()) {
                e.preventDefault();
            }
        });
    }

    addRule(fieldName, rules) {
        this.rules[fieldName] = rules;
        return this;
    }

    validate() {
        let isValid = true;
        
        // Clear previous errors
        this.clearErrors();
        
        // Validate each field
        Object.keys(this.rules).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                const fieldIsValid = this.validateField(field, this.rules[fieldName]);
                if (!fieldIsValid) {
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }

    validateField(field, rules) {
        const value = field.value.trim();
        
        for (const rule of rules) {
            if (rule.type === 'required' && !value) {
                this.showError(field, rule.message || 'Trường này là bắt buộc');
                return false;
            }
            
            if (rule.type === 'minLength' && value.length < rule.value) {
                this.showError(field, rule.message || `Tối thiểu ${rule.value} ký tự`);
                return false;
            }
            
            if (rule.type === 'email' && !this.isValidEmail(value)) {
                this.showError(field, rule.message || 'Email không hợp lệ');
                return false;
            }
            
            if (rule.type === 'number' && isNaN(value)) {
                this.showError(field, rule.message || 'Vui lòng nhập số');
                return false;
            }
        }
        
        return true;
    }

    showError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';
        errorDiv.textContent = message;
        
        field.style.borderColor = '#dc3545';
        field.parentNode.appendChild(errorDiv);
    }

    clearErrors() {
        const errorMessages = this.form.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
        
        const fields = this.form.querySelectorAll('.form-input, .form-select');
        fields.forEach(field => {
            field.style.borderColor = '#ddd';
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Modal functionality
class Modal {
    constructor(modalSelector) {
        this.modal = document.querySelector(modalSelector);
        this.init();
    }

    init() {
        if (!this.modal) return;
        
        // Close modal on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Close modal on close button click
        const closeButtons = this.modal.querySelectorAll('[data-modal-close]');
        closeButtons.forEach(button => {
            button.addEventListener('click', () => this.close());
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    open() {
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.modal.classList.add('fade-in');
    }

    close() {
        this.modal.style.display = 'none';
        document.body.style.overflow = '';
        this.modal.classList.remove('fade-in');
    }

    isOpen() {
        return this.modal.style.display === 'flex';
    }
}

// Notification system
class NotificationSystem {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: white;
            padding: 1rem 1.5rem;
            margin-bottom: 0.5rem;
            border-radius: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border-left: 4px solid ${this.getTypeColor(type)};
            pointer-events: auto;
            animation: slideIn 0.3s ease-out;
            max-width: 400px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center;">
                    <i class="fas ${this.getTypeIcon(type)}" style="margin-right: 0.5rem; color: ${this.getTypeColor(type)};"></i>
                    <span>${message}</span>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; cursor: pointer; color: #999;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        this.container.appendChild(notification);
        
        // Auto remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }

    getTypeColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || colors.info;
    }

    getTypeIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    success(message, duration) {
        this.show(message, 'success', duration);
    }

    error(message, duration) {
        this.show(message, 'error', duration);
    }

    warning(message, duration) {
        this.show(message, 'warning', duration);
    }

    info(message, duration) {
        this.show(message, 'info', duration);
    }
}

// Utility functions
const Utils = {
    formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    },

    formatDate(date) {
        return new Intl.DateTimeFormat('vi-VN').format(new Date(date));
    },

    formatDateTime(date) {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    generateId() {
        return Math.random().toString(36).substr(2, 9);
    },

    slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    window.nav = new Navigation();
    
    // Initialize notification system
    window.notifications = new NotificationSystem();
    
    // Initialize data tables
    const tables = document.querySelectorAll('.data-table');
    tables.forEach(table => {
        new DataTable(`#${table.id}` || '.data-table');
    });
    
    // Add CSS for animations
    if (!document.querySelector('#shared-animations')) {
        const style = document.createElement('style');
        style.id = 'shared-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Navigation,
        DataTable,
        FormValidator,
        Modal,
        NotificationSystem,
        Utils
    };
}
