
import * as THREE from 'three';

import { LoaderHelper } from './loader-helper.js';
export { LoaderHelper };

import { GizmoHelper } from './gizmo-helper.js';
export { GizmoHelper };

class UtilClass {

    /**
     * Convert a rotation given in radians to a unit direction vector
     * 
     * @param xRad rotation angle in radians around x axis 
     * @param yRad rotation angle in radians around y axis
     * @param zRad rotation angle in radians around z axis
     * @param startDirection starting vector to rotate
     * @returns unit vector pointing in the direction after applying rotations
     */
    eulerToDirectionVector(xRad: number, yRad: number, zRad: number, startDirection: THREE.Vector3 = new THREE.Vector3(0, 0, 1)): THREE.Vector3 {

        // create euler rotation object and quaternion representations
        const euler = new THREE.Euler(xRad, yRad, zRad, 'XYZ');
        const quaternion = new THREE.Quaternion();
        quaternion.setFromEuler( euler );

        // apply the rotation to the base vector and then normalize it
        const direction = startDirection.clone().applyQuaternion( quaternion );
        direction.normalize();

        return direction;
    }

}
export const Util = new UtilClass();