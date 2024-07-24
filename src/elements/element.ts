import { type WebGlRenderer } from "../renderer";
import { Index, Vertex } from "./types";
import { mat4 } from "gl-matrix";

export interface WebGlElementLoader<T> {
    buildWebGlData(rawData: T): { vertices: Vertex[], indices: Index[] };
}

export class WebGlElement<T> {
    private readonly $vertices: Vertex[];
    private readonly $indices: Index[];
    private readonly $renderer: WebGlRenderer;
    private readonly $loader: WebGlElementLoader<T>;

    private readonly $model: mat4 = mat4.create();

    private $vbo!: WebGLBuffer | null;
    private $ibo!: WebGLBuffer | null;
    private $vao!: WebGLVertexArrayObject | null;

    constructor(renderer: WebGlRenderer, data: T, loader: new (data: T) => WebGlElementLoader<T>) {
        this.$loader = new loader(data);
        this.$renderer = renderer;

        const { vertices, indices } = this.$loader.buildWebGlData(data);
        this.$vertices = vertices;
        this.$indices = indices;

        this.buildWebGlBuffers();
    }
    rotateX(degrees: number) {
        mat4.rotate(this.$model, this.$model, degrees * Math.PI / 180, [ 1, 0, 0 ]);
    }
    rotateY(degrees: number) {
        mat4.rotate(this.$model, this.$model, degrees * Math.PI / 180, [ 0, 1, 0 ]);
    }
    rotateZ(degrees: number) {
        mat4.rotate(this.$model, this.$model, degrees * Math.PI / 180, [ 0, 0, 1 ]);
    }
    draw() {
        this.bind();
        this.$renderer.webgl.uniformMatrix4fv(this.$renderer.shader.uModelUniformLocation, false, this.$model);
        this.$renderer.webgl.drawElements(this.$renderer.webgl.TRIANGLES, this.$indices.length, this.$renderer.webgl.UNSIGNED_SHORT, 0);
        this.unbind();
    }
    private buildWebGlBuffers() {
        this.$vao = this.$renderer.webgl.createVertexArray();
        if (!this.$vao) {
            throw new Error(`Failed to create vertex array object`);
        }
        this.bind();

        // VBO
        this.$vbo = this.$renderer.webgl.createBuffer();
        if (!this.$vbo) {
            throw new Error('Failed to create vertex buffer object');
        }
        this.$renderer.webgl.bindBuffer(this.$renderer.webgl.ARRAY_BUFFER, this.$vbo);
        this.$renderer.webgl.bufferData(this.$renderer.webgl.ARRAY_BUFFER, new Float32Array(
            this.$vertices.map((vertex) => this.serialiseVertex(vertex)).flat()
        ), this.$renderer.webgl.STATIC_DRAW);

        // Bind VBO attributes
        const vertexByteSize = (3 + 3 + 3 + 2) * Float32Array.BYTES_PER_ELEMENT;

        this.$renderer.webgl.vertexAttribPointer(0, 3, this.$renderer.webgl.FLOAT, false, vertexByteSize, 0);
        this.$renderer.webgl.enableVertexAttribArray(0);

        this.$renderer.webgl.vertexAttribPointer(1, 3, this.$renderer.webgl.FLOAT, false, vertexByteSize, (3) * Float32Array.BYTES_PER_ELEMENT);
        this.$renderer.webgl.enableVertexAttribArray(1);

        this.$renderer.webgl.vertexAttribPointer(2, 2, this.$renderer.webgl.FLOAT, false, vertexByteSize, (3 + 3) * Float32Array.BYTES_PER_ELEMENT);
        this.$renderer.webgl.enableVertexAttribArray(2);

        this.$renderer.webgl.vertexAttribPointer(3, 3, this.$renderer.webgl.FLOAT, false, vertexByteSize, (3 + 3 + 2) * Float32Array.BYTES_PER_ELEMENT);
        this.$renderer.webgl.enableVertexAttribArray(3);

        // IBO
        this.$ibo = this.$renderer.webgl.createBuffer();
        if (!this.$ibo) {
            throw new Error('Failed to create IBO');
        }
        this.$renderer.webgl.bindBuffer(this.$renderer.webgl.ELEMENT_ARRAY_BUFFER, this.$ibo);
        this.$renderer.webgl.bufferData(this.$renderer.webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.$indices), this.$renderer.webgl.STATIC_DRAW);

        this.unbind();
    }
    private bind() {
        this.$renderer.webgl.bindVertexArray(this.$vao);
    }
    private unbind() {
        this.$renderer.webgl.bindVertexArray(null);
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
