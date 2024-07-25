import {Entity, EntityManagerEvent} from "../types/ecs.ts";
import {IEventDispatcher} from "./events.ts";
import {Constructor} from "../types/common.ts";

export interface IEntityManager extends IEventDispatcher<EntityManagerEvent> {
  create();
  destroy(entity: Entity);
}

export interface IComponentManager {
  register(component: Constructor<T>);
  add(entity: Entity, component: Constructor<T>);
  remove(entity: Entity, component: Constructor<T>);
  get(entity: Entity, component: Constructor<T>): T;
  has(entity: Entity, component: Constructor<T>): boolean;
}

export interface IComponentArray<T> {
  add(entity: Entity, component: T);
  remove(entity: Entity);
  get(entity: Entity): T;
  has(entity: Entity): boolean;
}
