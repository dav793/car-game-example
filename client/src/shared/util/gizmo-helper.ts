
import * as THREE from 'three';

export class GizmoHelper {

    static CreateCoordinateGizmo(): THREE.Group {

        const group = new THREE.Group();
        const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
    
        const xMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const xMesh = new THREE.Mesh( geometry, xMaterial );
        xMesh.position.set( 5, 0, 0 );
        group.add( xMesh );
    
        const yMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const yMesh = new THREE.Mesh( geometry, yMaterial );
        yMesh.position.set( 0, 5, 0 );
        group.add( yMesh );
    
        const zMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const zMesh = new THREE.Mesh( geometry, zMaterial );
        zMesh.position.set( 0, 0, 5 );
        group.add( zMesh );

        return group;
    }

    // static CreateVectorGizmo(pos: THREE.Vector3, dir: THREE.Vector3): THREE.Line {
    static CreateVectorGizmo(start: THREE.Vector3, end: THREE.Vector3): THREE.Line {

        const points = [ start, end ];
        const geometry = new THREE.BufferGeometry().setFromPoints( points );

        const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );

        const line = new THREE.Line( geometry, material );

        line.renderOrder = 999
        material.depthTest = false 
        // UPDATED If you using some models with transparent materials
        // material.transparent = true

        return line;
    }

}
