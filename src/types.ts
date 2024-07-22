export type Vec2 = [ a: number, b: number ];
export type Vec3 = [ a: number, b: number, c: number ];
export type Vec4 = [ a: number, b: number, c: number, d: number ];

export class Vertex {
    readonly position: Vec3;
    readonly color: Vec3;

    public get elementSize() {
        return this.position.length + this.color.length;
    }

    public get byteSize() {
        return this.elementSize * Float32Array.BYTES_PER_ELEMENT;
    }

    public get serialised() {
        return [
            ...this.position,
            ...this.color
        ]
    }

    constructor(position: Vec3, color: Vec3) {
        this.position = position;
        this.color = color;
    }

    bindAttributes(webgl: WebGL2RenderingContext) {
        // Position
        webgl.vertexAttribPointer(0, 3, webgl.FLOAT, false, this.byteSize, 0);
        webgl.enableVertexAttribArray(0);

        // Color
        webgl.vertexAttribPointer(1, 3, webgl.FLOAT, false, this.byteSize, 3 * Float32Array.BYTES_PER_ELEMENT);
        webgl.enableVertexAttribArray(1);
    }

    
}