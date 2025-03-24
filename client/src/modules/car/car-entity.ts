
import * as THREE from 'three';

import { CONFIG } from '../../config/config.js';
import { GizmoHelper } from '../../shared/util/gizmo-helper.js';
import { Scene } from '../../engine/scene.js';

export class Car {

    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    direction: THREE.Vector3 = new THREE.Vector3(0, 0, 0);  // unit vector
    velocity: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    acceleration: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

    longitudinalForce: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

    isThrottling: boolean;
    isBraking: boolean;

    group: THREE.Group;
    gizmos: {
        direction: THREE.Line
    };
    scene: Scene;

    constructor(scene: Scene) {
        this.gizmos = {
            direction: undefined
        };
        this.scene = scene;

        // set car in forward direction
        this.direction.set(0, 0, 1);
    }

    update(elapsedTime: number) {

        this.updatePhysics( elapsedTime );

        this.group.position.set(
            this.position.x,
            this.position.y, 
            this.position.z
        );

        this.updateDirectionGizmo();
    }

    updatePhysics(elapsedTime: number) {

        // https://asawicki.info/Mirror/Car%20Physics%20for%20Games/Car%20Physics%20for%20Games.html

        this.updateLongitudinalForce();

        this.acceleration = this.longitudinalForce.clone().multiplyScalar( 1 / CONFIG.CAR_MASS );

        this.velocity.add(
            this.acceleration.clone().multiplyScalar( elapsedTime )
        );

        this.position.add(
            this.velocity.clone().multiplyScalar( elapsedTime )
        );

    }

    updateLongitudinalForce() {

        let fTraction;
        if ( this.isBraking ) {
            fTraction = this.direction.clone().applyAxisAngle( 
                new THREE.Vector3( 0, 1, 0 ), 
                THREE.MathUtils.degToRad( 180 ) 
            ).multiplyScalar( CONFIG.BRAKING_FORCE );
        }
        else {
            fTraction = this.direction.clone().multiplyScalar(
                this.isThrottling ? CONFIG.ENGINE_FORCE : 0
            );
        }

        const fDrag = this.velocity.clone().multiplyScalar(
            -CONFIG.DRAG * this.velocity.length()
        );
        
        const fRollingResistance = this.velocity.clone().multiplyScalar(
            -CONFIG.ROLLING_RESISTANCE
        );

        this.longitudinalForce = fTraction.clone().add( fDrag ).add( fRollingResistance );
    }

    showDirectionGizmo() {

        const line = GizmoHelper.CreateVectorGizmo(this.position, this.direction);
        this.gizmos.direction = line;

        this.scene.scene.add( line );
    }

    updateDirectionGizmo() {

        if ( !this.gizmos.direction )
            return;

        const geometry = new THREE.BufferGeometry().setFromPoints([ 
            this.position, 
            new THREE.Vector3().addVectors( this.position, this.direction )
        ]);
        this.gizmos.direction.geometry = geometry;
    }

}