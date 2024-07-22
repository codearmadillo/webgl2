import { Index, Vertex } from "./types";

export const simpleCubeVertices: Vertex[] = [
    { coordinates: [ -0.5, -0.5, 0.0 ], color: [ 1, 0, 0 ] },
    { coordinates: [ 0.5, -0.5, 0.0 ] },
    { coordinates: [ 0.5, 0.5, 0.0 ], color: [ 0, 0, 1 ] },
    { coordinates: [ -0.5, 0.5, 0.0 ] },
];
export const simpleCubeIndices: Index[] = [
    0, 1, 2,
    0, 2, 3
];