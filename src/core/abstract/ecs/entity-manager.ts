import {IEntityManager} from "../../interfaces/ecs.ts";
import {EcsConfig} from "../../config/ecs.ts";
import {Entity, EntityManagerEvent} from "../../types/ecs.ts";
import {IEventDispatcher} from "../../interfaces/events.ts";
import {EventDispatcher} from "../events.ts";

export class EntityManager extends EventDispatcher<EntityManagerEvent> implements IEntityManager {
  private static $instance: EntityManager;

  private get $count() {
    return EcsConfig.MAX_ENTITIES - this.$stack.length;
  }
  private $stack: number[] = [];

  private constructor() {
    super();
    for (let i = 0; i < EcsConfig.MAX_ENTITIES; i++) {
      this.$stack.push(i);
    }
  }

  public create() {
    if (this.$stack.length === 0) {
      throw new Error('Max entities reached');
    }
    const entity = this.$stack.shift();
    this.dispatch('created', entity);
    return entity;
  }

  public destroy(entity: Entity) {
    this.$stack.push(entity);
    this.dispatch('destroyed', entity);
  }

  public static get instance() {
    if (!EntityManager.$instance) {
      EntityManager.$instance = new EntityManager();
    }
    return EntityManager.$instance;
  }
}
