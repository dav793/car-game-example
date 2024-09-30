import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const container = document.getElementById('canvas-container');
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 2, 4);
camera.lookAt(0, 0, 0);
scene.add(camera);
const controls = new OrbitControls(camera, renderer.domElement);
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(2, 10, 1);
directionalLight.lookAt(0, 0, 0);
scene.add(directionalLight);
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial({ color: 0x4368e0 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
//# sourceMappingURL=main.js.map