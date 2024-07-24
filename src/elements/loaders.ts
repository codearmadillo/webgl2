import { WebGlElementLoader } from "./element";
import { Index, Vertex } from "./types";

export class ShapeWebGlElementLoader implements WebGlElementLoader<{ vertices: Vertex[], indices: Index[] }> {
    buildWebGlData(data: { vertices: Vertex[], indices: Index[] }) {
        return {
            vertices: data.vertices.map((vertex) => {
                // Normalise colours
                if (!vertex.color) {
                    vertex.color = [ 1, 1, 1 ];
                } else {
                    vertex.color = vertex.color.map((colorValue) => {
                        return Math.min(1, Math.max(0, colorValue / 255));
                    }) as [ number, number, number ]
                }
                return vertex;
            }),
            indices: data.indices
        }
    }
}
