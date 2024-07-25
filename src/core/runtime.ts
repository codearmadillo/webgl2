import {IBehaviourManager, IComponentManager, IEntityManager} from "./interfaces/ecs.ts";
import {EntityManager} from "./abstract/ecs/entity-manager.ts";
import {ComponentManager} from "./abstract/ecs/component-manager.ts";
import {TransformComponent} from "../presets/components/transform.ts";
import {Renderer2dComponent} from "../presets/components/renderer.ts";
import {Constructor} from "./types/common.ts";
import {Behaviour} from "./decorators/ecs.ts";
import {BehaviourManager} from "./abstract/ecs/behaviour-manager.ts";
import {Renderer2d} from "../presets/behaviours/renderer-2d.ts";

class Runtime {
  private readonly $behaviours: IBehaviourManager;
  private readonly $entities: IEntityManager;
  private readonly $components: IComponentManager;
  constructor() {
    this.$behaviours = BehaviourManager.instance;
    this.$entities = EntityManager.instance;
    this.$components = ComponentManager.instance;
    this.initialisePresets();
  }
  bootstrap(){
    // entity 0
    const enemy = this.$entities.create();

    // entity 1
    const player = this.$entities.create();
    this.$components.add(player, new TransformComponent());
    this.$components.add(player, new Renderer2dComponent());

    requestAnimationFrame(this.frame.bind(this));
  };
  private frame(time: number) {
    // calculate delta time
    this.$behaviours.frame(0);
    requestAnimationFrame(this.frame.bind(this));
  }
  private initialisePresets() {
    this.$components.register(TransformComponent);
    this.$components.register(Renderer2dComponent);

    this.$behaviours.register(Renderer2d);
  }
}
export const runtime = new Runtime();
