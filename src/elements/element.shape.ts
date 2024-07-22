import { WebGlElementLoader } from "./element";
import { Index, Vertex } from "./types";

export class ShapeWebGlElementLoader implements WebGlElementLoader<{ vertices: Vertex[], indices: Index[] }> {
    buildWebGlData(data: { vertices: Vertex[], indices: Index[] }) {
        return {
            vertices: data.vertices,
            indices: data.indices
        }
    }
}