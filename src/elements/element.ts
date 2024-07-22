import { getWebGlContext } from "../webgl";

type Vertex = {
    coordinates: [ number, number, number ],
    color?: [ number, number, number ],
    textureCoordinates?: [ number, number ],
    normals?: [ number, number, number ]
}
type Index = number;


export interface ElementLoader<T> {
    buildWebGlData(rawData: T): { vertices: Vertex[], indices: Index[] };
}
export class Element<T> {
    private readonly $webgl: WebGL2RenderingContext;
    private readonly $vertices: Vertex[];
    private readonly $indices: Index[];
    private readonly $loader: ElementLoader<T>;

    private $vbo!: WebGLBuffer | null;
    private $ibo!: WebGLBuffer | null;
    private $vao!: WebGLVertexArrayObject | null;

    constructor(data: T, loader: new (data: T) => ElementLoader<T>) {
        this.$loader = new loader(data);
        this.$webgl = getWebGlContext();

        const { vertices, indices } = this.$loader.buildWebGlData(data);
        this.$vertices = vertices;
        this.$indices = indices;

        this.buildWebGlBuffers();
    }
    draw() {
        this.bind();
        this.$webgl.drawElements(this.$webgl.TRIANGLES, this.$indices.length, this.$webgl.UNSIGNED_SHORT, 0);
        this.unbind();
    }
    private buildWebGlBuffers() {
        this.$vao = this.$webgl.createVertexArray();
        if (!this.$vao) {
            throw new Error(`Failed to create vertex array object`);
        }
        this.bind();

        // VBO
        this.$vbo = this.$webgl.createBuffer();
        if (!this.$vbo) {
            throw new Error('Failed to create vertex buffer object');
        } 
        this.$webgl.bindBuffer(this.$webgl.ARRAY_BUFFER, this.$vbo);
        this.$webgl.bufferData(this.$webgl.ARRAY_BUFFER, new Float32Array(
            this.$vertices.map((vertex) => this.serialiseVertex(vertex)).flat()
        ), this.$webgl.STATIC_DRAW);

        // Bind VBO attributes
        const vertexByteSize = (3 + 3 + 3 + 2) * Float32Array.BYTES_PER_ELEMENT;

        this.$webgl.vertexAttribPointer(0, 3, this.$webgl.FLOAT, false, vertexByteSize, 0);
        this.$webgl.enableVertexAttribArray(0);

        this.$webgl.vertexAttribPointer(1, 3, this.$webgl.FLOAT, false, vertexByteSize, (3) * Float32Array.BYTES_PER_ELEMENT);
        this.$webgl.enableVertexAttribArray(1);

        this.$webgl.vertexAttribPointer(2, 2, this.$webgl.FLOAT, false, vertexByteSize, (3 + 3) * Float32Array.BYTES_PER_ELEMENT);
        this.$webgl.enableVertexAttribArray(2);

        this.$webgl.vertexAttribPointer(3, 3, this.$webgl.FLOAT, false, vertexByteSize, (3 + 3 + 2) * Float32Array.BYTES_PER_ELEMENT);
        this.$webgl.enableVertexAttribArray(3);

        // IBO
        this.$ibo = this.$webgl.createBuffer();
        if (!this.$ibo) {
            throw new Error('Failed to create IBO');
        }
        this.$webgl.bindBuffer(this.$webgl.ELEMENT_ARRAY_BUFFER, this.$ibo);
        this.$webgl.bufferData(this.$webgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.$indices), this.$webgl.STATIC_DRAW);

        this.unbind();
    }
    private bind() {
        this.$webgl.bindVertexArray(this.$vao);
    }
    private unbind() {
        this.$webgl.bindVertexArray(null);
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


class ShapeElementLoader implements ElementLoader<{ vertices: Vertex[], indices: Index[] }> {
    buildWebGlData(data: { vertices: Vertex[], indices: Index[] }) {
        return {
            vertices: data.vertices,
            indices: data.indices
        }
    }
}



// Simple cube
const simpleCubeVertices: Vertex[] = [
    { coordinates: [ -0.5, -0.5, 0.0 ] },
    { coordinates: [ 0.5, -0.5, 0.0 ] },
    { coordinates: [ 0.5, 0.5, 0.0 ] },
    { coordinates: [ -0.5, 0.5, 0.0 ] },
];
const simpleCubeIndices: Index[] = [
    0, 1, 2,
    0, 2, 3
];
const simpleCube = new Element({ vertices: simpleCubeVertices, indices: simpleCubeIndices }, ShapeElementLoader);

export {
    simpleCube
}