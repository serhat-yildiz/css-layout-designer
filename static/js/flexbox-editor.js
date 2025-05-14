document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const flexContainer = document.getElementById('flexContainer');
    const cssCode = document.getElementById('cssCode');
    const addItemBtn = document.getElementById('addItem');
    const clearItemsBtn = document.getElementById('clearItems');
    const itemList = document.getElementById('itemList');
    const itemProperties = document.getElementById('itemProperties');
    const copyCSS = document.getElementById('copyCSS');
    const saveLayout = document.getElementById('saveLayout');
    
    // Flex Container Controls
    const flexDirection = document.getElementById('flex-direction');
    const flexWrap = document.getElementById('flex-wrap');
    const justifyContent = document.getElementById('justify-content');
    const alignItems = document.getElementById('align-items');
    const alignContent = document.getElementById('align-content');
    const gap = document.getElementById('gap');
    const containerHeight = document.getElementById('container-height');
    
    // Flex Item Controls
    const itemContent = document.getElementById('item-content');
    const flexGrow = document.getElementById('flex-grow');
    const flexShrink = document.getElementById('flex-shrink');
    const flexBasis = document.getElementById('flex-basis');
    const alignSelf = document.getElementById('align-self');
    const order = document.getElementById('order');
    const itemBackground = document.getElementById('item-background');
    const itemWidth = document.getElementById('item-width');
    
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
    
    // Initialize the flex container with default values
    updateFlexContainer();
    
    // Add some default items
    addFlexItem();
    addFlexItem();
    addFlexItem();
    
    // Event listeners for flex container controls
    flexDirection.addEventListener('change', updateFlexContainer);
    flexWrap.addEventListener('change', updateFlexContainer);
    justifyContent.addEventListener('change', updateFlexContainer);
    alignItems.addEventListener('change', updateFlexContainer);
    alignContent.addEventListener('change', updateFlexContainer);
    gap.addEventListener('input', updateFlexContainer);
    containerHeight.addEventListener('input', updateFlexContainer);
    
    // Item property event listeners
    itemContent.addEventListener('input', updateSelectedItem);
    flexGrow.addEventListener('input', updateSelectedItem);
    flexShrink.addEventListener('input', updateSelectedItem);
    flexBasis.addEventListener('input', updateSelectedItem);
    alignSelf.addEventListener('change', updateSelectedItem);
    order.addEventListener('input', updateSelectedItem);
    itemBackground.addEventListener('input', updateSelectedItem);
    itemWidth.addEventListener('input', updateSelectedItem);
    
    // Add new item
    addItemBtn.addEventListener('click', function() {
        addFlexItem();
    });
    
    // Clear all items
    clearItemsBtn.addEventListener('click', function() {
        items = [];
        updateFlexItems();
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
            type: 'flexbox',
            container: {
                flexDirection: flexDirection.value,
                flexWrap: flexWrap.value,
                justifyContent: justifyContent.value,
                alignItems: alignItems.value,
                alignContent: alignContent.value,
                gap: gap.value
            },
            items: items.map(item => ({
                content: item.content,
                flexGrow: item.flexGrow,
                flexShrink: item.flexShrink,
                flexBasis: item.flexBasis,
                alignSelf: item.alignSelf,
                order: item.order,
                backgroundColor: item.backgroundColor,
                width: item.width
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
    
    function updateFlexContainer() {
        // Set flex container styles
        flexContainer.style.display = 'flex';
        flexContainer.style.flexDirection = flexDirection.value;
        flexContainer.style.flexWrap = flexWrap.value;
        flexContainer.style.justifyContent = justifyContent.value;
        flexContainer.style.alignItems = alignItems.value;
        flexContainer.style.alignContent = alignContent.value;
        flexContainer.style.gap = gap.value;
        flexContainer.style.minHeight = containerHeight.value;
        flexContainer.style.border = '1px dashed #ccc';
        
        updateFlexItems();
        generateCSS();
    }
    
    function addFlexItem() {
        const id = Date.now().toString();
        const item = {
            id: id,
            content: 'Flex Item ' + (items.length + 1),
            flexGrow: '0',
            flexShrink: '1',
            flexBasis: 'auto',
            alignSelf: 'auto',
            order: '0',
            backgroundColor: getRandomColor(),
            width: 'auto'
        };
        
        items.push(item);
        updateFlexItems();
        updateItemList();
        selectItem(id);
    }
    
    function updateFlexItems() {
        // Clear existing items
        flexContainer.innerHTML = '';
        
        // Create flex items
        items.forEach(item => {
            const element = document.createElement('div');
            element.className = 'flex-item';
            element.textContent = item.content;
            element.dataset.id = item.id;
            
            // Apply styles
            element.style.backgroundColor = item.backgroundColor;
            element.style.color = getContrastColor(item.backgroundColor);
            element.style.padding = '20px';
            element.style.borderRadius = '4px';
            element.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            element.style.flexGrow = item.flexGrow;
            element.style.flexShrink = item.flexShrink;
            element.style.flexBasis = item.flexBasis;
            element.style.alignSelf = item.alignSelf;
            element.style.order = item.order;
            
            if (item.width !== 'auto') {
                element.style.width = item.width;
            }
            
            // Click event to select item
            element.addEventListener('click', function(e) {
                e.stopPropagation();
                selectItem(item.id);
            });
            
            flexContainer.appendChild(element);
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
                updateFlexItems();
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
            flexGrow.value = item.flexGrow;
            flexShrink.value = item.flexShrink;
            flexBasis.value = item.flexBasis;
            alignSelf.value = item.alignSelf;
            order.value = item.order;
            itemBackground.value = item.backgroundColor;
            itemWidth.value = item.width;
            
            // Update item list selection
            updateItemList();
        }
    }
    
    function updateSelectedItem() {
        if (selectedItemId) {
            const itemIndex = items.findIndex(item => item.id === selectedItemId);
            
            if (itemIndex !== -1) {
                items[itemIndex].content = itemContent.value;
                items[itemIndex].flexGrow = flexGrow.value;
                items[itemIndex].flexShrink = flexShrink.value;
                items[itemIndex].flexBasis = flexBasis.value;
                items[itemIndex].alignSelf = alignSelf.value;
                items[itemIndex].order = order.value;
                items[itemIndex].backgroundColor = itemBackground.value;
                items[itemIndex].width = itemWidth.value;
                
                updateFlexItems();
            }
        }
    }
    
    function generateCSS() {
        let css = `.flex-container {\n`;
        css += `    display: flex;\n`;
        css += `    flex-direction: ${flexDirection.value};\n`;
        css += `    flex-wrap: ${flexWrap.value};\n`;
        css += `    justify-content: ${justifyContent.value};\n`;
        css += `    align-items: ${alignItems.value};\n`;
        css += `    align-content: ${alignContent.value};\n`;
        css += `    gap: ${gap.value};\n`;
        css += `    min-height: ${containerHeight.value};\n`;
        css += `}\n\n`;
        
        // Add item styles
        items.forEach((item, index) => {
            css += `.flex-item-${index + 1} {\n`;
            css += `    background-color: ${item.backgroundColor};\n`;
            
            // Add flex properties with shorthand
            if (item.flexGrow !== '0' || item.flexShrink !== '1' || item.flexBasis !== 'auto') {
                css += `    flex: ${item.flexGrow} ${item.flexShrink} ${item.flexBasis};\n`;
            }
            
            if (item.alignSelf !== 'auto') {
                css += `    align-self: ${item.alignSelf};\n`;
            }
            
            if (item.order !== '0') {
                css += `    order: ${item.order};\n`;
            }
            
            if (item.width !== 'auto') {
                css += `    width: ${item.width};\n`;
            }
            
            css += `}\n\n`;
        });
        
        cssCode.textContent = css;
    }
    
    function getRandomColor() {
        const colors = [
            '#2ecc71', '#3498db', '#e74c3c', '#f39c12', '#9b59b6',
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