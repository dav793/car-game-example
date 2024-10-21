import { Engine } from './engine/engine.js';
import { Scene } from './engine/scene.js';
const engine = new Engine({
    container: document.getElementById('canvas-container'),
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio
});
const scene = new Scene(engine);
engine.setScene(scene);
scene.setupScene();
function startRenderLoop() {
    requestAnimationFrame(startRenderLoop);
    engine.renderFrame();
}
startRenderLoop();
window.addEventListener('resize', () => {
    engine.onResize(window.innerWidth, window.innerHeight);
});
//# sourceMappingURL=main.js.map