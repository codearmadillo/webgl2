import {IComponentManager, IEntityManager} from "./interfaces/ecs.ts";
import {EntityManager} from "./abstract/ecs/entity-manager.ts";
import {ComponentManager} from "./abstract/ecs/component-manager.ts";
import {TransformComponent} from "../presets/components/transform.ts";

class Runtime {
  private readonly $entities: IEntityManager;
  private readonly $components: IComponentManager;
  constructor() {
    this.$entities = EntityManager.instance;
    this.$components = ComponentManager.instance;
    this.initialisePresets();
  }
  bootstrap(){
    const player = this.$entities.create();
    this.$components.add(player, new TransformComponent({
      position: [ 16, 16, 16 ]
    }));
    requestAnimationFrame(this.render.bind(this));
  };
  private render() {

    requestAnimationFrame(this.render.bind(this));
  }
  private initialisePresets() {
    this.$components.register(TransformComponent);
  }
}
export const runtime = new Runtime();
