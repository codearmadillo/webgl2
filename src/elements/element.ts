import { renderer } from "../renderer";
import { Index, Vertex } from "./types";

export interface WebGlElementLoader<T> {
    buildWebGlData(rawData: T): { vertices: Vertex[], indices: Index[] };
}

export class WebGlElement<T> {
    private readonly $vertices: Vertex[];
    private readonly $indices: Index[];
    private readonly $loader: WebGlElementLoader<T>;

    private $vbo!: WebGLBuffer | null;
    private $ibo!: WebGLBuffer | null;
    private $vao!: WebGLVertexArrayObject | null;

    constructor(data: T, loader: new (data: T) => WebGlElementLoader<T>) {
        this.$loader = new loader(data);

        const { vertices, indices } = this.$loader.buildWebGlData(data);
        this.$vertices = vertices;
        this.$indices = indices;

        this.buildWebGlBuffers();
    }
    draw() {
        this.bind();
        renderer.webgl.drawElements(renderer.webgl.TRIANGLES, this.$indices.length, renderer.webgl.UNSIGNED_SHORT, 0);
        this.unbind();
    }
    private buildWebGlBuffers() {
        this.$vao = renderer.webgl.createVertexArray();
        if (!this.$vao) {
            throw new Error(`Failed to create vertex array object`);
        }
        this.bind();

        // VBO
        this.$vbo = renderer.webgl.createBuffer();
        if (!this.$vbo) {
            throw new Error('Failed to create vertex buffer object');
        } 
        renderer.webgl.bindBuffer(renderer.webgl.ARRAY_BUFFER, this.$vbo);
        renderer.webgl.bufferData(renderer.webgl.ARRAY_BUFFER, new Float32Array(
            this.$vertices.map((vertex) => this.serialiseVertex(vertex)).flat()
        ), renderer.webgl.STATIC_DRAW);

        // Bind VBO attributes
        const vertexByteSize = (3 + 3 + 3 + 2) * Float32Array.BYTES_PER_ELEMENT;

        renderer.webgl.vertexAttribPointer(0, 3, renderer.webgl.FLOAT, false, vertexByteSize, 0);
        renderer.webgl.enableVertexAttribArray(0);

        renderer.webgl.vertexAttribPointer(1, 3, renderer.webgl.FLOAT, false, vertexByteSize, (3) * Float32Array.BYTES_PER_ELEMENT);
        renderer.webgl.enableVertexAttribArray(1);

        renderer.webgl.vertexAttribPointer(2, 2, renderer.webgl.FLOAT, false, vertexByteSize, (3 + 3) * Float32Array.BYTES_PER_ELEMENT);
        renderer.webgl.enableVertexAttribArray(2);

        renderer.webgl.vertexAttribPointer(3, 3, renderer.webgl.FLOAT, false, vertexByteSize, (3 + 3 + 2) * Float32Array.BYTES_PER_ELEMENT);
        renderer.webgl.enableVertexAttribArray(3);

        // IBO
        this.$ibo = renderer.webgl.createBuffer();
        if (!this.$ibo) {
            throw new Error('Failed to create IBO');
        }
        renderer.webgl.bindBuffer(renderer.webgl.ELEMENT_ARRAY_BUFFER, this.$ibo);
        renderer.webgl.bufferData(renderer.webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.$indices), renderer.webgl.STATIC_DRAW);

        this.unbind();
    }
    private bind() {
        renderer.webgl.bindVertexArray(this.$vao);
    }
    private unbind() {
        renderer.webgl.bindVertexArray(null);
    }
    private serialiseVertex(vertex: Vertex) {
        return [
            ...vertex.coordinates,
            ...vertex.color ?? [ 1, 1, 1 ],
            ...vertex.textureCoordinates ?? [ 0, 0 ],
            ...vertex.normals ?? [ 0, 0, 0 ]
        ];
    }
}