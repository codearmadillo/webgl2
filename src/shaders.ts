export const vertexShaderSource = `#version 300 es
  
  layout (location = 0) in vec3 a_position;
  layout (location = 1) in vec3 a_color;
  layout (location = 2) in vec2 a_textCoord;
  layout (location = 3) in vec3 a_normal;

  uniform mat4 u_model;
  uniform mat4 u_view;
  uniform mat4 u_projection;
  
  out vec4 vertexColor;

  void main() {
    gl_Position = u_projection * u_view * u_model * vec4(a_position, 1.0);
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
    if (!this.$program) {
      throw new Error('Attempted to get program but it was not initialised');
    }
    return this.$program;
  }

  public get uModelUniformLocation() {
    return this.$webgl.getUniformLocation(this.program, 'u_model');
  }

  public get uViewUniformLocation() {
    return this.$webgl.getUniformLocation(this.program, 'u_view');
  }

  public get uProjectionUniformLocation() {
    return this.$webgl.getUniformLocation(this.program, 'u_projection');
  }

  constructor(webgl: WebGL2RenderingContext) {
    this.$webgl = webgl;

    this.$program = this.$webgl.createProgram();
    if (!this.$program) {
      throw new Error('Failed to create shader program');
    }

    const fragmentShader = this.createShader(this.$webgl.FRAGMENT_SHADER);
    const vertexShader = this.createShader(this.$webgl.VERTEX_SHADER);

    this.$webgl.attachShader(this.$program, fragmentShader);
    this.$webgl.attachShader(this.$program, vertexShader);

    this.$webgl.linkProgram(this.$program);

    if (!this.$webgl.getProgramParameter(this.$program, this.$webgl.LINK_STATUS)) {
      const log = this.$webgl.getProgramInfoLog(this.$program);
      throw new Error(`Failed to link shader program: ${log}`);
    }

    this.$webgl.detachShader(this.$program, fragmentShader);
    this.$webgl.detachShader(this.$program, vertexShader);

    this.$webgl.deleteShader(fragmentShader);
    this.$webgl.deleteShader(vertexShader);
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
