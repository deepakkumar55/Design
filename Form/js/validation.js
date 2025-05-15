/**
 * Form Validation Manager
 */
class ValidationManager {
    constructor() {
        this.init();
    }
    
    init() {
        // Initial setup - will be called when preview is updated
    }
    
    setupFieldValidation(field) {
        if (!field) return;
        
        // Add event listeners for real-time validation
        field.addEventListener('input', () => this.validateField(field));
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('change', () => this.validateField(field));
    }
    
    validateField(field) {
        // Remove any existing error message
        this.removeErrorMessage(field);
        
        let isValid = field.checkValidity();
        
        if (!isValid) {
            // Get appropriate error message
            let errorMessage = this.getErrorMessage(field);
            this.showErrorMessage(field, errorMessage);
            field.classList.add('invalid-input');
            return false;
        } else {
            field.classList.remove('invalid-input');
            return true;
        }
    }
    
    validateStep(stepNumber) {
        const stepPreview = document.querySelector(`.preview-step[data-step="${stepNumber}"]`);
        if (!stepPreview) return true;
        
        const fields = stepPreview.querySelectorAll('input, select, textarea');
        let isStepValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isStepValid = false;
            }
        });
        
        return isStepValid;
    }
    
    getErrorMessage(field) {
        if (field.validity.valueMissing) {
            return 'This field is required';
        } else if (field.validity.typeMismatch) {
            if (field.type === 'email') {
                return 'Please enter a valid email address';
            }
            return 'Please enter a valid value';
        } else if (field.validity.tooShort) {
            return `Please enter at least ${field.minLength} characters`;
        } else if (field.validity.tooLong) {
            return `Please enter no more than ${field.maxLength} characters`;
        } else if (field.validity.rangeUnderflow) {
            return `Please enter a value greater than or equal to ${field.min}`;
        } else if (field.validity.rangeOverflow) {
            return `Please enter a value less than or equal to ${field.max}`;
        } else if (field.validity.patternMismatch) {
            return 'Please match the requested format';
        }
        
        return 'Please enter a valid value';
    }
    
    showErrorMessage(field, message) {
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'validation-error';
        errorElement.textContent = message;
        
        // Insert after the field
        const parent = field.parentNode;
        parent.insertBefore(errorElement, field.nextSibling);
    }
    
    removeErrorMessage(field) {
        // Find and remove any existing error message
        const parent = field.parentNode;
        const nextSibling = field.nextSibling;
        
        if (nextSibling && nextSibling.classList && nextSibling.classList.contains('validation-error')) {
            parent.removeChild(nextSibling);
        }
        
        field.classList.remove('invalid-input');
    }
}
