/**
 * Improvements:
 * - Rendering context is bound to a canvas
 * - It should be possible to create elements
 */

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
    private $callback!: () => any;
    private $dirty = true;
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
            this.webgl.uniformMatrix4fv(this.$shader.uViewUniformLocation, false, this.$camera.view);
            this.webgl.uniformMatrix4fv(this.$shader.uProjectionUniformLocation, false, this.$projection);

            this.webgl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.webgl.clear(this.webgl.COLOR_BUFFER_BIT);

            this.$callback();
        }, this.$interval);
    }

    frame(callback: () => any) {
        this.$callback = callback;
        return this;
    }

    markAsDirty() {
        this.$dirty = true;
    }

    private markAsPristine() {
        this.$dirty = false;
    }
}
export const renderer = new Renderer();
