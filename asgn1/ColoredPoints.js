// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program

var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

//Global Variables

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  //gl = getWebGLContext(canvas);
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true})
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablestoGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  // Get the storage location of u_Size
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;


//globals for UI elements
let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize=10;
let g_segmentSize=10;
let g_selectedType=POINT
let g_rainbow = false;
let g_rainbowHue = 0; //tracking hue
let g_presetModeActive = false;

function addActionsForHtmlUI(){
  //buttons
  document.getElementById('red').onclick = function() {g_selectedColor = [1.0,0.0,0.0,1.0]; g_rainbow = false;};
  document.getElementById('green').onclick = function() {g_selectedColor = [0.0,1.0,0.0,1.0]; g_rainbow = false;};
  document.getElementById('blue').onclick = function() {g_selectedColor = [0.0,0.0,1.0,1.0]; g_rainbow = false;};
  document.getElementById('rainbow').onclick = function() {g_rainbow = !g_rainbow};  //chatGPT gave the idea to use ! to toggle
   //clear
  document.getElementById('clear').onclick = function() {g_shapesList=[]; renderAllShapes(); g_presetModeActive=false};
  //pick between shapes
  document.getElementById('pointButton').onclick = function() {g_selectedType=POINT; updateSegmentSliderVisibility();};
  document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE; updateSegmentSliderVisibility();};
  document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE; updateSegmentSliderVisibility();};
  //activate presetDrawing
  document.getElementById('presetButton').onclick = function() {g_presetModeActive = !g_presetModeActive; renderAllShapes();}
  //color sliders
  document.getElementById('redSlide').addEventListener('mouseup', function() {g_selectedColor[0] = this.value/100; g_rainbow = false;});
  document.getElementById('greenSlide').addEventListener('mouseup', function() {g_selectedColor[1] = this.value/100; g_rainbow = false;});
  document.getElementById('blueSlide').addEventListener('mouseup', function() {g_selectedColor[2] = this.value/100; g_rainbow = false;});
  //size sliders
  document.getElementById('sizeSlide').addEventListener('mouseup', function() {g_selectedSize = this.value});
  //segment count sliders
  document.getElementById('segSlide').addEventListener('mouseup', function() {g_segmentSize = this.value});
  
}

function main() {
  
  setupWebGL(); //webgl setup
  connectVariablestoGLSL();  //set up GLSL shader programs/variables

  addActionsForHtmlUI();  //HTML UI elements
  
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  //canvas.onmousemove = click;
  canvas.onmousemove = function (ev)  { if(ev.buttons == 1) {click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}


function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return ([x,y])
}

var g_shapesList = [];

// var g_points = [];  // The array for the position of a mouse press
// var g_colors = [];  // The array to store the color of a point
// var g_sizes = [];

function click(ev) {
  //extract click and return in WebGL coord form
  let [x,y] = convertCoordinatesEventToGL(ev);

  let point;
  if (g_selectedType==POINT) {
    point = new Point();
  } else if (g_selectedType==TRIANGLE) {
    point = new Triangle();
  } else {
    point = new Circle();
    point.segments = g_segmentSize;   //chatGPT helped figure out this should go here
  }
  
  point.position=[x,y];
  point.size=g_selectedSize;
  // --- Color Assignment Logic Code by ChatGPT---
    if (g_rainbow) {
        // Calculate color based on current hue
        point.color = hslToRgb(g_rainbowHue / 360, 1.0, 0.5).concat(1.0); // HSL to RGB, add Alpha

        // Increment hue for the *next* shape
        g_rainbowHue = (g_rainbowHue + 5) % 360; // Increment by 5 degrees and wrap around
  //ChatGPT Color Assignment Logic Code ends here
  } else {
      g_rainbow = false;
      point.color=g_selectedColor.slice();
    }

  g_shapesList.push(point);

  renderAllShapes();
  
}

function renderAllShapes() {
  var startTime = performance.now();
  
    // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

 if (g_presetModeActive) {
    presetDrawing(); // call only if mode is active
  }

  var len = g_shapesList.length;
  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();
    
  }
// //debug time
//   var duration = performance.now() - startTime;
  
//   sendTextToHTML("numdot: " + len + " ms: " + Math.floor(duration) + " fps: " + Math.floor(1000/duration)/10, "numdot");
//  
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getElementById(htmlID);
  if (!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}


//make visible if circle; chatGPT used to figure out how to toggle visibility
function updateSegmentSliderVisibility() {
    const segmentsContainer = document.getElementById('segmentsControlContainer');
    if (g_selectedType === CIRCLE) {
        segmentsContainer.style.display = 'block';
    } else {
        segmentsContainer.style.display = 'none';
    }
}


//-- Function created by using the formula from http://en.wikipedia.org/wiki/HSL_color_space and chatGPT assistance
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s == 0) {
    r = g = b = l; //gray
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r, g, b];
}


function presetDrawing() {
  drawTriangle([0.0, 0.63, -0.48, -0.33, 0.48, -0.33]);//body
  drawTriangle([-0.25, -0.28, -0.57, -0.92, 0.07, -0.92]);//left foot
  drawTriangle([0.25, -0.28, -0.07, -0.92, 0.57, -0.92]);//right foot

  //chatGPT used to figure out spacing logic for remaining tiny triangles
   const tinySize = 0.04; // Base width/height for tiny triangles
    let currentX = -0.4;   // Starting X position for the line of triangles
    const startY = 0.7;    // Y position for the line of triangles
    const spacing = 0.05;  // Spacing between triangle centers

    // Calls 4 through 20
    for (let i = 0; i < 17; i++) {
        drawTriangle([
            currentX, startY + tinySize,                 // Top point
            currentX - tinySize / 2, startY,             // Bottom left
            currentX + tinySize / 2, startY              // Bottom right
        ]);
        currentX += spacing;
    }
}