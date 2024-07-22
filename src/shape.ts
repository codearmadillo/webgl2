import { Vertex } from "./types";

export class Shape {
    private readonly $vertices: Vertex[];
    private readonly $indices: number[];

    private readonly $webgl: WebGL2RenderingContext;

    private readonly $vbo: WebGLBuffer;
    private readonly $ibo: WebGLBuffer;
    private readonly $vao: WebGLVertexArrayObject | null;

    constructor(webgl: WebGL2RenderingContext, vertices: Vertex[], indices: number[]) {
        this.$webgl = webgl;
        
        this.$vertices = vertices;
        this.$indices = indices;

        this.$vao = webgl.createVertexArray();
        if (!this.$vao) {
            throw new Error(`Failed to create vertex array object`);
        }
        this.bind();

        this.$vbo = this.createVbo();
        this.$ibo = this.createIbo();
        
        this.unbind();
    }

    draw() {
        this.bind();
        this.$webgl.drawElements(this.$webgl.TRIANGLES, this.$indices.length, this.$webgl.UNSIGNED_SHORT, 0);
        this.unbind();
    }

    private createVbo() {
        const buffer = this.$webgl.createBuffer();
        if (!buffer) {
            throw new Error('Failed to create VBO');
        }
        this.$webgl.bindBuffer(this.$webgl.ARRAY_BUFFER, buffer);
        this.$webgl.bufferData(this.$webgl.ARRAY_BUFFER, new Float32Array(this.$vertices.map((v) => v.serialised).flat()), this.$webgl.STATIC_DRAW);

        this.$vertices[0].bindAttributes(this.$webgl);

        return buffer;
    }

    private createIbo() {
        const buffer = this.$webgl.createBuffer();
        if (!buffer) {
            throw new Error('Failed to create VBO');
        }
        this.$webgl.bindBuffer(this.$webgl.ELEMENT_ARRAY_BUFFER, buffer);
        this.$webgl.bufferData(this.$webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.$indices), this.$webgl.STATIC_DRAW);
        return buffer;
    }

    private bind() {
        this.$webgl.bindVertexArray(this.$vao);
    }

    private unbind() {
        this.$webgl.bindVertexArray(null);
    }
}