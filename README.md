JsPerlinNoiseRYBColor
=====================

Javascript version of Perlin Noise generator

Example Usage
=============

```javascript
// image width & height
var width = 200;
var height = 100;

// read parameters
var density = document.getElementById("density").value;;
var red = document.getElementById("red").value;
var yellow = document.getElementById("yellow").value;
var blue = document.getElementById("blue").value;

// create generator & generate texture
var generator = new PerlinNoiseGenerator();	
var final_result = generator.generateTexture(red, yellow, blue, width, height, density);

// show the texture
document.getElementById("result_canvas").src = 'data:image/png;'+final_result;
```

For a complete example, please refer to **Example.html**

Screenshot
==========

<img src="https://raw.githubusercontent.com/lheric/JsPerlinNoiseRYBColor/master/screenshot.png" align="left" width="300" >
