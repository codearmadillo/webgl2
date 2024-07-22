export const vertexShaderSource = `#version 300 es
  
  layout (location = 0) in vec3 a_position;
  layout (location = 1) in vec3 a_color;
  
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
  private readonly $webgl: WebGL2RenderingContext;

  public get program() {
    return this.$program;
  }

  constructor(webgl: WebGL2RenderingContext) {
    this.$webgl = webgl;
    this.$program = webgl.createProgram();
    if (!this.$program) {
      throw new Error('Failed to create shader program');
    }

    const fragmentShader = this.createShader(webgl.FRAGMENT_SHADER);
    const vertexShader = this.createShader(webgl.VERTEX_SHADER);
    
    webgl.attachShader(this.$program, fragmentShader);
    webgl.attachShader(this.$program, vertexShader);

    webgl.linkProgram(this.$program);

    if (!webgl.getProgramParameter(this.$program, webgl.LINK_STATUS)) {
      const log = webgl.getProgramInfoLog(this.$program);
      throw new Error(`Failed to link shader program: ${log}`);
    }

    webgl.detachShader(this.$program, fragmentShader);
    webgl.detachShader(this.$program, vertexShader);

    webgl.deleteShader(fragmentShader);
    webgl.deleteShader(vertexShader);
  }

  private createShader(type: number): WebGLShader {
    const source = type === this.$webgl.FRAGMENT_SHADER ? fragmentShaderSource : vertexShaderSource;
    const shader = this.$webgl.createShader(type);
    if (!shader) {
      throw new Error(`Failed to create ${type === this.$webgl.FRAGMENT_SHADER ? 'fragment' : 'vertex'} shader`);
    }

    this.$webgl.shaderSource(shader, source);
    this.$webgl.compileShader(shader);

    if (!this.$webgl.getShaderParameter(shader, this.$webgl.COMPILE_STATUS)) {
      const log = this.$webgl.getShaderInfoLog(shader);
      throw new Error(`Failed to create ${type === this.$webgl.FRAGMENT_SHADER ? 'fragment' : 'vertex'} shader: ${log}`);
    }

    return shader;
  }
}