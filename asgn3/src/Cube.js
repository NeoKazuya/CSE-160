class Cube{
    constructor(){
      this.type='cube';
      //this.position = [0.0,0.0,0.0];
      this.color = [1.0,1.0,1.0,1.0];
      //this.size = 5.0;
      //this.segments = 10;
      this.matrix = new Matrix4();
      this.textureNum=-1;
    }
    
    render(color) {
      var rgba = color || this.color;
      // Pass the texture number to the shader
      gl.uniform1i(u_whichTexture, this.textureNum);

      // Pass the color to the shader
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // Pass the model matrix to the shader
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      //v0: (0,0,0), v1: (1,0,0), v2: (1,1,0), v3: (0,1,0)
      //v4: (0,0,1), v5: (1,0,1), v6: (1,1,1), v7: (0,1,1)

      //front
      // drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [1,0, 0,1, 1,1]);
      // drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
      // drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);
      drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [1,0, 1,1, 1,0]);
      drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [1,0, 0,1, 1,1]);
      //back
      // drawTriangle3D([0,0,1, 1,0,1, 1,1,1]);
      // drawTriangle3D([0,0,1, 1,1,1, 0,1,1]);
      // //top
      // drawTriangle3D([0,1,0, 1,1,1, 0,1,1]);
      // drawTriangle3D([0,1,0, 1,1,0, 1,1,1]);
      // //bottom
      // drawTriangle3D([0,0,0, 1,0,0, 1,0,1]);
      // drawTriangle3D([0,0,0, 1,0,1, 0,0,1]);
      // //right
      // drawTriangle3D([1,0,0, 1,1,0, 1,1,1]);
      // drawTriangle3D([1,0,0, 1,1,1, 1,0,1]);
      // //left
      // drawTriangle3D([0,0,0, 0,0,1, 0,1,1]);
      // drawTriangle3D([0,0,0, 0,1,1, 0,1,0]);
      //back
      drawTriangle3DUV([0,0,1, 1,0,1, 1,1,1], [1,0, 1,1, 1,0]);
      drawTriangle3DUV([0,0,1, 1,1,1, 0,1,1], [1,0, 0,1, 1,1]);
      //top
      drawTriangle3DUV([0,1,0, 1,1,1, 0,1,1], [1,0, 1,1, 1,0]);
      drawTriangle3DUV([0,1,0, 1,1,0, 1,1,1], [1,0, 0,1, 1,1]);
      //bottom
      drawTriangle3DUV([0,0,0, 1,0,0, 1,0,1], [1,0, 1,1, 1,0]);
      drawTriangle3DUV([0,0,0, 1,0,1, 0,0,1], [1,0, 0,1, 1,1]);
      //right
      drawTriangle3DUV([1,0,0, 1,1,0, 1,1,1], [1,0, 1,1, 1,0]);
      drawTriangle3DUV([1,0,0, 1,1,1, 1,0,1], [1,0, 0,1, 1,1]);
      //left
      drawTriangle3DUV([0,0,0, 0,0,1, 0,1,1], [1,0, 0,1, 1,1]);
      drawTriangle3DUV([0,0,0, 0,1,1, 0,1,0], [1,0, 0,1, 1,1]);
    }

    renderfast(color) {
      var rgba = color || this.color;
      // Pass the texture number to the shader
      gl.uniform1i(u_whichTexture, this.textureNum);

      // Pass the color to the shader
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // Pass the model matrix to the shader
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      // Original code, attempted to build one large array but vertex buffer was too small to handle it.
      //
      // var allverts=[];
      // 
      // //front
      // allverts = allverts.concat([0,0,0, 1,1,0, 1,0,0]);
      // allverts = allverts.concat([0,0,0, 0,1,0, 1,1,0]);
      // //back
      // allverts = allverts.concat([0,0,1, 1,1,1, 1,0,1]);
      // allverts = allverts.concat([0,0,1, 0,1,1, 1,1,1]);
      // //top
      // allverts = allverts.concat([0,1,0, 1,1,1, 1,1,0]);
      // allverts = allverts.concat([0,1,0, 0,1,1, 1,1,0]);
      // //bottom
      // allverts = allverts.concat([0,0,0, 0,0,1, 1,0,1]);
      // allverts = allverts.concat([0,0,0, 1,0,1, 0,0,1]);
      // //right
      // allverts = allverts.concat([1,1,0, 1,1,1, 1,0,0]);
      // allverts = allverts.concat([1,0,0, 1,1,1, 1,0,1]);
      // //left
      // allverts = allverts.concat([0,1,0, 0,1,1, 0,0,0]);
      // allverts = allverts.concat([0,0,0, 0,1,1, 0,0,1]);
      // 
      // drawTriangle3DUV(allverts, [1,0, 1,1, 1,0]);
      // //drawTriangle3D(allverts);

      // New implementation via GPT suggestion. Draw each face separately:
      // Standard UV coordinates for each face
      var uvs = [0,0, 1,1, 1,0, 0,0, 0,1, 1,1];
      
      // Front face
      drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0, 0,0,0, 0,1,0, 1,1,0], uvs);
      
      // Back face
      drawTriangle3DUV([0,0,1, 1,0,1, 1,1,1, 0,0,1, 0,1,1, 1,1,1], uvs);
      
      // Top face
      drawTriangle3DUV([0,1,0, 1,1,1, 0,1,1, 0,1,0, 1,1,0, 1,1,1], uvs);
      
      // Bottom face
      drawTriangle3DUV([0,0,0, 1,0,0, 1,0,1, 0,0,0, 1,0,1, 0,0,1], uvs);
      
      // Right face
      drawTriangle3DUV([1,0,0, 1,1,0, 1,1,1, 1,0,0, 1,1,1, 1,0,1], uvs);
      
      // Left face
      drawTriangle3DUV([0,0,0, 0,0,1, 0,1,1, 0,0,0, 0,1,1, 0,1,0], uvs);
    }
}
  
