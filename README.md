# CSS Grid and Flexbox Visual Designer

A visual design tool for frontend developers to easily create CSS Grid and Flexbox layouts and automatically generate CSS code.

## Features

- **CSS Grid Editor**: Drag-and-drop interface for Grid layouts
  - Easily adjust Grid container properties
  - Place and modify grid items
  - Real-time CSS code generation
  
- **Flexbox Editor**: Drag-and-drop interface for Flexbox layouts
  - Easily adjust Flex container properties
  - Control all properties of Flex items
  - Real-time CSS code generation
  
- **General Features**:
  - Copy CSS code to clipboard
  - Save layouts
  - Intuitive user interface

## Installation

1. Make sure you have Python 3.7 or higher installed
2. Clone or download the project
3. Install the required libraries:

```bash
pip install -r requirements.txt
```

## Usage

1. Start the application:

```bash
python app.py
```

2. Go to `http://localhost:5000` in your browser
3. Select the Grid or Flexbox editor
4. Create your design and get the automatically generated CSS code

## Using the Grid Editor

- Adjust the general properties of the grid layout from the "Grid Container" section
- Add grid items using the "Add Item" button
- Click an item to view and adjust its properties
- Set grid-column and grid-row values to position the item within the grid
- Copy the generated CSS code or save your layout

## Using the Flexbox Editor

- Adjust the general properties of the flex layout from the "Flex Container" section
- Add flex items using the "Add Item" button
- Click an item to view and adjust its properties
- Use flex-grow, flex-shrink, and flex-basis properties to control the size and flexibility of items
- Copy the generated CSS code or save your layout

## Technical Details

This application uses the following technologies:

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Architecture**: MVC (Model-View-Controller)

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'New feature: Description'`)
4. Push your branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

Distributed under the MIT License. 

## Developer

**Serhat YILDIZ**
* GitHub: [serhat-yildiz](https://github.com/serhat-yildiz)
* Portfolio: [serhatdev.vercel.app](https://serhatdev.vercel.app/)
* Blog: [serhatdev.vercel.app/blog](https://serhatdev.vercel.app/blog)
* LinkedIn: [linkedin.com/in/serhat-yldz](https://www.linkedin.com/in/serhat-yldz/)

### Other Projects:
* Face Recognition - Python tabanlı yüz tanıma API'si
* NextJs ve MongoDB Full Stack Yemek Sipariş Uygulaması
* PhotoSearch - React tabanlı Unsplash görsel arama uygulaması
* Pokemon Search API
* GraphQL API
* Workout Timer 