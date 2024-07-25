import {Behaviour} from "../../core/decorators/ecs.ts";
import {TransformComponent} from "../components/transform.ts";
import {Renderer2dComponent} from "../components/renderer.ts";
import {IBehaviour} from "../../core/interfaces/ecs.ts";
import {BehaviourScript} from "../../core/abstract/ecs/behaviour.ts";

@Behaviour(TransformComponent, Renderer2dComponent)
export class Renderer2d extends BehaviourScript implements IBehaviour { }
