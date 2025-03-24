import { Subject, BehaviorSubject, filter, withLatestFrom, map, tap, of, from } from 'rxjs';
import * as THREE from 'three';

import { EVENT_TYPE, EventManager, BaseEvent, DistinctEvent, EventType } from './events/event.js';
import { Scene } from './scene.js';
import { WithLast } from '../shared/operators/with-last.js';

export class Engine {

    clock: THREE.Clock;
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
        
        this.clock = new THREE.Clock();

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
        // this.eventManager.on( EVENT_TYPE.THROTTLE ) 
        //     .subscribe(ev => {
        //         console.log(ev);
        //     });
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

    registerKeyUpEvent(keycode: string, handler: () => void) {

        this.keyboardEvents$.pipe(
            filter( keyboardEvent => keyboardEvent.type === 'keyup' && keyboardEvent.payload.code === keycode )
        ).subscribe(keyboardEvent => handler());
    }

    registerKeyDownEvent(keycode: string, handler: () => void) {

        this.keyboardEvents$.pipe(
            new WithLast().filter( event => event.payload.code === keycode ),
            filter(([event, last]) => {
                return  event.type === 'keydown' && 
                        (!last || last.type === 'keyup');   // necesario para que no repita el evento al dejar presionado
            })
        ).subscribe(() => handler());
    }

    listenKeyboardEvents() {

        // W
        this.registerKeyUpEvent('KeyW', () => {
            this.eventManager.push(EVENT_TYPE.THROTTLE, {
                isPressed: false
            });
        });

        this.registerKeyDownEvent('KeyW', () => {
            this.eventManager.push(EVENT_TYPE.THROTTLE, {
                isPressed: true
            });
        });

        // S
        this.registerKeyUpEvent('KeyS', () => {
            this.eventManager.push(EVENT_TYPE.BRAKE, {
                isPressed: false
            });
        });

        this.registerKeyDownEvent('KeyS', () => {
            this.eventManager.push(EVENT_TYPE.BRAKE, {
                isPressed: true
            });
        });

        // A
        this.registerKeyUpEvent('KeyA', () => {
            this.eventManager.push(EVENT_TYPE.STEER, {
                direction: 'left',
                isPressed: false
            });
        });

        this.registerKeyDownEvent('KeyA', () => {
            this.eventManager.push(EVENT_TYPE.STEER, {
                direction: 'left',
                isPressed: true
            });
        });

        // D
        this.registerKeyUpEvent('KeyD', () => {
            this.eventManager.push(EVENT_TYPE.STEER, {
                direction: 'right',
                isPressed: false
            });
        });

        this.registerKeyDownEvent('KeyD', () => {
            this.eventManager.push(EVENT_TYPE.STEER, {
                direction: 'right',
                isPressed: true
            });
        });
    }

    listenBrowserEvents() {

        window.addEventListener( 'keydown', event => {

            this.keyboardEvents$.next({
                type: 'keydown',
                payload: event
            });
        } );

        window.addEventListener( 'keyup', event => {

            this.keyboardEvents$.next({
                type: 'keyup',
                payload: event
            });
        } );

    }
}
