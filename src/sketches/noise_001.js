import * as THREE from "three";
import { Noise } from "noisejs";

let scene, camera, renderer;

const width = 800;
const height = 400;
const COLOR = 0xcccccc;

function main() {
  const aspect = width / height;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  const app = document.getElementById("app");

  const currCanvas = document.querySelector("canvas");

  if (currCanvas) {
    app.replaceChild(renderer.domElement, currCanvas);
  } else {
    app.appendChild(renderer.domElement);
  }

  window.addEventListener("resize", onWindowResize);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(50, aspect, 1, 5000);
  camera.position.set(0, 0, 40);
}

const noise = new Noise();
const seed = Math.random() * 100;

console.log({ seed });
let savedSeed;
// savedSeed = 93.66940670932664;
noise.seed(savedSeed ?? seed);

function createObject() {
  const margin = 10;
  const count = 80;

  const mat = new THREE.MeshBasicMaterial({ color: COLOR });
  const geo = new THREE.SphereGeometry(0.15);

  const nScale = 25;
  const mScale = 30;
  for (let x = 0; x <= count; x++) {
    for (let y = 0; y <= count; y++) {
      const n = noise.simplex2(x / nScale, y / nScale);
      const m = noise.simplex2(x / mScale, y / mScale);

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.x = x - count / 2 + (n + m) / (n * m);
      mesh.position.y = y - count / 2 + (n + m) * (n * m);
      // mesh.position.x = x - count / 2 + (n + m) * n;
      // mesh.position.y = y - count / 2 + n + m;
      scene.add(mesh);
    }
  }
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

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
  .then(createObject)
  .then(render)
  .then(() => {
    console.log(scene);
  });
