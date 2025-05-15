/**
 * Form Builder Main Script
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize managers
    window.dragDropManager = new DragDropManager();
    window.validationManager = new ValidationManager();
    window.previewManager = new PreviewManager();
    
    // Set up step management
    setupFormSteps();
});

/**
 * Setup functionality for managing form steps
 */
function setupFormSteps() {
    const addStepBtn = document.getElementById('add-step');
    const addStepTabBtn = document.getElementById('add-step-tab');
    const stepsList = document.getElementById('steps-list');
    const stepTabs = document.querySelector('.step-tabs');
    const formCanvas = document.getElementById('form-canvas');
    
    // Add a new step
    const addNewStep = () => {
        // Get current number of steps
        const currentSteps = document.querySelectorAll('.dropzone').length;
        const newStepNumber = currentSteps + 1;
        
        // Create new step in the sidebar
        const stepItem = document.createElement('div');
        stepItem.className = 'step-item';
        stepItem.textContent = `Step ${newStepNumber}`;
        stepItem.dataset.step = newStepNumber;
        stepsList.appendChild(stepItem);
        
        // Create new tab
        const tabItem = document.createElement('div');
        tabItem.className = 'tab';
        tabItem.textContent = `Step ${newStepNumber}`;
        tabItem.dataset.step = newStepNumber;
        stepTabs.insertBefore(tabItem, addStepTabBtn);
        
        // Create new dropzone
        const dropzone = document.createElement('div');
        dropzone.className = 'dropzone';
        dropzone.dataset.step = newStepNumber;
        dropzone.innerHTML = '<p class="empty-canvas">Drag and drop form elements here</p>';
        dropzone.style.display = 'none'; // Hide initially
        formCanvas.appendChild(dropzone);
        
        // Setup drag and drop for the new dropzone
        dropzone.addEventListener('dragover', (e) => dragDropManager.handleDragOver(e, dropzone));
        dropzone.addEventListener('dragleave', () => dragDropManager.handleDragLeave(dropzone));
        dropzone.addEventListener('drop', (e) => dragDropManager.handleDrop(e, dropzone));
        
        // Update preview with the new step
        previewManager.updatePreview();
    };
    
    // Switch between steps
    const switchStep = (stepNumber) => {
        // Update step items in sidebar
        document.querySelectorAll('.step-item').forEach(item => {
            item.classList.toggle('active', parseInt(item.dataset.step) === stepNumber);
        });
        
        // Update tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.toggle('active', parseInt(tab.dataset.step) === stepNumber);
        });
        
        // Show the selected dropzone and hide others
        document.querySelectorAll('.dropzone').forEach(zone => {
            zone.style.display = parseInt(zone.dataset.step) === stepNumber ? 'block' : 'none';
        });
    };
    
    // Add event listeners
    addStepBtn.addEventListener('click', addNewStep);
    addStepTabBtn.addEventListener('click', addNewStep);
    
    // Step selection in sidebar
    stepsList.addEventListener('click', (e) => {
        const stepItem = e.target.closest('.step-item');
        if (stepItem) {
            switchStep(parseInt(stepItem.dataset.step));
        }
    });
    
    // Tab selection
    stepTabs.addEventListener('click', (e) => {
        const tabItem = e.target.closest('.tab');
        if (tabItem) {
            switchStep(parseInt(tabItem.dataset.step));
        }
    });
}
