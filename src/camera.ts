import {vec3, mat4} from "gl-matrix";

export interface WebGlCamera {
  readonly view: mat4;
  rotate(angleInDegrees: number): void;
  translate(xyz: vec3): void;
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

  rotate(angleInDegrees: number) {
    mat4.rotateY(this.$view, this.$view, angleInDegrees * Math.PI / 180);
  }

  translate(xyz: vec3) {
    mat4.translate(this.$view, this.$view, xyz);
  }
}
