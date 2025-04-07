// DrawTriangle.js (c) 2012 matsuda
var canvas;   //global variables to make canvas accessible in all functions
var ctx;

function main() {  
  // Retrieve <canvas> element
  canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  ctx = canvas.getContext('2d');

  // Draw a black rectangle
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set color to black
  ctx.fillRect(0, 0, canvas.width, canvas.height);        // Fill a rectangle with the color
  
  let v1 = new Vector3([2.25, 2.25, 0]);  //ChatGPT used to understand Float32Array arguments
  drawVector(v1, "red");


  const drawButtons = document.querySelectorAll('input[type="button"][value="Draw"]'); //ChatGPT used to figure out how to differentiate between buttons with same value
  const firstDrawButton = drawButtons[0];  // First button
  const secondDrawButton = drawButtons[1]; // Second button
  
  firstDrawButton.addEventListener("click", handleDrawEvent);
  secondDrawButton.addEventListener("click", handleDrawOperationEvent);


}
function drawVector(v, color) {
  //var canvas = document.getElementById('example');
  //var ctx = canvas.getContext('2d');
  //now global
  
  ctx.strokeStyle = color;  //set color

  let centerX = canvas.width / 2;
  let centerY = canvas.width / 2;

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);  //move to center
  ctx.lineTo(centerX + v.elements[0]*20, centerY - v.elements[1]*20);   //ChatGPT used to clarify how to get x and y from v

  ctx.stroke();
}

function handleDrawEvent() {
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);  //overlay a new black rectangle to clear

  //red
  let v1x = document.getElementById("v1x").value;
  let v1y = document.getElementById("v1y").value; //extract values from text fields

  let v1 = new Vector3([v1x, v1y, 0]);
  drawVector(v1, "red");

  //blue
  let v2x = document.getElementById("v2x").value;
  let v2y = document.getElementById("v2y").value; //extract values from text fields

  let v2 = new Vector3([v2x, v2y, 0]);
  drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);  //overlay a new black rectangle to clear

  //red
  let v1x = document.getElementById("v1x").value;
  let v1y = document.getElementById("v1y").value; //extract values from text fields

  let v1 = new Vector3([v1x, v1y, 0]);
  drawVector(v1, "red");

  //blue
  let v2x = document.getElementById("v2x").value;
  let v2y = document.getElementById("v2y").value; //extract values from text fields

  let v2 = new Vector3([v2x, v2y, 0]);
  drawVector(v2, "blue");

  //green
  let v3 = new Vector3([0, 0, 0]);    
  let operationSelect = document.getElementById("op-select").value  //get selected value

  let scalar = document.getElementById("scalar").value;
  
  //find operation and draw
  switch(operationSelect) {
    case 'add':
        v3 = v1.add(v2);
        drawVector(v3, "green");
        break;
    case 'sub':
        v3 = v1.sub(v2);
        drawVector(v3, "green");
        break;
    case 'mul':
        v3 = v1.mul(scalar);
        drawVector(v3, "green");
        v3 = v2.mul(scalar);
        drawVector(v3, "green");
        break;
    case 'div':
        v3 = v1.div(scalar);
        drawVector(v3, "green");
        v3 = v2.div(scalar);
        drawVector(v3, "green");
        break;
    case 'mag':
        console.log("Magnitude v1:", v1.magnitude());
        console.log("Magnitude v2:", v2.magnitude());
        break;
    case 'nor':
        v3 = v1.normalize();
        drawVector(v3, "green");
        v3 = v2.normalize();
        drawVector(v3, "green");
        break;
    case 'ang':
        console.log("Angle:", angleBetween(v1,v2));
        break;
    case 'are':
        console.log("Area of the triangle:", areaTriangle(v1, v2));
        break;
    default:
        //do nothing
        return;
  }

  function angleBetween(v1, v2) {
    let dotProduct = Vector3.dot(v1, v2);
    let mag1 = v1.magnitude();
    let mag2 = v2.magnitude();

    if (mag1 != 0 && mag2 != 0) {
      cosAlpha = dotProduct / (mag1 * mag2);
    }
    let alphaRad = Math.acos(cosAlpha);    //chatGPT used to find acos function

    return (alphaRad * (180 / Math.PI));  //return degrees
  }

  function areaTriangle(v1, v2) {
    let crossProduct = Vector3.cross(v1, v2);
    let areaOfTriangle = crossProduct.magnitude() / 2;

    return areaOfTriangle;
  }
  
}
