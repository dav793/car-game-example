import { Subject, BehaviorSubject, filter, withLatestFrom, map, tap, of, from } from 'rxjs';
import * as THREE from 'three';

import { EVENT_TYPE, EventManager } from './events/event.js';
import { Scene } from './scene.js';
import { WithLast } from '../shared/operators/with-last.js';

export class Engine {

    eventManager: EventManager;
    renderer: THREE.WebGLRenderer;
    scene: Scene;

    keyboardEvents$ = new Subject<{
        type: 'keydown' | 'keyup',
        payload: KeyboardEvent
    }>();

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
        this.listenKeyboardEvents();

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

    listenKeyboardEvents() {

        this.keyboardEvents$.pipe(
            filter( event => event.type === 'keyup' && event.payload.code === 'KeyW' )
        ).subscribe(event => {

            this.eventManager.push(EVENT_TYPE.THROTTLE, {
                isPressed: false
            });
        });

        this.keyboardEvents$.pipe(
            new WithLast().filter( event => event.payload.code === 'KeyW' ),
            filter(([event, last]) => {
                return  event.type === 'keydown' && 
                        (!last || last.type === 'keyup');
            })
        ).subscribe(event => {

            this.eventManager.push(EVENT_TYPE.THROTTLE, {
                isPressed: true
            });
        });
    }

    listenBrowserEvents() {

        window.addEventListener( 'keydown', event => {

            switch ( event.code ) {

                case 'KeyW':
                    // como emitir

                    this.keyboardEvents$.next({
                        type: 'keydown',
                        payload: event
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

                    this.keyboardEvents$.next({
                        type: 'keyup',
                        payload: event
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
