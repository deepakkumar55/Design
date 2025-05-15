/**
 * Live Preview Manager
 */
class PreviewManager {
    constructor() {
        this.formPreview = document.getElementById('form-preview');
        this.activeStep = 1;
        
        this.init();
    }
    
    init() {
        this.updatePreview();
        this.setupStepNavigation();
    }
    
    updatePreview() {
        // Get all dropzones (each represents a step)
        const dropzones = document.querySelectorAll('.dropzone');
        
        // Clear previous preview
        this.formPreview.innerHTML = '';
        
        // Create preview for each step
        dropzones.forEach((dropzone, index) => {
            const stepNumber = index + 1;
            const stepPreview = document.createElement('div');
            stepPreview.className = 'preview-step';
            stepPreview.dataset.step = stepNumber;
            
            // Only show the active step
            if (stepNumber !== this.activeStep) {
                stepPreview.style.display = 'none';
            }
            
            stepPreview.innerHTML = `
                <h3>Step ${stepNumber}</h3>
                <div class="preview-content"></div>
                <div class="preview-nav">
                    ${stepNumber > 1 ? '<button class="btn prev-btn">Previous</button>' : ''}
                    ${stepNumber < dropzones.length ? '<button class="btn next-btn">Next</button>' : 
                      '<button class="btn submit-btn">Submit</button>'}
                </div>
            `;
            
            // Add preview content for this step
            const previewContent = stepPreview.querySelector('.preview-content');
            this.generatePreviewContent(dropzone, previewContent);
            
            // Add step to preview
            this.formPreview.appendChild(stepPreview);
        });
        
        // Setup navigation buttons for the steps
        this.setupStepNavigation();
    }
    
    generatePreviewContent(dropzone, previewContainer) {
        // Get all form elements in this dropzone
        const formElements = dropzone.querySelectorAll('.canvas-item');
        
        if (formElements.length === 0) {
            previewContainer.innerHTML = '<p class="empty-message">No form elements added yet</p>';
            return;
        }
        
        // Generate preview for each element
        formElements.forEach(element => {
            const elementType = element.dataset.type;
            const properties = JSON.parse(element.dataset.properties);
            
            const fieldContainer = document.createElement('div');
            fieldContainer.className = 'preview-field';
            
            // Add label if not checkbox or radio
            if (!['checkbox', 'radio'].includes(elementType)) {
                fieldContainer.innerHTML = `<label>${properties.label}${properties.required ? ' *' : ''}</label>`;
            }
            
            // Add field based on type
            switch (elementType) {
                case 'text':
                    fieldContainer.innerHTML += `
                        <input type="text" class="preview-input" 
                            name="${properties.name}" 
                            placeholder="${properties.placeholder}"
                            ${properties.required ? 'required' : ''}
                            ${properties.minLength ? `minlength="${properties.minLength}"` : ''}
                            ${properties.maxLength ? `maxlength="${properties.maxLength}"` : ''}>
                    `;
                    break;
                case 'number':
                    fieldContainer.innerHTML += `
                        <input type="number" class="preview-input" 
                            name="${properties.name}" 
                            placeholder="${properties.placeholder}"
                            ${properties.required ? 'required' : ''}>
                    `;
                    break;
                case 'email':
                    fieldContainer.innerHTML += `
                        <input type="email" class="preview-input" 
                            name="${properties.name}" 
                            placeholder="${properties.placeholder}"
                            ${properties.required ? 'required' : ''}>
                    `;
                    break;
                case 'select':
                    fieldContainer.innerHTML += `
                        <select class="preview-select" 
                                name="${properties.name}"
                                ${properties.required ? 'required' : ''}>
                            <option value="">Select an option</option>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                    `;
                    break;
                case 'checkbox':
                    fieldContainer.innerHTML += `
                        <div class="preview-checkbox">
                            <input type="checkbox" id="${properties.name}" 
                                   name="${properties.name}"
                                   ${properties.required ? 'required' : ''}>
                            <label for="${properties.name}">${properties.label}</label>
                        </div>
                    `;
                    break;
                case 'radio':
                    fieldContainer.innerHTML += `
                        <div class="preview-radio">
                            <div>
                                <input type="radio" name="${properties.name}" 
                                       id="${properties.name}_1" value="option1"
                                       ${properties.required ? 'required' : ''}>
                                <label for="${properties.name}_1">Option 1</label>
                            </div>
                            <div>
                                <input type="radio" name="${properties.name}" 
                                       id="${properties.name}_2" value="option2"
                                       ${properties.required ? 'required' : ''}>
                                <label for="${properties.name}_2">Option 2</label>
                            </div>
                        </div>
                    `;
                    break;
                case 'textarea':
                    fieldContainer.innerHTML += `
                        <textarea class="preview-textarea" 
                                 name="${properties.name}" 
                                 placeholder="${properties.placeholder}"
                                 ${properties.required ? 'required' : ''}
                                 ${properties.minLength ? `minlength="${properties.minLength}"` : ''}
                                 ${properties.maxLength ? `maxlength="${properties.maxLength}"` : ''}></textarea>
                    `;
                    break;
                case 'date':
                    fieldContainer.innerHTML += `
                        <input type="date" class="preview-input" 
                               name="${properties.name}"
                               ${properties.required ? 'required' : ''}>
                    `;
                    break;
            }
            
            // Add the field to preview container
            previewContainer.appendChild(fieldContainer);
            
            // Setup validation for this field
            if (validationManager) {
                validationManager.setupFieldValidation(fieldContainer.querySelector('input, select, textarea'));
            }
        });
    }
    
    setupStepNavigation() {
        const prevButtons = this.formPreview.querySelectorAll('.prev-btn');
        const nextButtons = this.formPreview.querySelectorAll('.next-btn');
        const submitButton = this.formPreview.querySelector('.submit-btn');
        
        // Previous button functionality
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Validate current step before moving to previous
                if (this.activeStep > 1) {
                    this.showStep(this.activeStep - 1);
                }
            });
        });
        
        // Next button functionality
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Validate current step before moving to next
                if (validationManager.validateStep(this.activeStep)) {
                    this.showStep(this.activeStep + 1);
                }
            });
        });
        
        // Submit button functionality
        if (submitButton) {
            submitButton.addEventListener('click', () => {
                // Validate final step before submission
                if (validationManager.validateStep(this.activeStep)) {
                    alert('Form submitted successfully!');
                }
            });
        }
    }
    
    showStep(stepNumber) {
        // Hide current step
        const currentStep = this.formPreview.querySelector(`.preview-step[data-step="${this.activeStep}"]`);
        if (currentStep) {
            currentStep.style.display = 'none';
        }
        
        // Show requested step
        const nextStep = this.formPreview.querySelector(`.preview-step[data-step="${stepNumber}"]`);
        if (nextStep) {
            nextStep.style.display = 'block';
            this.activeStep = stepNumber;
        }
    }
}
