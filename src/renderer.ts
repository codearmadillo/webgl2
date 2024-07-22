import { mat4 } from "gl-matrix";
import { createDebugToolSpacing, createRangeDebugTool } from "./debug";
import { Shader } from "./shaders";

class Renderer {
    private $initialised = false;
    private $webgl: WebGL2RenderingContext | null = null;
    private $shader!: Shader;
    private $callback!: () => any;
    private $dirty = true;
    private $interval = 200;

    private $model: mat4 = mat4.create();
    private $view: mat4 = mat4.create();
    private $projection: mat4 = mat4.create();

    public get webgl() {
        if (!this.$webgl) {
            throw new Error('Tried obtaining WebGl context but WebGl is not available');
        }
        return this.$webgl;
    }

    init() {
        if (this.$initialised) {
            throw new Error('Renderer is already initialised');
        }
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.$webgl = canvas.getContext('webgl2');

        this.$shader = new Shader();


        this.webgl.enable(this.webgl.BLEND);
        this.webgl.blendFunc(this.webgl.SRC_ALPHA, this.webgl.ONE_MINUS_SRC_ALPHA);
    
        // Debug tools
        createRangeDebugTool('Model:Rotation X', 'model-rotation-x', 0, 0, 360, (...args) => this.onRangeDebugToolChanged(...args));
        createRangeDebugTool('Model:Rotation Y', 'model-rotation-y', 0, 0, 360, (...args) => this.onRangeDebugToolChanged(...args));
        createRangeDebugTool('Model:Rotation Z', 'model-rotation-z', 0, 0, 360, (...args) => this.onRangeDebugToolChanged(...args));

        createDebugToolSpacing();

        createRangeDebugTool('Model:Position X', 'model-position-x', 0, -1000, 1000, (...args) => this.onRangeDebugToolChanged(...args));
        createRangeDebugTool('Model:Position Y', 'model-position-y', 0, -1000, 1000, (...args) => this.onRangeDebugToolChanged(...args));
        createRangeDebugTool('Model:Position Z', 'model-position-z', 0, -1000, 1000, (...args) => this.onRangeDebugToolChanged(...args));

        return this;
    }

    start() {
        setInterval(() => {
            if (!this.$dirty) {
                return;
            }
            this.webgl.useProgram(this.$shader.program);

            this.webgl.uniformMatrix4fv(this.$shader.uModelUniformLocation, false, this.$model);
            this.webgl.uniformMatrix4fv(this.$shader.uViewUniformLocation, false, this.$view);
            this.webgl.uniformMatrix4fv(this.$shader.uProjectionUniformLocation, false, this.$projection);

            this.webgl.clearColor(0.0, 0.0, 0.0, 1.0);
            this.webgl.clear(this.webgl.COLOR_BUFFER_BIT);

            this.$callback();
            this.markAsPristine();

            console.log("rendering frame");
        }, this.$interval);
    }

    onRender(callback: () => any) {
        this.$callback = callback;
        return this;
    }

    private onRangeDebugToolChanged(value: number, scope: 'model' | 'view', modifier: 'position' | 'rotation', axis: 'x' | 'y' | 'z') {
        this.markAsDirty();
    }

    private markAsDirty() {
        this.$dirty = true;
    }

    private markAsPristine() {
        this.$dirty = false;
    }
}
export const renderer = new Renderer();