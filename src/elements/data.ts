import { Index, Vertex } from "./types";

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

export const simpleCubeVertices: Vertex[] = [
    { coordinates: [ -5, -5, -5 ],  color: [ 255, 0, 0 ]},
    { coordinates: [ 5, -5, -5 ],   color: [ 0, 255, 0 ]},
    { coordinates: [ 5, 5, -5 ],    color: [ 0, 0, 255 ]},
    { coordinates: [ -5, 5, -5 ],   color: [ 255, 255, 0 ]},
    { coordinates: [ -5, -5, 5 ],   color: [ 255, 0, 255 ]},
    { coordinates: [ 5, -5, 5 ],    color: [ 0, 255, 255 ]},
    { coordinates: [ 5, 5, 5 ],     color: [ 255, 128, 0 ]},
    { coordinates: [ -5, 5, 5 ],    color: [ 128, 0, 128 ]},
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
    3, 6, 2
];
