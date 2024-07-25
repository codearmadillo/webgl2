import {Component} from "../../core/decorators/ecs.ts";
import { vec3 } from "gl-matrix";

@Component()
export class TransformComponent {
  position?: vec3 = [0, 0, 0];
  rotation?: vec3 = [0, 0, 0];
  scale?: vec3 = [1, 1, 1];

  constructor(data: Partial<TransformComponent>) {
    Object.assign(this, data);
  }
}
