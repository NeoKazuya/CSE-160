class Cube{
    constructor(){
      this.type='cube';
      //this.position = [0.0,0.0,0.0];
      this.color = [1.0,1.0,1.0,1.0];
      //this.size = 5.0;
      //this.segments = 10;
      this.matrix = new Matrix4();
    }
    
    render() {
      var rgba = this.color;
      gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      //v0: (0,0,0), v1: (1,0,0), v2: (1,1,0), v3: (0,1,0)
      //v4: (0,0,1), v5: (1,0,1), v6: (1,1,1), v7: (0,1,1)

      //front
      drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
      drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);
      //back
      drawTriangle3D([0,0,1, 1,0,1, 1,1,1]);
      drawTriangle3D([0,0,1, 1,1,1, 0,1,1]);
      //top
      drawTriangle3D([0,1,0, 1,1,1, 0,1,1]);
      drawTriangle3D([0,1,0, 1,1,0, 1,1,1]);
      //bottom
      drawTriangle3D([0,0,0, 1,0,0, 1,0,1]);
      drawTriangle3D([0,0,0, 1,0,1, 0,0,1]);
      //right
      drawTriangle3D([1,0,0, 1,1,0, 1,1,1]);
      drawTriangle3D([1,0,0, 1,1,1, 1,0,1]);
      //left
      drawTriangle3D([0,0,0, 0,0,1, 0,1,1]);
      drawTriangle3D([0,0,0, 0,1,1, 0,1,0]);
    }
  }
  
