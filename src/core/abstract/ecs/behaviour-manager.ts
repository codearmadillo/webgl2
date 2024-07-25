import {IBehaviour, IBehaviourManager, IComponentArray} from "../../interfaces/ecs.ts";
import {EntityManager} from "./entity-manager.ts";
import {Constructor} from "../../types/common.ts";
import {Metadata} from "../../enums/metadata.ts";
import {Entity} from "../../types/ecs.ts";
import {ComponentManager} from "./component-manager.ts";

export class BehaviourManager implements IBehaviourManager {
  private static $instance: BehaviourManager;
  private $behaviours: Map<string, IBehaviour> = new Map();
  private $entitySignatures: Map<Entity, number> = new Map();

  private get $entities() {
    return EntityManager.instance;
  }
  private get $components() {
    return ComponentManager.instance;
  }

  private constructor() {
    this.$entities.on('created', this.onEntityCreated.bind(this));
    this.$entities.on('destroyed', this.onEntityDestroyed.bind(this));
    this.$components.on('entity-component-added', this.onEntityComponentAdded.bind(this));
    this.$components.on('entity-component-removed', this.onEntityComponentRemoved.bind(this));
  }

  frame(dt: number) {
    this.$behaviours.forEach((behaviour) => {
      const signature = Reflect.getMetadata(Metadata.SystemSignature, behaviour.constructor.prototype);
      // Potentially dangerous - should implement type check and InstanceOf check
      // It should also be possible to set context of behaviour somehow, via metadata
      this.$entitySignatures.forEach((entitySignature, entity) => {
        // run method if entity signature matches behaviour signature. use behaviour signature as bitmask
        if ((entitySignature & signature) === signature) {
          behaviour.update(dt, entity);
        }
      });
    });
  }

  register(behaviour: Constructor<T>) {
    const uuid = Reflect.getMetadata(Metadata.SystemIdentifier, behaviour.prototype);
    if (!uuid) {
      throw new Error(`Failed to add behaviour of type ${behaviour.name} - have you used the @Behaviour decorator?`);
    }
    if (this.$behaviours.has(uuid)) {
      throw new Error(`Failed to add behaviour of type ${behaviour.name} - already registered`);
    }
    this.$behaviours.set(uuid, new behaviour());
  }

  private onEntityComponentAdded(entity: Entity, componentSignatureIndex: number) {
    if (!this.$entitySignatures.has(entity)) {
      throw new Error(`Tried to update entity signature but entity was not found`);
    }
    this.$entitySignatures.set(entity, this.$entitySignatures.get(entity)! | (1 << componentSignatureIndex));
  }

  private onEntityComponentRemoved(entity: Entity, componentSignatureIndex: number) {
    if (!this.$entitySignatures.has(entity)) {
      throw new Error(`Tried to update entity signature but entity was not found`);
    }
    this.$entitySignatures.set(entity, this.$entitySignatures.get(entity)! & ~(1 << componentSignatureIndex));
  }

  private onEntityCreated(entity: Entity) {
    this.$entitySignatures.set(entity, 0);
  }

  private onEntityDestroyed(entity: Entity) {
    this.$entitySignatures.delete(entity);
  }

  public static get instance() {
    if (!BehaviourManager.$instance) {
      BehaviourManager.$instance = new BehaviourManager();
    }
    return BehaviourManager.$instance;
  }
}
