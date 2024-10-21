import { Engine } from './engine/engine.js';
import { Scene } from './engine/scene.js';

const engine = new Engine({
    container: document.getElementById('canvas-container'),
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio
});
const scene = new Scene( engine );
engine.setScene( scene );
scene.setupScene();

function startRenderLoop() {
    requestAnimationFrame( startRenderLoop );
    engine.renderFrame();
}
startRenderLoop();

window.addEventListener('resize', () => {
    engine.onResize( window.innerWidth, window.innerHeight );
});




// create renderer
// const container = document.getElementById('canvas-container');
// const renderer = new THREE.WebGLRenderer({
//     alpha: true,
//     antialias: true
// });

// renderer.setPixelRatio( window.devicePixelRatio );
// renderer.setSize( window.innerWidth, window.innerHeight );

// container.appendChild( renderer.domElement );

// // create scene + scene objects
// const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(
//     45, window.innerWidth / window.innerHeight, 0.1, 100
// );
// camera.position.set( 0, 2, 4 );
// camera.lookAt( 0, 0, 0 );
// scene.add( camera );

// const controls = new OrbitControls( camera, renderer.domElement );

// const directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
// directionalLight.position.set( 2, 10, 1 );
// directionalLight.lookAt( 0, 0, 0 );
// scene.add( directionalLight );

// const ambientLight = new THREE.AmbientLight( 0xffffff, 1 ); // soft white light
// scene.add( ambientLight );

// createCoordinateGizmo();

// const car = await loadCarModel();
// scene.add( car );

// // render frames
// function animate() {
//     requestAnimationFrame( animate );
//     renderer.render( scene, camera );
// }
// animate();

// // listen screen dimension changes
// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();
//     renderer.setSize( window.innerWidth, window.innerHeight );
// });

// function createCoordinateGizmo() {

//     const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );

//     const xMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//     const xMesh = new THREE.Mesh( geometry, xMaterial );
//     xMesh.position.set( 5, 0, 0 );
//     scene.add( xMesh );

//     const yMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//     const yMesh = new THREE.Mesh( geometry, yMaterial );
//     yMesh.position.set( 0, 5, 0 );
//     scene.add( yMesh );

//     const zMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
//     const zMesh = new THREE.Mesh( geometry, zMaterial );
//     zMesh.position.set( 0, 0, 5 );
//     scene.add( zMesh );
// }

// async function loadGLTF(url: string): Promise<GLTF> {

//     const loader = new GLTFLoader();
//     const asset: GLTF = await loader.loadAsync( url );
//     return asset;    
// }

// async function loadCarModel(): Promise<THREE.Group> {

//     const gltf = await loadGLTF( 'assets/models/car.glb' );
//     const carGroup = new THREE.Group();
    
//     const carBodyMesh = gltf.scene.children[0].clone();
//     carGroup.add( carBodyMesh );
    
//     const carWheelFLMesh = gltf.scene.children[1].clone();
//     carWheelFLMesh.position.set( 
//         0.51452,
//         0.319039,
//         -0.81019
//     );
//     carGroup.add( carWheelFLMesh );

//     const carWheelFRMesh = gltf.scene.children[1].clone();
//     carWheelFRMesh.position.set( 
//         -0.51452,
//         0.319039,
//         -0.81019
//     );
//     carWheelFRMesh.rotateY( THREE.MathUtils.degToRad( 180 ) );
//     carGroup.add( carWheelFRMesh );

//     const carWheelRLMesh = gltf.scene.children[1].clone();
//     carWheelRLMesh.position.set( 
//         0.51452,
//         0.319039,
//         0.807314
//     );
//     carGroup.add( carWheelRLMesh );

//     const carWheelRRMesh = gltf.scene.children[1].clone();
//     carWheelRRMesh.position.set( 
//         -0.51452,
//         0.319039,
//         0.807314
//     );
//     carWheelRRMesh.rotateY( THREE.MathUtils.degToRad( 180 ) );
//     carGroup.add( carWheelRRMesh );

//     return carGroup;
// }