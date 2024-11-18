import { Subject, BehaviorSubject, filter, withLatestFrom, map, tap } from 'rxjs';
import * as THREE from 'three';

import { EVENT_TYPE, EventManager } from './events/event.js';
import { Scene } from './scene.js';

export class Engine {

    eventManager: EventManager;
    renderer: THREE.WebGLRenderer;
    scene: Scene;

    keyboardEvents$ = new Subject<{
        type: 'keydown' | 'keyup',
        payload: KeyboardEvent
    }>();
    latestKeyboardEvents$ = new BehaviorSubject<{
        type: 'keydown' | 'keyup',
        payload: KeyboardEvent
    }>( undefined );

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
            filter( event => event.type === 'keyup' )
        ).subscribe( event => this.latestKeyboardEvents$.next( event ) );

        this.keyboardEvents$.pipe(
            filter( event => event.type === 'keydown' && event.payload.code === 'KeyW' ),
            withLatestFrom(
                this.latestKeyboardEvents$.pipe(
                    filter( ev => !ev || ev.payload.code === 'KeyW' )
                )
            ),
            filter(([ source, last ]) => !last || last.type === 'keyup'),
            map(([ source, last ]) => source)
        ).subscribe(source => {

            this.latestKeyboardEvents$.next( source );

            this.eventManager.push(EVENT_TYPE.THROTTLE, {
                isPressed: true
            });
        });

        this.keyboardEvents$.pipe(
            filter( event => event.type === 'keyup' && event.payload.code === 'KeyW' )
        ).subscribe(event => {

            this.eventManager.push(EVENT_TYPE.THROTTLE, {
                isPressed: false
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
