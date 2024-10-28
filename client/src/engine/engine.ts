import * as THREE from 'three';

import { EVENT_TYPE, EventManager } from './events/event.js';
import { Scene } from './scene.js';

export class Engine {

    eventManager: EventManager;
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

        this.eventManager = new EventManager();
        this.listenBrowserEvents();

        // como escuchar
        this.eventManager.on( EVENT_TYPE.THROTTLE ) 
            .subscribe(ev => {
                console.log(ev);
            });
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

    listenBrowserEvents() {

        window.addEventListener( 'keydown', event => {

            switch ( event.code ) {

                case 'KeyW':
                    // como emitir
                    this.eventManager.push(EVENT_TYPE.THROTTLE, {
                        isPressed: true
                    });
                    break;

                case 'KeyA':
                    break;

                case 'KeyS':
                    break;

                case 'KeyD':
                    break;
            }
        } );

        window.addEventListener( 'keyup', event => {

            switch ( event.code ) {

                case 'KeyW':
                    // como emitir
                    this.eventManager.push(EVENT_TYPE.THROTTLE, {
                        isPressed: false
                    });
                    break;

                case 'KeyA':
                    break;

                case 'KeyS':
                    break;

                case 'KeyD':
                    break;
            }
        } );

    }
}
