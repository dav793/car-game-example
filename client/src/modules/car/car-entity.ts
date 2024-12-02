
import * as THREE from 'three';

import { CONFIG } from '../../config/config.js';
import { GizmoHelper } from '../../shared/util/gizmo-helper.js';
import { Scene } from '../../engine/scene.js';

export class Car {

    position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    direction: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    acceleration: number = 0;
    velocity: number = 0;

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

        if ( this.isThrottling ) {
            const accelDelta = CONFIG.DELTA_ACCELERATION * elapsedTime;

            if ( this.acceleration + accelDelta <= CONFIG.MAX_ACCELERATION )
                this.acceleration += accelDelta;
        }
        else {
            const accelDelta = CONFIG.DRAG * elapsedTime;

            if ( this.acceleration - accelDelta >= -CONFIG.MAX_ACCELERATION )
                this.acceleration -= accelDelta;
            else
                this.acceleration = -CONFIG.MAX_ACCELERATION;
        }

        const velDelta = this.acceleration * elapsedTime;
        if ( 
            this.velocity + velDelta <= CONFIG.MAX_VELOCITY &&
            this.velocity + velDelta >= -CONFIG.MAX_VELOCITY
        )
            this.velocity += velDelta;

        const deltaPosition = new THREE.Vector3(
            this.direction.x,
            this.direction.y, 
            this.direction.z
        ).multiplyScalar( this.velocity );

        this.position.set(
            this.position.x + deltaPosition.x,
            this.position.y + deltaPosition.y,
            this.position.z + deltaPosition.z
        );
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