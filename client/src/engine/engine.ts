import * as THREE from 'three';

import { Scene } from './scene.js';

export class Engine {

    renderer: THREE.WebGLRenderer;
    scene: Scene;

    get width() { return this.config.width; }
    get height() { return this.config.height; }

    constructor(private config: {
        container: HTMLElement,
        width: number,
        height: number,
        devicePixelRatio: number
    }) {
        
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });

        this.renderer.setPixelRatio( this.config.devicePixelRatio );
        this.renderer.setSize( this.config.width, this.config.height );

        this.config.container.appendChild( this.renderer.domElement );
    }

    setScene(scene: Scene) {
        this.scene = scene;
    }

    renderFrame() {
        if ( this.scene )
            this.scene.renderFrame();
    }

    onResize(width: number, height: number) {
        this.config.width = width;
        this.config.height = height;

        if ( this.scene )
            this.scene.onResize();

        this.renderer.setSize( width, height );
    }

}
