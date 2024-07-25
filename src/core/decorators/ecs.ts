import {Constructor} from "../types/common.ts";
import {generateUUIDv4} from "../utils/uuid.ts";
import {Metadata} from "../enums/metadata.ts";
import "reflect-metadata";

export function Component() {
  return function (constructor: Constructor<T>) {
    Reflect.defineMetadata(Metadata.ComponentIdentifier, generateUUIDv4(), constructor.prototype);
  }
}
