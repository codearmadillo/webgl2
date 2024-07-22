import { Shader } from './shaders';

/**
 * Checklist:
 * - Build cube
 *  - VAO = VBO + IBO
 * - Render cube
 * - Add camera + mutation matrices (MVP - Model View Projection)
 * - Implement rotatios using Eulers and rotation matrices
 * - Quaternions
 */

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const webgl = canvas.getContext('webgl2');

if (webgl === null) {
  throw new Error('Failed to obtain WebGl2 context');
}

const shader = new Shader(webgl);

// Configure shape
const points = [
  /*
  X     Y     Z     R     G     B
  */
  -0.5, -0.5, 0.0,  1.0,  0.0,  0.0,
  0.5,  -0.5, 0.0,  0.0,  1.0,  0.0,
  0.0,  0.5,  0.0,  0.0,  0.0,  1.0
];

const vbo = webgl.createBuffer();
webgl.bindBuffer(webgl.ARRAY_BUFFER, vbo);
webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(points), webgl.STATIC_DRAW);

webgl.vertexAttribPointer(0, 3, webgl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
webgl.enableVertexAttribArray(0);

webgl.vertexAttribPointer(1, 3, webgl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
webgl.enableVertexAttribArray(1);

webgl.bindBuffer(webgl.ARRAY_BUFFER, null);

// Configure webgl
webgl.enable(webgl.BLEND);
webgl.blendFunc(webgl.SRC_ALPHA, webgl.ONE_MINUS_SRC_ALPHA);

// Draw
webgl.useProgram(shader.program);

webgl.clearColor(0.0, 0.0, 0.0, 1.0);
webgl.clear(webgl.COLOR_BUFFER_BIT);

webgl.bindBuffer(webgl.ARRAY_BUFFER, vbo);
webgl.drawArrays(webgl.TRIANGLES, 0, 3);