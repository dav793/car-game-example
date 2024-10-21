import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
export class Scene {
    scene;
    engine;
    camera;
    cameraControls;
    directionalLight;
    ambientLight;
    constructor(engine) {
        this.engine = engine;
        this.scene = new THREE.Scene();
    }
    renderFrame() {
        this.engine.renderer.render(this.scene, this.camera);
    }
    onResize() {
        this.camera.aspect = this.engine.width / this.engine.height;
        this.camera.updateProjectionMatrix();
    }
    async setupScene() {
        this.camera = new THREE.PerspectiveCamera(45, this.engine.width / this.engine.height, 0.1, 100);
        this.camera.position.set(0, 2, 4);
        this.camera.lookAt(0, 0, 0);
        this.scene.add(this.camera);
        this.cameraControls = new OrbitControls(this.camera, this.engine.renderer.domElement);
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 3);
        this.directionalLight.position.set(2, 10, 1);
        this.directionalLight.lookAt(0, 0, 0);
        this.scene.add(this.directionalLight);
        this.ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(this.ambientLight);
        this.createCoordinateGizmo();
        const car = await this.loadCarModel();
        this.scene.add(car);
    }
    createCoordinateGizmo() {
        const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        const xMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const xMesh = new THREE.Mesh(geometry, xMaterial);
        xMesh.position.set(5, 0, 0);
        this.scene.add(xMesh);
        const yMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const yMesh = new THREE.Mesh(geometry, yMaterial);
        yMesh.position.set(0, 5, 0);
        this.scene.add(yMesh);
        const zMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        const zMesh = new THREE.Mesh(geometry, zMaterial);
        zMesh.position.set(0, 0, 5);
        this.scene.add(zMesh);
    }
    async loadGLTF(url) {
        const loader = new GLTFLoader();
        const asset = await loader.loadAsync(url);
        return asset;
    }
    async loadCarModel() {
        const gltf = await this.loadGLTF('assets/models/car.glb');
        const carGroup = new THREE.Group();
        const carBodyMesh = gltf.scene.children[0].clone();
        carGroup.add(carBodyMesh);
        const carWheelFLMesh = gltf.scene.children[1].clone();
        carWheelFLMesh.position.set(0.51452, 0.319039, -0.81019);
        carGroup.add(carWheelFLMesh);
        const carWheelFRMesh = gltf.scene.children[1].clone();
        carWheelFRMesh.position.set(-0.51452, 0.319039, -0.81019);
        carWheelFRMesh.rotateY(THREE.MathUtils.degToRad(180));
        carGroup.add(carWheelFRMesh);
        const carWheelRLMesh = gltf.scene.children[1].clone();
        carWheelRLMesh.position.set(0.51452, 0.319039, 0.807314);
        carGroup.add(carWheelRLMesh);
        const carWheelRRMesh = gltf.scene.children[1].clone();
        carWheelRRMesh.position.set(-0.51452, 0.319039, 0.807314);
        carWheelRRMesh.rotateY(THREE.MathUtils.degToRad(180));
        carGroup.add(carWheelRRMesh);
        return carGroup;
    }
}
//# sourceMappingURL=scene.js.map