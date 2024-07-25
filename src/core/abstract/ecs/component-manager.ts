import {EventDispatcher} from "../events.ts";
import {IComponentArray, IComponentManager} from "../../interfaces/ecs.ts";
import {EntityManager} from "./entity-manager.ts";
import {Entity} from "../../types/ecs.ts";
import {Constructor} from "../../types/common.ts";
import {Metadata} from "../../enums/metadata.ts";
import {ComponentArray} from "./component-array.ts";

export class ComponentManager implements IComponentManager {
  private static $instance: ComponentManager;
  private $arrays: Map<string, IComponentArray<any>> = new Map();
  private get $entities() {
    return EntityManager.instance;
  }

  private constructor() {
    this.$entities.on('destroyed', this.onEntityDestroyed.bind(this));
  }

  register(component: Constructor<T>) {
    const uuid = Reflect.getMetadata(Metadata.ComponentIdentifier, component.prototype);
    if (!uuid) {
      throw new Error(`Failed to register component of type ${component.name} - have you used the @Component decorator?`);
    }
    if (this.$arrays.has(uuid)) {
      throw new Error(`Failed to register component of type ${component.name} - already registered`);
    }
    this.$arrays.set(uuid, new ComponentArray<T>());
  }

  add(entity: Entity, component: T) {
    const uuid = this.getUuidOrThrow(component.constructor);
    this.$arrays.get(uuid).add(entity, component);
  }

  remove(entity: Entity, component: Constructor<T>) {
    const uuid = this.getUuidOrThrow(component);
    this.$arrays.get(uuid).remove(entity);
  }

  get(entity: Entity, component: Constructor<T>): T {
    const uuid = this.getUuidOrThrow(component);
    return this.$arrays.get(uuid).get(entity);
  }

  has(entity: Entity, component: Constructor<T>): boolean {
    const uuid = this.getUuidOrThrow(component);
    return this.$arrays.get(uuid).has(entity);
  }

  public static get instance() {
    if (!ComponentManager.$instance) {
      ComponentManager.$instance = new ComponentManager();
    }
    return ComponentManager.$instance;
  }

  private onEntityDestroyed(entity: Entity) {
    this.$arrays.forEach(array => array.remove(entity));
  }

  private getUuidOrThrow<T>(component: Constructor<T>) {
    const uuid = Reflect.getMetadata(Metadata.ComponentIdentifier, component.prototype);
    if (!uuid) {
      throw new Error(`Failed to add component of type ${component.name} - have you used the @Component decorator?`);
    }
    if (!this.$arrays.has(uuid)) {
      throw new Error(`Failed to add component of type ${component.name} - not registered`);
    }
    return uuid;
  }
}
