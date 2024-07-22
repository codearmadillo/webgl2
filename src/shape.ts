import { Vec2, Vec3, Vertex } from "./types";

/**
 * OBJ TODO:
 * - Load positions/texture positions/normals
 * - Load faces
 * - Create unique vertices out of faces
 * - Create triangles
*/

export class ObjShape {
    private readonly $coordinates: Vec3[] = [];
    private readonly $normals: Vec3[] = [];
    private readonly $textureCoordinates: Vec2[] = [];

    private readonly $vertexMap: Record<string, Vertex> = {};

    private readonly $indices: Vec3[] = [];
    private readonly $shape!: Shape;

    private get $vertices() {
        return Object.values(this.$vertexMap);
    }

    constructor(webgl: WebGL2RenderingContext, objFile: string) {
        this.parse(objFile);
        this.$shape = new Shape(webgl, this.$vertices, this.$indices.flat());
    }

    draw() {
        this.$shape.draw();
    }

    private parse(objFile: string) {
        const lines = objFile.split('\n');
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('vn ')) {
                this.$normals.push(this.parseNormals(line));
            }
            if (line.startsWith('vt ')) {
                this.$textureCoordinates.push(this.parseTextureCoordinates(line));
            }
            if (line.startsWith('v ')) {
                this.$coordinates.push(this.parseCoordinates(line));
            }
        }
        
        // Create vertices
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('f ')) {
                this.$indices.push(this.parseFace(lines[i]));
            }
        }
    }

    private parseCoordinates(line: string): Vec3 {
        return line.split(' ').slice(1, 4).map((i) => parseFloat(i)) as Vec3;
    }

    private parseTextureCoordinates(line: string): Vec2 {
        return line.split(' ').slice(1, 3).map((i) => parseFloat(i)) as Vec2;
    }

    private parseNormals(line: string): Vec3 {
        return line.split(' ').slice(1, 4).map((i) => parseFloat(i)) as Vec3;
    }

    private parseFace(line: string): Vec3 {
        // Create unique vertices
        const vertexSignatures = line.split(' ').slice(1, 4);
        for (let i = 0; i < vertexSignatures.length; i++) {
            const signature = vertexSignatures[i];
            
            if (signature in this.$vertexMap) {
            
                continue;
            }

            // Simple positional vertex
            // Vertex index - f v1 v2 v3
            if (!signature.includes('/')) {
                const coordinates = this.$coordinates[parseInt(signature) - 1];
                this.$vertexMap[signature] = new Vertex(coordinates, [ 1, 1, 1 ]);
                continue;
            }

            // Vertex without texture coordinates
            // Vertex/Normal without text. coord index - f v1//vn1 v2//vn2 v3//vn3
            if (signature.includes('//')) {
                const coordinates = this.$coordinates[parseInt(signature.split('/')[0]) - 1];
                const normals = this.$normals[parseInt(signature.split('/')[2]) - 1];
                this.$vertexMap[signature] = new Vertex(coordinates, [ 1, 1, 1 ], undefined, normals);
                continue;
            }

            // Vertex with only texture coordinates
            // Vertex/TextCoord index - f v1/vt1 v2/vt2 v3/vt3
            if (signature.split('/').length === 2) {
                const coordinates = this.$coordinates[parseInt(signature.split('/')[0]) - 1];
                const textureCoordinates = this.$textureCoordinates[parseInt(signature.split('/')[1]) - 1];
                this.$vertexMap[signature] = new Vertex(coordinates, [ 1, 1, 1 ], textureCoordinates, undefined);
                continue;
            } 
            
            // Standard vertex
            // Vertex - f v1/vt1/vn1 ...
            const coordinates = this.$coordinates[parseInt(signature.split('/')[0]) - 1];
            const textureCoordinates = this.$textureCoordinates[parseInt(signature.split('/')[1]) - 1];
            const normals = this.$normals[parseInt(signature.split('/')[2]) - 1];

            this.$vertexMap[signature] = new Vertex(coordinates, [ 1, 1, 1 ], textureCoordinates, normals);
        }

        // Build unique indices for face
        const vertices = line.split(' ').slice(1, 4);
        const indices = vertices.map((vertexSignature) => Object.keys(this.$vertexMap).findIndex((v) => v === vertexSignature));

        return indices as Vec3;
    }
}

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
        this.$webgl.bufferData(this.$webgl.ARRAY_BUFFER, new Float32Array(this.$vertices.map((v) => Vertex.serialise(v)).flat()), this.$webgl.STATIC_DRAW);

        // Position
        this.$webgl.vertexAttribPointer(0, 3, this.$webgl.FLOAT, false, Vertex.byteSize, 0);
        this.$webgl.enableVertexAttribArray(0);

        // Color
        this.$webgl.vertexAttribPointer(1, 3, this.$webgl.FLOAT, false, Vertex.byteSize, (3) * Float32Array.BYTES_PER_ELEMENT);
        this.$webgl.enableVertexAttribArray(1);

        // Texture Coordinates
        this.$webgl.vertexAttribPointer(2, 2, this.$webgl.FLOAT, false, Vertex.byteSize, (3 + 3) * Float32Array.BYTES_PER_ELEMENT);
        this.$webgl.enableVertexAttribArray(2);

        // Normals
        this.$webgl.vertexAttribPointer(3, 3, this.$webgl.FLOAT, false, Vertex.byteSize, (3 + 3 + 2) * Float32Array.BYTES_PER_ELEMENT);
        this.$webgl.enableVertexAttribArray(3);

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