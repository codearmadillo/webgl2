import {IBehaviour} from "../../interfaces/ecs.ts";
import {Entity} from "../../types/ecs.ts";

export class BehaviourScript implements IBehaviour {
  update(dt: number, entity: Entity) {
    console.log('running update for entity', entity);
  }
}
