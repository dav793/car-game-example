
import { GLTFLoader, GLTF } from 'three/addons/loaders/GLTFLoader.js';

export class LoaderHelper {

    static async LoadGLTF(url: string): Promise<GLTF> {
    
        const loader = new GLTFLoader();
        const asset: GLTF = await loader.loadAsync( url );
        return asset;    
    }

}
