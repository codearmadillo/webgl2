import { renderer } from "./renderer";

export const vertexShaderSource = `#version 300 es
  
  layout (location = 0) in vec3 a_position;
  layout (location = 1) in vec3 a_color;
  layout (location = 2) in vec2 a_textCoord;
  layout (location = 3) in vec3 a_normal;
  
  out vec4 vertexColor;

  void main() {
    gl_Position = vec4(a_position, 1.0);
    vertexColor = vec4(a_color, 1.0);
  }
`;
export const fragmentShaderSource = `#version 300 es
  
  precision highp float;
  
  in vec4 vertexColor;
  out vec4 outColor;
  
  void main() {
    outColor = vertexColor;
  }
`;

export class Shader {
  private readonly $program: WebGLProgram | null;

  public get program() {
    return this.$program;
  }

  constructor() {
    this.$program = renderer.webgl.createProgram();
    if (!this.$program) {
      throw new Error('Failed to create shader program');
    }

    const fragmentShader = this.createShader(renderer.webgl.FRAGMENT_SHADER);
    const vertexShader = this.createShader(renderer.webgl.VERTEX_SHADER);
    
    renderer.webgl.attachShader(this.$program, fragmentShader);
    renderer.webgl.attachShader(this.$program, vertexShader);

    renderer.webgl.linkProgram(this.$program);

    if (!renderer.webgl.getProgramParameter(this.$program, renderer.webgl.LINK_STATUS)) {
      const log = renderer.webgl.getProgramInfoLog(this.$program);
      throw new Error(`Failed to link shader program: ${log}`);
    }

    renderer.webgl.detachShader(this.$program, fragmentShader);
    renderer.webgl.detachShader(this.$program, vertexShader);

    renderer.webgl.deleteShader(fragmentShader);
    renderer.webgl.deleteShader(vertexShader);
  }

  private createShader(type: number): WebGLShader {
    const source = type === renderer.webgl.FRAGMENT_SHADER ? fragmentShaderSource : vertexShaderSource;
    const shader = renderer.webgl.createShader(type);
    if (!shader) {
      throw new Error(`Failed to create ${type === renderer.webgl.FRAGMENT_SHADER ? 'fragment' : 'vertex'} shader`);
    }

    renderer.webgl.shaderSource(shader, source);
    renderer.webgl.compileShader(shader);

    if (!renderer.webgl.getShaderParameter(shader, renderer.webgl.COMPILE_STATUS)) {
      const log = renderer.webgl.getShaderInfoLog(shader);
      throw new Error(`Failed to create ${type === renderer.webgl.FRAGMENT_SHADER ? 'fragment' : 'vertex'} shader: ${log}`);
    }

    return shader;
  }
}