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
const cubeSize = 5;

export const simpleCubeVertices: Vertex[] = [
    // Front face
    { coordinates: [ -cubeSize, -cubeSize, -cubeSize ],  color: white,   textureCoordinates: [ 0.64, 0.535 ] },
    { coordinates: [ cubeSize, -cubeSize, -cubeSize ],   color: white,   textureCoordinates: [ 0.36, 0.535 ] },
    { coordinates: [ cubeSize, cubeSize, -cubeSize ],    color: white,   textureCoordinates: [ 0.36, 0.32 ] },
    { coordinates: [ -cubeSize, cubeSize, -cubeSize ],   color: white,   textureCoordinates: [ 0.64, 0.32 ] },

    // Back face
    { coordinates: [ -cubeSize, -cubeSize, cubeSize ],   color: white,   textureCoordinates: [ .64, .965 ]},
    { coordinates: [ cubeSize, -cubeSize, cubeSize ],    color: white,   textureCoordinates: [ .36, .965 ]},
    { coordinates: [ cubeSize, cubeSize, cubeSize ],     color: white,   textureCoordinates: [ .36, .75 ]},
    { coordinates: [ -cubeSize, cubeSize, cubeSize ],    color: white,   textureCoordinates: [ .64, .75 ]},

    // Bottom face
    { coordinates: [ -cubeSize, -cubeSize, -cubeSize ],  color: white,   textureCoordinates: [ 0.64, 0.75 ] },
    { coordinates: [ cubeSize, -cubeSize, -cubeSize ],   color: white,   textureCoordinates: [ 0.36, 0.75 ] },
    { coordinates: [ cubeSize, -cubeSize, cubeSize ],    color: white,   textureCoordinates: [ 0.36, 0.535 ] },
    { coordinates: [ -cubeSize, -cubeSize, cubeSize ],   color: white,   textureCoordinates: [ 0.64, 0.535 ] },

    // Top face
    { coordinates: [ -cubeSize, cubeSize, -cubeSize ],   color: white,   textureCoordinates: [ 0.64, 0.32 ] },
    { coordinates: [ cubeSize, cubeSize, -cubeSize ],    color: white,   textureCoordinates: [ 0.36, 0.32 ] },
    { coordinates: [ cubeSize, cubeSize, cubeSize ],     color: white,   textureCoordinates: [ 0.36, 0.12 ] },
    { coordinates: [ -cubeSize, cubeSize, cubeSize ],    color: white,   textureCoordinates: [ 0.64, 0.12 ] },

    // Left face
    { coordinates: [ -cubeSize, -cubeSize, -cubeSize ],  color: white,   textureCoordinates: [ 0.16, 0.535 ] },
    { coordinates: [ -cubeSize, -cubeSize, cubeSize ],   color: white,   textureCoordinates: [ 0.36, 0.535 ] },
    { coordinates: [ -cubeSize, cubeSize, cubeSize ],    color: white,   textureCoordinates: [ 0.36, 0.32 ] },
    { coordinates: [ -cubeSize, cubeSize, -cubeSize ],   color: white,   textureCoordinates: [ 0.16, 0.32 ] },

    // Right face
    { coordinates: [ cubeSize, -cubeSize, -cubeSize ],   color: white,   textureCoordinates: [ 0.64, 0.535 ] },
    { coordinates: [ cubeSize, -cubeSize, cubeSize ],    color: white,   textureCoordinates: [ 0.86, 0.535 ] },
    { coordinates: [ cubeSize, cubeSize, cubeSize ],     color: white,   textureCoordinates: [ 0.86, 0.32 ] },
    { coordinates: [ cubeSize, cubeSize, -cubeSize ],    color: white,   textureCoordinates: [ 0.64, 0.32 ] },
  /*
    { coordinates: [ -5, -5, -5 ],  color: white,   textureCoordinates: [ 0.64, 0.535 ] },
    { coordinates: [ 5, -5, -5 ],   color: white,   textureCoordinates: [ 0.36, 0.535 ] },
    { coordinates: [ 5, 5, -5 ],    color: white,   textureCoordinates: [ 0.36, 0.32 ] },
    { coordinates: [ -5, 5, -5 ],   color: white,   textureCoordinates: [ 0.64, 0.32 ] },
    { coordinates: [ -5, -5, 5 ],   color: white,   textureCoordinates: [ 0, 0 ]},
    { coordinates: [ 5, -5, 5 ],    color: white,   textureCoordinates: [ 0, 0 ]},
    { coordinates: [ 5, 5, 5 ],     color: white,   textureCoordinates: [ 0, 0 ]},
    { coordinates: [ -5, 5, 5 ],    color: white,   textureCoordinates: [ 0, 0 ]},

   */
];
export const simpleCubeIndices: Index[] = [
    // Front face
    0, 1, 2,
    0, 2, 3,

    // Back face
    4, 5, 6,
    4, 6, 7,

    // Bottom face
    8, 9, 10,
    8, 10, 11,

    // Top face
    12, 13, 14,
    12, 14, 15,

    // Left face
    16, 17, 18,
    16, 18, 19,

    // Right face
    20, 21, 22,
    20, 22, 23

    /*

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

   */
];
