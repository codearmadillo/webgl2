import { mat4 } from "gl-matrix";
import { Shader } from "./shaders";
import {Camera, WebGlCamera} from "./camera.ts";

export interface WebGlRenderer {
    readonly webgl: WebGL2RenderingContext;
    readonly shader: Shader;
}

class Renderer implements WebGlRenderer {
    private $camera: WebGlCamera = new Camera();
    private $initialised = false;
    private $webgl: WebGL2RenderingContext | null = null;
    private $shader!: Shader;
    private $canvas!: HTMLCanvasElement | null;
    private $updateCallback!: (dt: number) => any;
    private $drawCallback!: () => any;
    private $frameTimestamp: number | null = null;
    private $interval = 1000 / 60;
    private $projection: mat4 = mat4.create();

    private $width!: number;
    private $height!: number;

    public get camera() {
        return this.$camera;
    }

    public get shader() {
        return this.$shader;
    }

    public get webgl() {
        if (!this.$webgl) {
            throw new Error('Tried obtaining WebGl context but WebGl is not available');
        }
        return this.$webgl;
    }

    attach(canvasHtmlSelector: string) {
        if (this.$initialised) {
            throw new Error('Renderer is already initialised');
        }

        this.$canvas = document.querySelector<HTMLCanvasElement>(canvasHtmlSelector);
        if (!this.$canvas) {
            throw new Error('Failed to obtain rendering canvas with id' + canvasHtmlSelector);
        }
        this.$width = this.$canvas.width;
        this.$height = this.$canvas.height;

        this.$webgl = this.$canvas.getContext('webgl2');
        if (!this.$webgl) {
            throw new Error('Failed to obtain webgl2 context');
        }

        this.$shader = new Shader(this.$webgl);
        mat4.perspective(this.$projection, 45 * Math.PI / 180, this.$width / this.$height, 0.1, 500.0);

        this.webgl.enable(this.webgl.BLEND);
        this.webgl.enable(this.webgl.DEPTH_TEST);
        this.webgl.blendFunc(this.webgl.SRC_ALPHA, this.webgl.ONE_MINUS_SRC_ALPHA);

        return this;
    }

    start() {
        this.webgl.useProgram(this.$shader.program);

        setInterval(() => {
            let delta = 0;
            if (this.$frameTimestamp !== null) {
                const now = new Date().getTime();
                delta = now - this.$frameTimestamp;
                this.$frameTimestamp = now;
            } else {
                this.$frameTimestamp = new Date().getTime();
            }

            if (this.$updateCallback) {
                this.$updateCallback(delta);
            }

            this.webgl.uniformMatrix4fv(this.$shader.uViewUniformLocation, false, this.$camera.view);
            this.webgl.uniformMatrix4fv(this.$shader.uProjectionUniformLocation, false, this.$projection);

            this.webgl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.webgl.clear(this.webgl.COLOR_BUFFER_BIT);

            if (this.$drawCallback) {
                this.$drawCallback();
            }
        }, this.$interval);
    }

    update(callback: (dt: number) => any) {
        this.$updateCallback = callback;
        return this;
    }

    draw(callback: () => any) {
        this.$drawCallback = callback;
        return this;
    }
}
export const renderer = new Renderer();
