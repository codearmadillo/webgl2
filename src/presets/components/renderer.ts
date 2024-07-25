import {Component} from "../../core/decorators/ecs.ts";

/**
 * This is a simple 2D renderer component test class to verify systems work as expected
 */
@Component()
export class Renderer2dComponent {
  constructor(data: Partial<Renderer2dComponent>) {
    Object.assign(this, data);
  }
}
