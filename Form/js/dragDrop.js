/**
 * Drag and Drop Functionality
 */
class DragDropManager {
    constructor() {
        this.draggableElements = document.querySelectorAll('.form-element');
        this.dropzones = document.querySelectorAll('.dropzone');
        this.currentDraggedElement = null;
        this.selectedElement = null;
        
        this.init();
    }
    
    init() {
        this.setupDraggableElements();
        this.setupDropzones();
        this.setupCanvasItemSelection();
    }
    
    setupDraggableElements() {
        this.draggableElements.forEach(element => {
            element.addEventListener('dragstart', (e) => this.handleDragStart(e, element));
            element.addEventListener('dragend', () => this.handleDragEnd());
        });
    }
    
    setupDropzones() {
        this.dropzones.forEach(dropzone => {
            dropzone.addEventListener('dragover', (e) => this.handleDragOver(e, dropzone));
            dropzone.addEventListener('dragleave', () => this.handleDragLeave(dropzone));
            dropzone.addEventListener('drop', (e) => this.handleDrop(e, dropzone));
        });
    }
    
    setupCanvasItemSelection() {
        document.addEventListener('click', (e) => {
            const canvasItem = e.target.closest('.canvas-item');
            
            // Deselect previous element
            if (this.selectedElement) {
                this.selectedElement.classList.remove('selected');
            }
            
            // If clicked on a canvas item, select it
            if (canvasItem) {
                this.selectedElement = canvasItem;
                canvasItem.classList.add('selected');
                
                // Show properties in the properties panel
                this.showProperties(canvasItem);
            } else if (!e.target.closest('.properties-panel')) {
                // If clicked outside canvas item and not in properties panel
                this.selectedElement = null;
                this.hideProperties();
            }
        });
    }
    
    handleDragStart(e, element) {
        this.currentDraggedElement = element;
        e.dataTransfer.setData('text/plain', element.dataset.type);
        e.dataTransfer.effectAllowed = 'copy';
    }
    
    handleDragEnd() {
        this.currentDraggedElement = null;
    }
    
    handleDragOver(e, dropzone) {
        e.preventDefault();
        dropzone.classList.add('drag-over');
        e.dataTransfer.dropEffect = 'copy';
    }
    
    handleDragLeave(dropzone) {
        dropzone.classList.remove('drag-over');
    }
    
    handleDrop(e, dropzone) {
        e.preventDefault();
        dropzone.classList.remove('drag-over');
        
        const elementType = e.dataTransfer.getData('text/plain');
        
        // Remove empty canvas message if it exists
        const emptyMessage = dropzone.querySelector('.empty-canvas');
        if (emptyMessage) {
            emptyMessage.remove();
        }
        
        // Create new form element in the canvas
        this.createCanvasItem(elementType, dropzone);
        
        // Update the preview
        previewManager.updatePreview();
    }
    
    createCanvasItem(type, dropzone) {
        const canvasItem = document.createElement('div');
        canvasItem.className = 'canvas-item';
        canvasItem.dataset.type = type;
        
        // Create default properties for the element
        const properties = {
            label: this.getDefaultLabel(type),
            name: this.getDefaultName(type),
            placeholder: `Enter ${this.getDefaultLabel(type).toLowerCase()}`,
            required: false,
            minLength: '',
            maxLength: ''
        };
        
        canvasItem.dataset.properties = JSON.stringify(properties);
        
        // Set inner HTML based on element type
        canvasItem.innerHTML = `
            <div class="canvas-item-controls">
                <button class="move-up-btn" title="Move Up"><i class="fas fa-arrow-up"></i></button>
                <button class="move-down-btn" title="Move Down"><i class="fas fa-arrow-down"></i></button>
                <button class="delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
            </div>
            <div class="canvas-item-content">
                <label>${properties.label}</label>
                ${this.getElementHtml(type, properties)}
            </div>
        `;
        
        // Add event listeners for control buttons
        this.setupControlButtons(canvasItem);
        
        // Add to dropzone
        dropzone.appendChild(canvasItem);
        
        // Select the newly created item
        if (this.selectedElement) {
            this.selectedElement.classList.remove('selected');
        }
        this.selectedElement = canvasItem;
        canvasItem.classList.add('selected');
        this.showProperties(canvasItem);
    }
    
    getDefaultLabel(type) {
        const labels = {
            'text': 'Text Field',
            'number': 'Number Field',
            'email': 'Email Address',
            'select': 'Dropdown Menu',
            'checkbox': 'Checkbox Option',
            'radio': 'Radio Option',
            'textarea': 'Text Area',
            'date': 'Date'
        };
        return labels[type] || 'New Field';
    }
    
    getDefaultName(type) {
        return `field_${type}_${Date.now()}`;
    }
    
    getElementHtml(type, properties) {
        switch (type) {
            case 'text':
                return `<input type="text" class="preview-input" placeholder="${properties.placeholder}">`;
            case 'number':
                return `<input type="number" class="preview-input" placeholder="${properties.placeholder}">`;
            case 'email':
                return `<input type="email" class="preview-input" placeholder="${properties.placeholder}">`;
            case 'select':
                return `
                    <select class="preview-select">
                        <option value="">Select an option</option>
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </select>
                `;
            case 'checkbox':
                return `
                    <div class="preview-checkbox">
                        <input type="checkbox" id="checkbox_preview"> 
                        <label for="checkbox_preview">Checkbox option</label>
                    </div>
                `;
            case 'radio':
                return `
                    <div class="preview-radio">
                        <div>
                            <input type="radio" name="radio_preview" id="radio1_preview"> 
                            <label for="radio1_preview">Option 1</label>
                        </div>
                        <div>
                            <input type="radio" name="radio_preview" id="radio2_preview"> 
                            <label for="radio2_preview">Option 2</label>
                        </div>
                    </div>
                `;
            case 'textarea':
                return `<textarea class="preview-textarea" placeholder="${properties.placeholder}"></textarea>`;
            case 'date':
                return `<input type="date" class="preview-input">`;
            default:
                return `<input type="text" class="preview-input" placeholder="${properties.placeholder}">`;
        }
    }
    
    setupControlButtons(canvasItem) {
        const deleteBtn = canvasItem.querySelector('.delete-btn');
        const moveUpBtn = canvasItem.querySelector('.move-up-btn');
        const moveDownBtn = canvasItem.querySelector('.move-down-btn');
        
        deleteBtn.addEventListener('click', () => {
            canvasItem.remove();
            this.selectedElement = null;
            this.hideProperties();
            previewManager.updatePreview();
        });
        
        moveUpBtn.addEventListener('click', () => {
            const prevItem = canvasItem.previousElementSibling;
            if (prevItem) {
                canvasItem.parentNode.insertBefore(canvasItem, prevItem);
                previewManager.updatePreview();
            }
        });
        
        moveDownBtn.addEventListener('click', () => {
            const nextItem = canvasItem.nextElementSibling;
            if (nextItem) {
                canvasItem.parentNode.insertBefore(nextItem, canvasItem);
                previewManager.updatePreview();
            }
        });
    }
    
    showProperties(canvasItem) {
        const propertiesPanel = document.getElementById('properties-panel');
        const noSelection = propertiesPanel.querySelector('.no-selection');
        const propertiesForm = propertiesPanel.querySelector('.properties-form');
        
        noSelection.style.display = 'none';
        propertiesForm.style.display = 'block';
        
        // Get properties from the canvas item
        const properties = JSON.parse(canvasItem.dataset.properties);
        
        // Fill in the properties form
        document.getElementById('prop-label').value = properties.label;
        document.getElementById('prop-name').value = properties.name;
        document.getElementById('prop-placeholder').value = properties.placeholder;
        document.getElementById('prop-required').checked = properties.required;
        document.getElementById('prop-min-length').checked = !!properties.minLength;
        document.getElementById('prop-min-length-val').value = properties.minLength || '';
        document.getElementById('prop-max-length').checked = !!properties.maxLength;
        document.getElementById('prop-max-length-val').value = properties.maxLength || '';
        
        // Add event listeners to properties inputs
        this.setupPropertiesListeners(canvasItem);
    }
    
    hideProperties() {
        const propertiesPanel = document.getElementById('properties-panel');
        const noSelection = propertiesPanel.querySelector('.no-selection');
        const propertiesForm = propertiesPanel.querySelector('.properties-form');
        
        noSelection.style.display = 'block';
        propertiesForm.style.display = 'none';
    }
    
    setupPropertiesListeners(canvasItem) {
        const inputs = document.querySelectorAll('#properties-panel input');
        
        inputs.forEach(input => {
            const updateHandler = () => {
                // Get current properties
                const properties = JSON.parse(canvasItem.dataset.properties);
                
                // Update properties based on input id
                switch (input.id) {
                    case 'prop-label':
                        properties.label = input.value;
                        canvasItem.querySelector('label').textContent = input.value;
                        break;
                    case 'prop-name':
                        properties.name = input.value;
                        break;
                    case 'prop-placeholder':
                        properties.placeholder = input.value;
                        const inputEl = canvasItem.querySelector('input, textarea');
                        if (inputEl) inputEl.placeholder = input.value;
                        break;
                    case 'prop-required':
                        properties.required = input.checked;
                        break;
                    case 'prop-min-length':
                        properties.minLength = input.checked ? 
                            document.getElementById('prop-min-length-val').value : '';
                        break;
                    case 'prop-min-length-val':
                        if (document.getElementById('prop-min-length').checked) {
                            properties.minLength = input.value;
                        }
                        break;
                    case 'prop-max-length':
                        properties.maxLength = input.checked ? 
                            document.getElementById('prop-max-length-val').value : '';
                        break;
                    case 'prop-max-length-val':
                        if (document.getElementById('prop-max-length').checked) {
                            properties.maxLength = input.value;
                        }
                        break;
                }
                
                // Save updated properties
                canvasItem.dataset.properties = JSON.stringify(properties);
                
                // Update preview
                previewManager.updatePreview();
            };
            
            input.addEventListener('input', updateHandler);
            input.addEventListener('change', updateHandler);
        });
    }
}
