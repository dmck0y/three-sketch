import * as THREE from "three";
import { Scene } from "three";
import { mergeDeepRight } from 'ramda';

let scene, camera, renderer;

export enum CameraType {
  OrthographicCamera = 'Orthographic',
  PerspectiveCamera = 'Perspective'
}

export interface CameraSettings {
  fov: number;
  nearClip: number;
  farClip: number;
  aspect: number;
  cameraPosition: number[];
  cameraType: string;
}

export interface SketchSettings {
  width: number;
  height: number;
  color: string | number;
  antialias: boolean;
  cameraSettings: Partial<CameraSettings>;
}

export const defaultSettings: Partial<SketchSettings> = {
  width: 800,
  height: 400,
  antialias: true,
  cameraSettings: {
    fov: 50,
    nearClip: 1,
    farClip: 1000,
    cameraPosition: [0,0,50],
    cameraType: CameraType.PerspectiveCamera
  }
};

interface sketchArgs {
  THREE: any;
  scene: Scene;
}
type sketchCallback = (sketchArgs) => void;
export function createThree(settings: Partial<SketchSettings>, sketch: sketchCallback): void {
  const mergedSettings = mergeDeepRight(defaultSettings, settings);
  const {width, height, antialias, color} = mergedSettings;
  const {fov, nearClip, farClip, cameraPosition, cameraType } = mergedSettings.cameraSettings;

  renderer = new THREE.WebGLRenderer({ antialias });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  function main() {
    const aspectRatio = mergedSettings.cameraSettings.aspect ?? (width / height);
    const app = document.getElementById("app");
    const currCanvas = document.querySelector("canvas");

    if (currCanvas) {
      app.replaceChild(renderer.domElement, currCanvas);
    } else {
      app.appendChild(renderer.domElement);
    }
    
    scene = new THREE.Scene();
    camera = (cameraType === CameraType.OrthographicCamera)
              ? new THREE.OrthographicCamera(-1, 1, 1, -1, nearClip, farClip)
              : new THREE.PerspectiveCamera(fov, aspectRatio, nearClip, farClip);

    camera.position.set(...cameraPosition);

    window.addEventListener("resize", () => onWindowResize(width, height));
  }

  const seed = Math.random() * 100;
  console.log({ seed });

  let savedSeed;
  // savedSeed = 93.66940670932664;

  function onWindowResize(width, height) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

    render();
  }

  function render() {
    renderer.render(scene, camera);
  }

  Promise.resolve()
    .then(main)
    .then(() => sketch({THREE, scene}))
    .then(render);
};
