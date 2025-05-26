class Sphere{
    constructor(){
      this.type='sphere';
      //this.position = [0.0,0.0,0.0];
      this.color = [1.0,1.0,1.0,1.0];
      //this.size = 5.0;
      //this.segments = 10;
      this.matrix = new Matrix4();
      this.textureNum=-2;
      this.verts32 = new Float32Array([]);
    }
    
    render(color) {
      var rgba = color || this.color;
      // Pass the texture number to the shader
      gl.uniform1i(u_whichTexture, this.textureNum);

      // Pass the color to the shader
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

      // Pass the model matrix to the shader
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      var d = Math.PI / 10;
      var dd = Math.PI / 10;

      for (var t = 0; t < Math.PI; t += d) {
        for (var r = 0; r < (2 * Math.PI); r += d) {
          var p1 = [Math.sin(t) * Math.cos(r), Math.sin(t) * Math.sin(r), Math.cos(t)];
          var p2 = [Math.sin(t + dd) * Math.cos(r), Math.sin(t + dd) * Math.sin(r), Math.cos(t + dd)];
          var p3 = [Math.sin(t) * Math.cos(r + dd), Math.sin(t) * Math.sin(r + dd), Math.cos(t)];
          var p4 = [Math.sin(t + dd) * Math.cos(r + dd), Math.sin(t + dd) * Math.sin(r + dd), Math.cos(t + dd)];

          var uv1 = [t/Math.PI, r/(2*Math.PI)];
          var uv2 = [(t+dd)/Math.PI, r/(2*Math.PI)];
          var uv3 = [t/Math.PI, (r+dd)/(2*Math.PI)];
          var uv4 = [(t+dd)/Math.PI, (r+dd)/(2*Math.PI)];

          var v = [];
          var uv = [];
          v = v.concat(p1); uv = uv.concat(uv1);
          v = v.concat(p2); uv = uv.concat(uv2);
          v = v.concat(p4); uv = uv.concat(uv4);

          gl.uniform4f(u_FragColor, 1,1,1,1);
          drawTriangle3DUVNormal(v,uv,v); // Pass v as normal

          v = []; uv = [];
          v = v.concat(p1); uv = uv.concat(uv1);
          v = v.concat(p4); uv = uv.concat(uv4);
          v = v.concat(p3); uv = uv.concat(uv3);
          gl.uniform4f(u_FragColor, 1,0,0,1);
          drawTriangle3DUVNormal(v,uv,v); // Pass v as normal
        }
      }
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
  
