import { simpleCubeIndices, simpleCubeVertices } from './elements/data';
import { WebGlElement } from './elements/element';
import { ShapeWebGlElementLoader } from './elements/element.shape';
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

// Create elements
const simpleCube = new WebGlElement({ vertices: simpleCubeVertices, indices: simpleCubeIndices }, ShapeWebGlElementLoader);

// Configure webgl
webgl.enable(webgl.BLEND);
webgl.blendFunc(webgl.SRC_ALPHA, webgl.ONE_MINUS_SRC_ALPHA);

// Draw
webgl.useProgram(shader.program);

webgl.clearColor(0.0, 0.0, 0.0, 1.0);
webgl.clear(webgl.COLOR_BUFFER_BIT);

simpleCube.draw();