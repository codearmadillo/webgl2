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

const CAMERA_ROTATION_SPEED = 0.25;
const CUBE_MOVEMENT_SPEED = 0.15;

let isCameraRotatingLeft = false;
let isCameraRotatingRight = false;
let isCubeMovingLeft = false;
let isCubeMovingRight = false;
let isCubeMovingForward = false;
let isCubeMovingBackward = false;

window.addEventListener('keydown', (e) => {
  isCameraRotatingLeft = e.key === 'ArrowLeft';
  isCameraRotatingRight = e.key === 'ArrowRight';
  isCubeMovingLeft = e.key === 'a';
  isCubeMovingRight = e.key === 'd';
  isCubeMovingForward = e.key === 'w';
  isCubeMovingBackward = e.key === 's';
});
window.addEventListener('keyup', (e) => {
  isCameraRotatingLeft = e.key === 'ArrowLeft' && false;
  isCameraRotatingRight = e.key === 'ArrowRight' && false;
  isCubeMovingLeft = e.key === 'a' && false;
  isCubeMovingRight = e.key === 'd' && false;
  isCubeMovingForward = e.key === 'w' && false;
  isCubeMovingBackward = e.key === 's' && false;
});

renderer
  .attach(config.canvasHtmlSelector)
  .update((dt) => {
    if (isCameraRotatingLeft && !isCameraRotatingRight) {
      renderer.camera.rotate(-CAMERA_ROTATION_SPEED * dt);
    }
    if (isCameraRotatingRight && !isCameraRotatingLeft) {
      renderer.camera.rotate(CAMERA_ROTATION_SPEED * dt);
    }
    if (isCubeMovingLeft && !isCubeMovingRight) {
      cube.translate([CUBE_MOVEMENT_SPEED * dt, 0, 0]);
    }
    if (isCubeMovingRight && !isCubeMovingLeft) {
      cube.translate([-CUBE_MOVEMENT_SPEED * dt, 0, 0]);
    }
    if (isCubeMovingForward && !isCubeMovingBackward) {
      cube.translate([0, 0, CUBE_MOVEMENT_SPEED * dt]);
    }
    if (isCubeMovingBackward && !isCubeMovingForward) {
      cube.translate([0, 0, -CUBE_MOVEMENT_SPEED * dt]);
    }
  })
  .draw(() => {
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
];
