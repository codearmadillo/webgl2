import "./style.css";

import { simpleCubeIndices, simpleCubeVertices } from './elements/data';
import { WebGlElement } from './elements/element';
import { ShapeWebGlElementLoader } from './elements/element.shape';
import { renderer } from './renderer';

/**
 * Checklist:
 * - Add camera + mutation matrices (MVP - Model View Projection)
 * - Implement rotatios using Eulers and rotation matrices
 * - Quaternions
 */

renderer
  .init()
  .onRender(() => {
    simpleCube.draw();
  })
  .start();

const simpleCube = new WebGlElement({ vertices: simpleCubeVertices, indices: simpleCubeIndices }, ShapeWebGlElementLoader);