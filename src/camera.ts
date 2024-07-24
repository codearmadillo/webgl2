import {vec3, mat4} from "gl-matrix";

export interface WebGlCamera {
  readonly view: mat4;
}

export class Camera implements WebGlCamera {
  private readonly $position: vec3 = vec3.clone([ 50, 20, 50 ]);
  private readonly $target: vec3 = vec3.clone([ 0, 0, 0 ]);
  private readonly $up: vec3 = vec3.clone([ 0, 1, 0 ]);
  private readonly $view: mat4 = mat4.create();

  public get view() {
    return this.$view;
  }

  constructor() {
    mat4.lookAt(this.$view, this.$position, this.$target, this.$up);
  }
}
