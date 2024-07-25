import { Index, Vertex } from "./types";
import {vec3} from "gl-matrix";

const planeSize = 16;

export const xzPlaneVertices: Vertex[] = [
    { coordinates: [ -planeSize, 0, -planeSize ], color: [ 255, 0, 0 ] },
    { coordinates: [ planeSize, 0, -planeSize ], color: [ 255, 0, 0 ] },
    { coordinates: [ planeSize, 0, planeSize ], color: [ 255, 0, 0 ] },
    { coordinates: [ -planeSize, 0, planeSize ], color: [ 255, 0, 0 ] },
];
export const xyPlaneVertices: Vertex[] = [
    { coordinates: [ -planeSize, -planeSize, 0 ], color: [ 0, 255, 0 ] },
    { coordinates: [ planeSize, -planeSize, 0 ], color: [ 0, 255, 0 ] },
    { coordinates: [ planeSize, planeSize, 0 ], color: [ 0, 255, 0 ] },
    { coordinates: [ -planeSize, planeSize, 0 ], color: [ 0, 255, 0 ] },
];
export const yzPlaneVertices: Vertex[] = [
    { coordinates: [ 0, -planeSize, -planeSize ], color: [ 0, 0, 255 ] },
    { coordinates: [ 0, planeSize, -planeSize ], color: [ 0, 0, 255 ] },
    { coordinates: [ 0, planeSize, planeSize ], color: [ 0, 0, 255 ] },
    { coordinates: [ 0, -planeSize, planeSize ], color: [ 0, 0, 255 ] },
];
export const planeIndices: Index[] = [
    0, 1, 2,
    0, 2, 3
];

const white: vec3 = [ 255, 255, 255 ];

export const simpleCubeVertices: Vertex[] = [
    { coordinates: [ -5, -5, -5 ],  color: white,   textureCoordinates: [ 0.64, 0.535 ] },
    { coordinates: [ 5, -5, -5 ],   color: white,   textureCoordinates: [ 0.36, 0.535 ] },
    { coordinates: [ 5, 5, -5 ],    color: white,   textureCoordinates: [ 0.36, 0.32 ] },
    { coordinates: [ -5, 5, -5 ],   color: white,   textureCoordinates: [ 0.64, 0.32 ] },
    { coordinates: [ -5, -5, 5 ],   color: white,   textureCoordinates: [ 0, 0 ]},
    { coordinates: [ 5, -5, 5 ],    color: white,   textureCoordinates: [ 0, 0 ]},
    { coordinates: [ 5, 5, 5 ],     color: white,   textureCoordinates: [ 0, 0 ]},
    { coordinates: [ -5, 5, 5 ],    color: white,   textureCoordinates: [ 0, 0 ]},
];
export const simpleCubeIndices: Index[] = [
    0, 1, 2,
    0, 2, 3,

    4, 5, 6,
    4, 6, 7,

    0, 4, 7,
    0, 7, 3,
    1, 5, 6,
    1, 6, 2,

    0, 4, 5,
    0, 5, 1,
    3, 7, 6,
    3, 6, 2,
];
