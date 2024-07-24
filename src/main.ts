import "./style.css";

import {
  planeIndices,
  simpleCubeIndices,
  simpleCubeVertices,
  xyPlaneVertices,
  xzPlaneVertices,
  yzPlaneVertices
} from './elements/data';
import { WebGlElement } from './elements/element';
import { ShapeWebGlElementLoader } from './elements/loaders';
import { renderer } from './renderer';
import {config} from "./config.ts";

/**
 * Checklist:
 * - Add camera + mutation matrices (MVP - Model View Projection)
 * - Implement rotatios using Eulers and rotation matrices
 * - Quaternions
 */

const canvasHtmlSelector = '#canvas';
const canvas = document.querySelector<HTMLCanvasElement>(canvasHtmlSelector);

renderer
  .attach(canvasHtmlSelector)
  .frame(() => {
    if (config.enableAxisPlanes) {
      planes.forEach(plane => {
        plane.draw();
      });
    }
    cube.draw();
  })
  .start();

const cube = new WebGlElement(renderer, { vertices: simpleCubeVertices, indices: simpleCubeIndices }, ShapeWebGlElementLoader);
const planes = [
  new WebGlElement(renderer, { vertices: xzPlaneVertices, indices: planeIndices }, ShapeWebGlElementLoader),
  new WebGlElement(renderer, { vertices: xyPlaneVertices, indices: planeIndices }, ShapeWebGlElementLoader),
  new WebGlElement(renderer, { vertices: yzPlaneVertices, indices: planeIndices }, ShapeWebGlElementLoader),
]

setInterval(() => {
  cube.rotateX(0.5);
}, 5);
