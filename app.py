from flask import Flask, render_template, request, jsonify
import os
import json
import datetime

app = Flask(__name__)

# Ensure the data directory exists
os.makedirs('data', exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/grid')
def grid_editor():
    return render_template('grid_editor.html')

@app.route('/flexbox')
def flexbox_editor():
    return render_template('flexbox_editor.html')

@app.route('/save_layout', methods=['POST'])
def save_layout():
    layout_data = request.json
    # Save layout data to a file with timestamp
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    layout_type = layout_data.get('type', 'unknown')
    filename = f"data/layout_{layout_type}_{timestamp}.json"
    
    try:
        with open(filename, 'w') as f:
            json.dump(layout_data, f, indent=2)
        return jsonify({"status": "success", "message": "Layout saved successfully", "filename": filename})
    except Exception as e:
        return jsonify({"status": "error", "message": f"Error saving layout: {str(e)}"})

@app.route('/export_css', methods=['POST'])
def export_css():
    layout_data = request.json
    layout_type = layout_data.get('type', 'grid')
    
    css_code = ''
    if layout_type == 'grid':
        css_code = generate_grid_css(layout_data)
    elif layout_type == 'flexbox':
        css_code = generate_flexbox_css(layout_data)
    
    return jsonify({"status": "success", "css": css_code})

def generate_grid_css(layout_data):
    # Grid CSS generation logic
    container_props = layout_data.get('container', {})
    items = layout_data.get('items', [])
    
    css = ".grid-container {\n"
    css += "    display: grid;\n"
    
    if 'columns' in container_props:
        css += f"    grid-template-columns: {container_props['columns']};\n"
    if 'rows' in container_props:
        css += f"    grid-template-rows: {container_props['rows']};\n"
    if 'gap' in container_props:
        css += f"    gap: {container_props['gap']};\n"
    if 'justifyContent' in container_props:
        css += f"    justify-content: {container_props['justifyContent']};\n"
    if 'alignContent' in container_props:
        css += f"    align-content: {container_props['alignContent']};\n"
    
    css += "}\n\n"
    
    for i, item in enumerate(items):
        css += f".grid-item-{i+1} {{\n"
        if 'gridColumn' in item:
            css += f"    grid-column: {item['gridColumn']};\n"
        if 'gridRow' in item:
            css += f"    grid-row: {item['gridRow']};\n"
        if 'justifySelf' in item:
            css += f"    justify-self: {item['justifySelf']};\n"
        if 'alignSelf' in item:
            css += f"    align-self: {item['alignSelf']};\n"
        css += "}\n\n"
    
    return css

def generate_flexbox_css(layout_data):
    # Flexbox CSS generation logic
    container_props = layout_data.get('container', {})
    items = layout_data.get('items', [])
    
    css = ".flex-container {\n"
    css += "    display: flex;\n"
    
    if 'flexDirection' in container_props:
        css += f"    flex-direction: {container_props['flexDirection']};\n"
    if 'flexWrap' in container_props:
        css += f"    flex-wrap: {container_props['flexWrap']};\n"
    if 'justifyContent' in container_props:
        css += f"    justify-content: {container_props['justifyContent']};\n"
    if 'alignItems' in container_props:
        css += f"    align-items: {container_props['alignItems']};\n"
    if 'alignContent' in container_props:
        css += f"    align-content: {container_props['alignContent']};\n"
    if 'gap' in container_props:
        css += f"    gap: {container_props['gap']};\n"
    
    css += "}\n\n"
    
    for i, item in enumerate(items):
        css += f".flex-item-{i+1} {{\n"
        if 'flexGrow' in item:
            css += f"    flex-grow: {item['flexGrow']};\n"
        if 'flexShrink' in item:
            css += f"    flex-shrink: {item['flexShrink']};\n"
        if 'flexBasis' in item:
            css += f"    flex-basis: {item['flexBasis']};\n"
        if 'alignSelf' in item:
            css += f"    align-self: {item['alignSelf']};\n"
        if 'order' in item:
            css += f"    order: {item['order']};\n"
        css += "}\n\n"
    
    return css

if __name__ == '__main__':
    app.run(debug=True) 