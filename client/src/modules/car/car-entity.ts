
import * as THREE from 'three';

import { CONFIG } from '../../config/config.js';
import { Util, GizmoHelper } from '../../shared/util/util.js';
import { Scene } from '../../engine/scene.js';

export class Car {

    static MaxWheelAngle = THREE.MathUtils.degToRad( CONFIG.MAX_STEER_ANGLE );

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
        direction: THREE.Line,
        wheelDirection: {
            L: THREE.Line,
            R: THREE.Line
        }
    };
    scene: Scene;

    constructor(scene: Scene) {
        this.gizmos = {
            direction: undefined,
            wheelDirection: undefined
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

        this.updateGizmos();
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

        // STEERING
        const wheelL = this.getWheelModel('FL');
        const steerAngle = wheelL.rotation.y;
        const speed = this.velocity.length();
        
        // const angularVelocity = this.isBraking ? -1 * 1 : speed * Math.sin(steerAngle) / CONFIG.WHEEL_BASE;
        const angularVelocity = speed * Math.sin(steerAngle) / CONFIG.WHEEL_BASE;
        const rotationDelta = angularVelocity * elapsedTime;

        // apply rotation onto car model
        this.group.rotateY(rotationDelta);

        // update direction to point in new car direction
        this.direction = Util.eulerToDirectionVector(
            this.group.rotation.x, 
            this.group.rotation.y, 
            this.group.rotation.z
        );

        // console.log(rotationDelta);
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
        this.updateFrontWheel('L', elapsedTime);
        this.updateFrontWheel('R', elapsedTime);
    }

    updateFrontWheel(side: 'L'|'R', elapsedTime: number) {

        const wheel = this.getWheelModel( `F${ side }` );
        const currentAngle = this.getSteerAngle(wheel.rotation, side);
        let rotationDelta: number;

        if ( this.isSteering ) {

            const sign = (this.steerDirection === 'left' ? 1 : -1);
            rotationDelta = CONFIG.STEER_RATE * elapsedTime * sign;

            const nextAngle = currentAngle + rotationDelta;
            if (Math.abs(nextAngle) > Car.MaxWheelAngle)    // do not exceed max steer angle
                return;
        }
        else {

            if (currentAngle === 0)
                return;

            const sign = (currentAngle > 0 ? -1 : 1);
            rotationDelta = Math.min( CONFIG.STEER_RATE * elapsedTime, Math.abs(currentAngle) ) * sign;
        }

        wheel.rotateY( rotationDelta );

//         const wheelAngle = this.getWheelSteerAngle( side );
//         console.log(`
// WHEEL ANGLE: ${ THREE.MathUtils.radToDeg( wheelAngle ).toFixed(2) }
// X: ${ THREE.MathUtils.radToDeg( wheel.rotation.x ).toFixed(2) }
// Y: ${ THREE.MathUtils.radToDeg( wheel.rotation.y ).toFixed(2) }
// Z: ${ THREE.MathUtils.radToDeg( wheel.rotation.z ).toFixed(2) }    
//         `);
    }

    getWheelSteerAngle(side: 'L'|'R'): number {
        const wheel = this.getWheelModel( `F${ side }` );
        return this.getSteerAngle(wheel.rotation, side);
    }

    /**
     * Convert the steer rotation of wheels to a range between -pi (-180 deg) and pi (180 deg) radians
     * 
     * @param rotation Wheel rotation
     * @param side Side of wheel
     * @returns The converted angle in the Y axis
     */
    getSteerAngle(rotation: THREE.Euler, side: 'L'|'R'): number {

        let wheelAngle = 0;
        if ( Math.abs( rotation.x ) === Math.PI ) {
            // Upper quadrants
            
            if ( rotation.y < 0 ) {
                // Left quadrant
                wheelAngle = -1 * (THREE.MathUtils.degToRad( 180 ) + rotation.y);
            }
            else {
                // Right quadrant
                wheelAngle = THREE.MathUtils.degToRad( 180 ) - rotation.y;
            }
        }
        else {
            // Lower quadrants
            wheelAngle = rotation.y;
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

    showGizmos() {
        this.showDirectionGizmo();
        this.showWheelDirectionGizmo();
    }

    updateGizmos() {
        this.updateDirectionGizmo();
        this.updateWheelDirectionGizmo();
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

    showWheelDirectionGizmo() {

        const wheelL = this.getWheelModel('FL');
        const lineL = GizmoHelper.CreateVectorGizmo(wheelL.position, this.position, 0x0000ff);

        const wheelR = this.getWheelModel('FR');
        const lineR = GizmoHelper.CreateVectorGizmo(wheelR.position, this.position, 0x0000ff);

        this.gizmos.wheelDirection = {
            L: lineL,
            R: lineR
        };

        this.scene.scene.add( lineL );
        this.scene.scene.add( lineR );
    }

    updateWheelDirectionGizmo() {

        const wheelL = this.getWheelModel('FL');
        const wheelLOrigin = this.position.clone().add( wheelL.position );
        const directionL = Util.eulerToDirectionVector( wheelL.rotation.x, wheelL.rotation.y, wheelL.rotation.z );  // directionL is a unit vector

        const geometryL = new THREE.BufferGeometry().setFromPoints([ 
            wheelLOrigin, 
            new THREE.Vector3().addVectors( wheelLOrigin, directionL )
        ]);
        this.gizmos.wheelDirection.L.geometry = geometryL;

        const wheelR = this.getWheelModel('FR');
        const wheelROrigin = this.position.clone().add( wheelR.position );
        const directionR = Util.eulerToDirectionVector( wheelR.rotation.x, wheelR.rotation.y, wheelR.rotation.z );  // directionR is a unit vector

        const geometryR = new THREE.BufferGeometry().setFromPoints([ 
            wheelROrigin, 
            new THREE.Vector3().addVectors( wheelROrigin, directionR.negate() )
        ]);
        this.gizmos.wheelDirection.R.geometry = geometryR;
    }
}