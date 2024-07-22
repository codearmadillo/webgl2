import { ShaderType } from './types';

export const vertexShaderSource = `
  #version 300 es
  
  // an attribute is an input (in) to a vertex shader.
  // It will receive data from a buffer
  in vec4 a_position;
  
  // all shaders have a main function
  void main() {
    // gl_Position is a special variable a vertex shader
    // is responsible for setting
    gl_Position = a_position;
  }
`;
export const fragmentShaderSource = `
  #version 300 es
  
  // fragment shaders don't have a default precision so we need
  // to pick one. highp is a good default. It means "high precision"
  precision highp float;
  
  // we need to declare an output for the fragment shader
  out vec4 outColor;
  
  void main() {
    // Just set the output to a constant reddish-purple
    outColor = vec4(1, 0, 0.5, 1);
  }
`;

class Shader {
  private readonly type: ShaderType;
  constructor(type: ShaderType) {
    this.type = type;
    this.load();
  }
  private load() {
    const source =
      this.type === ShaderType.FRAGMENT
        ? fragmentShaderSource
        : vertexShaderSource;
  }
}

export class VertexShader extends Shader {
  constructor() {
    super(ShaderType.VERTEX);
  }
}
export class FragmentShader extends Shader {
  constructor() {
    super(ShaderType.FRAGMENT);
  }
}
