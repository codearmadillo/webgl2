import "./style.css";

import { simpleCubeIndices, simpleCubeVertices } from './elements/data';
import { WebGlElement } from './elements/element';
import { ShapeWebGlElementLoader } from './elements/loaders';
import { renderer } from './renderer';

/**
 * Checklist:
 * - Add camera + mutation matrices (MVP - Model View Projection)
 * - Implement rotatios using Eulers and rotation matrices
 * - Quaternions
 */

renderer
  .attach('#canvas')
  .frame(() => {
    simpleCube.draw();
  })
  .start();

const simpleCube = new WebGlElement(renderer, { vertices: simpleCubeVertices, indices: simpleCubeIndices }, ShapeWebGlElementLoader);
