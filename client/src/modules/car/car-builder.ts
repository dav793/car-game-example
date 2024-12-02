
import * as THREE from 'three';
import { GLTF } from 'three/addons/loaders/GLTFLoader.js';

import { LoaderHelper } from '../../shared/util/loader-helper.js';
import { Car } from './car.js';
import { Scene } from '../../engine/scene.js';

export class CarBuilder {

    private car: Car;
    private gltf: GLTF;
    private scene: Scene;

    constructor(private modelUrl: string, scene: Scene) {
        this.scene = scene;
    }

    async build(): Promise<Car> {

        this.car = new Car( this.scene );

        ( await this.loadGLTF( this.modelUrl ) )
            .createModel();

        return this.car;
    }

    async loadGLTF(modelUrl: string): Promise<CarBuilder> {

        this.gltf = await LoaderHelper.LoadGLTF( modelUrl );

        return this;
    }

    createModel(): CarBuilder {

        this.car.group = new THREE.Group();

        const carBodyMesh = this.gltf.scene.children[0].clone();
        this.car.group.add( carBodyMesh );
        
        const carWheelFLMesh = this.gltf.scene.children[1].clone();
        carWheelFLMesh.position.set( 
            0.51452,
            0.319039,
            -0.81019
        );
        this.car.group.add( carWheelFLMesh );
    
        const carWheelFRMesh = this.gltf.scene.children[1].clone();
        carWheelFRMesh.position.set( 
            -0.51452,
            0.319039,
            -0.81019
        );
        carWheelFRMesh.rotateY( THREE.MathUtils.degToRad( 180 ) );
        this.car.group.add( carWheelFRMesh );
    
        const carWheelRLMesh = this.gltf.scene.children[1].clone();
        carWheelRLMesh.position.set( 
            0.51452,
            0.319039,
            0.807314
        );
        this.car.group.add( carWheelRLMesh );
    
        const carWheelRRMesh = this.gltf.scene.children[1].clone();
        carWheelRRMesh.position.set( 
            -0.51452,
            0.319039,
            0.807314
        );
        carWheelRRMesh.rotateY( THREE.MathUtils.degToRad( 180 ) );
        this.car.group.add( carWheelRRMesh );

        return this;
    }

}
