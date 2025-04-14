
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
    isSteering: boolean;
    steerDirection: 'left'|'right';

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

        this.updateWheels( elapsedTime );
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

    updateWheels(elapsedTime: number) {
        this.updateFrontWheel('L');
        // this.updateFrontWheel('R');
    }

    updateFrontWheel(side: 'L'|'R') {

        const wheel = this.getWheelModel( `F${ side }` );

        if ( this.isSteering ) {
            
            const rotation = CONFIG.STEER_RATE * (this.steerDirection === 'left' ? 1 : -1); 
            wheel.rotateY( rotation );

        }
        else {

        }

        const wheelAngle = this.getWheelSteerAngle( side );
//         console.log(`
// WHEEL ANGLE: ${ THREE.MathUtils.radToDeg( wheelAngle ).toFixed(2) }
// X: ${ THREE.MathUtils.radToDeg( wheel.rotation.x ).toFixed(2) }
// Y: ${ THREE.MathUtils.radToDeg( wheel.rotation.y ).toFixed(2) }
// Z: ${ THREE.MathUtils.radToDeg( wheel.rotation.z ).toFixed(2) }    
//         `);
    }

    getWheelSteerAngle(side: 'L'|'R'): number {

        const wheel = this.getWheelModel( `F${ side }` );

        let wheelAngle = 0;
        if ( Math.abs( wheel.rotation.x ) === Math.PI ) {
            // Upper quadrants
            
            if ( wheel.rotation.y < 0 ) {
                // Left quadrant
                wheelAngle = -1 * (THREE.MathUtils.degToRad( 180 ) + wheel.rotation.y);
            }
            else {
                // Right quadrant
                wheelAngle = THREE.MathUtils.degToRad( 180 ) - wheel.rotation.y;
            }
        }
        else {
            // Lower quadrants
            wheelAngle = wheel.rotation.y;
        }

        if ( side === 'R' ) {
            if ( wheelAngle < 0 )
                wheelAngle += THREE.MathUtils.degToRad( 180 );
            else
                wheelAngle -= THREE.MathUtils.degToRad( 180 );
        }

        return wheelAngle;
    }

    getWheelModel(wheel: 'FL'|'FR'|'RL'|'RR'): THREE.Mesh {
        switch (wheel) {
            case 'FL':
                return this.group.children[3] as THREE.Mesh;
            case 'FR':
                return this.group.children[4] as THREE.Mesh;
            case 'RL':
                return this.group.children[1] as THREE.Mesh;
            case 'RR':
                return this.group.children[2] as THREE.Mesh;
        }
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