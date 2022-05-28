import * as THREE from "three";

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

  // window.addEventListener("resize", onWindowResize);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(50, aspect, 1, 5000);
  camera.position.set(0, 0, 50);
}

const seed = Math.random() * 100;
console.log({ seed });

let savedSeed;
// savedSeed = 93.66940670932664;

function createObject() {
  const geo = new THREE.PlaneGeometry(30, 30, 10);

  const vertexShader = /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    varying vec2 vUv;
    uniform vec3 color;
    uniform vec2 u_resolution;

    void main () {
      float d = vUv.x;
      vec2 st = gl_FragCoord.xy/u_resolution.xy;

      gl_FragColor = vec4(st.x, st.y, 0.0, 1.0);
    } 
  `;

  const mat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_resolution: { type: "v2", value: new THREE.Vector2() },
      color: {
        value: new THREE.Color("tomato"),
      },
    },
  });

  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
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
