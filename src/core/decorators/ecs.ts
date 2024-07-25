import {Constructor} from "../types/common.ts";
import {generateUUIDv4} from "../utils/uuid.ts";
import {Metadata} from "../enums/metadata.ts";
import "reflect-metadata";
import {ComponentManager} from "../abstract/ecs/component-manager.ts";

export function Component() {
  return function (constructor: Constructor<T>) {
    console.log("component", ComponentManager.instance);
    Reflect.defineMetadata(Metadata.ComponentIdentifier, generateUUIDv4(), constructor.prototype);
  }
}

export function Behaviour(...components: Constructor<T>[]) {
  return function <T extends Constructor<T>>(behaviour: T) {
    return class extends behaviour {
      constructor(...args: any[]) {
        super(...args);
        const signature = components.reduce((acc, component) => {
          const index = ComponentManager.instance.getComponentSignatureIndex(component);
          return acc | (1 << index);
        }, 0);
        Reflect.defineMetadata(Metadata.SystemSignature, signature, behaviour.prototype);
      }
    }
  }
}
