import * as THREE from 'three';
export class Engine {
    config;
    renderer;
    scene;
    get width() { return this.config.width; }
    get height() { return this.config.height; }
    constructor(config) {
        this.config = config;
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setPixelRatio(this.config.devicePixelRatio);
        this.renderer.setSize(this.config.width, this.config.height);
        this.config.container.appendChild(this.renderer.domElement);
    }
    setScene(scene) {
        this.scene = scene;
    }
    renderFrame() {
        if (this.scene)
            this.scene.renderFrame();
    }
    onResize(width, height) {
        this.config.width = width;
        this.config.height = height;
        if (this.scene)
            this.scene.onResize();
        this.renderer.setSize(width, height);
    }
}
//# sourceMappingURL=engine.js.map