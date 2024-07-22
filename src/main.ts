import { Shader } from './shaders';

/**
 * Checklist:
 * - Init WebGL in canvas
 * - Get context
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

webgl.clearColor(0.0, 0.0, 0.0, 1.0);
webgl.clear(webgl.COLOR_BUFFER_BIT);

const shader = new Shader(webgl);
shader.bind();