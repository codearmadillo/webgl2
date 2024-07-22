export function getWebGlContext() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const webgl = canvas.getContext('webgl2');

    if (webgl === null) {
        throw new Error('Failed to obtain WebGl2 context');
    }
    
    return webgl;
}