class Pyramid {
  constructor() {
    this.type = 'pyramid';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
  }

  render() {
    var rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    //chatGPT used to figure out the math
    // Vertices:
    // Base: v0(0,0,0), v1(1,0,0), v2(1,0,1), v3(0,0,1)
    // Apex: v4(0.5,1,0.5)

    // Base (two triangles)
    drawTriangle3D([0,0,0, 1,0,0, 1,0,1]);
    drawTriangle3D([0,0,0, 1,0,1, 0,0,1]);

    // Four sides (each a triangle)
    drawTriangle3D([0,0,0, 1,0,0, 0.5,1,0.5]); // Front
    drawTriangle3D([1,0,0, 1,0,1, 0.5,1,0.5]); // Right
    drawTriangle3D([1,0,1, 0,0,1, 0.5,1,0.5]); // Back
    drawTriangle3D([0,0,1, 0,0,0, 0.5,1,0.5]); // Left
  }
}
