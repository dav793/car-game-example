import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { Engine } from './engine.js';
import { GizmoHelper } from '../shared/util/util.js';
import { Car, CarBuilder } from '../modules/car/car.js';

export class Scene {

    scene: THREE.Scene;
    engine: Engine;
    camera: THREE.PerspectiveCamera;
    cameraControls: OrbitControls;
    directionalLight: THREE.DirectionalLight;
    ambientLight: THREE.AmbientLight;

    constructor(engine: Engine) {
        this.engine = engine;
        this.scene = new THREE.Scene();
    }

    renderFrame() {
        this.engine.renderer.render( this.scene, this.camera );
    }

    onResize() {
        this.camera.aspect = this.engine.width / this.engine.height;
        this.camera.updateProjectionMatrix();
    }

    async setupScene() {

        this.camera = new THREE.PerspectiveCamera(
            45, this.engine.width / this.engine.height, 0.1, 100
        );
        this.camera.position.set( 0, 2, 4 );
        this.camera.lookAt( 0, 0, 0 );
        this.scene.add( this.camera );
        
        this.cameraControls = new OrbitControls( this.camera, this.engine.renderer.domElement );

        this.directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
        this.directionalLight.position.set( 2, 10, 1 );
        this.directionalLight.lookAt( 0, 0, 0 );
        this.scene.add( this.directionalLight );

        this.ambientLight = new THREE.AmbientLight( 0xffffff, 1 );
        this.scene.add( this.ambientLight );

        const coordinateGizmo = GizmoHelper.CreateCoordinateGizmo();
        this.scene.add( coordinateGizmo );
        
        await this.loadCarModel();
    }
    
    async loadCarModel(): Promise<void> {

        const car: Car = await new CarBuilder( 'assets/models/car.glb' ).build();
        this.scene.add( car.group );

    }

}