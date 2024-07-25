import {IComponentArray} from "../../interfaces/ecs.ts";
import {Entity} from "../../types/ecs.ts";

export class ComponentArray<T> implements IComponentArray<T> {
  private $data: Map<Entity, T> = new Map();

  add(entity: Entity, component: T) {
    this.$data.set(entity, component);
  }

  remove(entity: Entity) {
    this.$data.delete(entity);
  }

  get(entity: Entity): T {
    return this.$data.get(entity);
  }

  has(entity: Entity): boolean {
    return this.$data.has(entity);
  }
}
