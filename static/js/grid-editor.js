document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const gridContainer = document.getElementById('gridContainer');
    const cssCode = document.getElementById('cssCode');
    const addItemBtn = document.getElementById('addItem');
    const clearItemsBtn = document.getElementById('clearItems');
    const itemList = document.getElementById('itemList');
    const itemProperties = document.getElementById('itemProperties');
    const copyCSS = document.getElementById('copyCSS');
    const saveLayout = document.getElementById('saveLayout');
    
    // Grid Container Controls
    const gridTemplateColumns = document.getElementById('grid-template-columns');
    const gridTemplateRows = document.getElementById('grid-template-rows');
    const gridGap = document.getElementById('grid-gap');
    const justifyContent = document.getElementById('justify-content');
    const alignContent = document.getElementById('align-content');
    
    // Grid Item Controls
    const itemContent = document.getElementById('item-content');
    const gridColumn = document.getElementById('grid-column');
    const gridRow = document.getElementById('grid-row');
    const justifySelf = document.getElementById('justify-self');
    const alignSelf = document.getElementById('align-self');
    const itemBackground = document.getElementById('item-background');
    
    // Toggle sections
    document.querySelectorAll('.control-header').forEach(header => {
        header.addEventListener('click', function() {
            const body = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            if (body.style.display === 'none') {
                body.style.display = 'block';
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-chevron-down');
            } else {
                body.style.display = 'none';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-right');
            }
        });
    });
    
    let items = [];
    let selectedItemId = null;
    
    // Initialize the grid with default values
    updateGridContainer();
    
    // Event listeners for grid container controls
    gridTemplateColumns.addEventListener('input', updateGridContainer);
    gridTemplateRows.addEventListener('input', updateGridContainer);
    gridGap.addEventListener('input', updateGridContainer);
    justifyContent.addEventListener('change', updateGridContainer);
    alignContent.addEventListener('change', updateGridContainer);
    
    // Item property event listeners
    itemContent.addEventListener('input', updateSelectedItem);
    gridColumn.addEventListener('input', updateSelectedItem);
    gridRow.addEventListener('input', updateSelectedItem);
    justifySelf.addEventListener('change', updateSelectedItem);
    alignSelf.addEventListener('change', updateSelectedItem);
    itemBackground.addEventListener('input', updateSelectedItem);
    
    // Add new item
    addItemBtn.addEventListener('click', function() {
        addGridItem();
    });
    
    // Clear all items
    clearItemsBtn.addEventListener('click', function() {
        items = [];
        updateGridItems();
        updateItemList();
        itemProperties.style.display = 'none';
        selectedItemId = null;
    });
    
    // Copy CSS to clipboard
    copyCSS.addEventListener('click', function() {
        const cssText = cssCode.textContent;
        navigator.clipboard.writeText(cssText).then(() => {
            alert('CSS code copied to clipboard!');
        }).catch(err => {
            console.error('Copy failed: ', err);
        });
    });
    
    // Save layout
    saveLayout.addEventListener('click', function() {
        const layoutData = {
            type: 'grid',
            container: {
                columns: gridTemplateColumns.value,
                rows: gridTemplateRows.value,
                gap: gridGap.value,
                justifyContent: justifyContent.value,
                alignContent: alignContent.value
            },
            items: items.map(item => ({
                content: item.content,
                gridColumn: item.gridColumn,
                gridRow: item.gridRow,
                justifySelf: item.justifySelf,
                alignSelf: item.alignSelf,
                backgroundColor: item.backgroundColor
            }))
        };
        
        fetch('/save_layout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(layoutData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Layout saved successfully!');
            } else {
                alert('Error while saving layout!');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error while saving layout!');
        });
    });
    
    function updateGridContainer() {
        // Set grid container styles
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = gridTemplateColumns.value;
        gridContainer.style.gridTemplateRows = gridTemplateRows.value;
        gridContainer.style.gap = gridGap.value;
        gridContainer.style.justifyContent = justifyContent.value;
        gridContainer.style.alignContent = alignContent.value;
        gridContainer.style.minHeight = '400px';
        gridContainer.style.border = '1px dashed #ccc';
        
        updateGridItems();
        generateCSS();
    }
    
    function addGridItem() {
        const id = Date.now().toString();
        const item = {
            id: id,
            content: 'Grid Item ' + (items.length + 1),
            gridColumn: '',
            gridRow: '',
            justifySelf: 'center',
            alignSelf: 'center',
            backgroundColor: getRandomColor()
        };
        
        items.push(item);
        updateGridItems();
        updateItemList();
        selectItem(id);
    }
    
    function updateGridItems() {
        // Clear existing items
        gridContainer.innerHTML = '';
        
        // Create grid items
        items.forEach(item => {
            const element = document.createElement('div');
            element.className = 'grid-item';
            element.textContent = item.content;
            element.dataset.id = item.id;
            
            // Apply styles
            element.style.backgroundColor = item.backgroundColor;
            element.style.color = getContrastColor(item.backgroundColor);
            element.style.padding = '20px';
            element.style.borderRadius = '4px';
            element.style.textAlign = 'center';
            element.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            
            if (item.gridColumn) {
                element.style.gridColumn = item.gridColumn;
            }
            
            if (item.gridRow) {
                element.style.gridRow = item.gridRow;
            }
            
            element.style.justifySelf = item.justifySelf;
            element.style.alignSelf = item.alignSelf;
            
            // Click event to select item
            element.addEventListener('click', function(e) {
                e.stopPropagation();
                selectItem(item.id);
            });
            
            gridContainer.appendChild(element);
        });
        
        generateCSS();
    }
    
    function updateItemList() {
        itemList.innerHTML = '';
        
        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'item';
            if (item.id === selectedItemId) {
                itemElement.classList.add('active');
            }
            
            const header = document.createElement('div');
            header.className = 'item-header';
            
            const title = document.createElement('span');
            title.textContent = `Item ${index + 1}`;
            
            const controls = document.createElement('div');
            controls.className = 'item-controls';
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn btn-danger btn-sm';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                items = items.filter(i => i.id !== item.id);
                updateGridItems();
                updateItemList();
                
                if (selectedItemId === item.id) {
                    selectedItemId = null;
                    itemProperties.style.display = 'none';
                }
            });
            
            controls.appendChild(deleteBtn);
            header.appendChild(title);
            header.appendChild(controls);
            itemElement.appendChild(header);
            
            itemElement.addEventListener('click', function() {
                selectItem(item.id);
            });
            
            itemList.appendChild(itemElement);
        });
    }
    
    function selectItem(id) {
        selectedItemId = id;
        const item = items.find(item => item.id === id);
        
        if (item) {
            // Show item properties
            itemProperties.style.display = 'block';
            
            // Update form fields
            itemContent.value = item.content;
            gridColumn.value = item.gridColumn;
            gridRow.value = item.gridRow;
            justifySelf.value = item.justifySelf;
            alignSelf.value = item.alignSelf;
            itemBackground.value = item.backgroundColor;
            
            // Update item list selection
            updateItemList();
        }
    }
    
    function updateSelectedItem() {
        if (selectedItemId) {
            const itemIndex = items.findIndex(item => item.id === selectedItemId);
            
            if (itemIndex !== -1) {
                items[itemIndex].content = itemContent.value;
                items[itemIndex].gridColumn = gridColumn.value;
                items[itemIndex].gridRow = gridRow.value;
                items[itemIndex].justifySelf = justifySelf.value;
                items[itemIndex].alignSelf = alignSelf.value;
                items[itemIndex].backgroundColor = itemBackground.value;
                
                updateGridItems();
            }
        }
    }
    
    function generateCSS() {
        let css = `.grid-container {\n`;
        css += `    display: grid;\n`;
        css += `    grid-template-columns: ${gridTemplateColumns.value};\n`;
        css += `    grid-template-rows: ${gridTemplateRows.value};\n`;
        css += `    gap: ${gridGap.value};\n`;
        css += `    justify-content: ${justifyContent.value};\n`;
        css += `    align-content: ${alignContent.value};\n`;
        css += `}\n\n`;
        
        // Add item styles
        items.forEach((item, index) => {
            css += `.grid-item-${index + 1} {\n`;
            css += `    background-color: ${item.backgroundColor};\n`;
            
            if (item.gridColumn) {
                css += `    grid-column: ${item.gridColumn};\n`;
            }
            
            if (item.gridRow) {
                css += `    grid-row: ${item.gridRow};\n`;
            }
            
            css += `    justify-self: ${item.justifySelf};\n`;
            css += `    align-self: ${item.alignSelf};\n`;
            css += `}\n\n`;
        });
        
        cssCode.textContent = css;
    }
    
    function getRandomColor() {
        const colors = [
            '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
            '#1abc9c', '#d35400', '#c0392b', '#16a085', '#8e44ad',
            '#27ae60', '#e67e22', '#2980b9', '#f1c40f'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    function getContrastColor(hexColor) {
        // Convert hex to RGB
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        
        // Calculate luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return black or white based on luminance
        return luminance > 0.5 ? '#000000' : '#ffffff';
    }
}); 