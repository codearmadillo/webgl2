export type Vec2 = [ a: number, b: number ];
export type Vec3 = [ a: number, b: number, c: number ];
export type Vec4 = [ a: number, b: number, c: number, d: number ];

export class Vertex {
    readonly position: Vec3;
    readonly color: Vec3;
    readonly textureCoordinates: Vec2;
    readonly normals: Vec3;

    static get elementSize() {
        return 3 + 3 + 2 + 3;
    }

    static get byteSize() {
        return Vertex.elementSize * Float32Array.BYTES_PER_ELEMENT;
    }

    constructor(position: Vec3, color: Vec3, textureCoordinates?: Vec2, normals?: Vec3) {
        this.position = position;
        this.color = color;
        this.textureCoordinates = textureCoordinates ?? [ 0, 0 ];
        this.normals = normals ?? [ 0, 0, 0 ];
    }

    static serialise(vertex: Vertex) {
        return [
            ...vertex.position,
            ...vertex.color,
            ...vertex.textureCoordinates,
            ...vertex.normals
        ]
    }
}