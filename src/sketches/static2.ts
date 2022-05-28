import { createThree, SketchSettings, CameraType  } from "../core/three-core";

const settings: Partial<SketchSettings> = {
  width: 600,
  height: 275,
  cameraSettings: {
    cameraType: CameraType.PerspectiveCamera,
    fov: 50,
    cameraPosition: [0, 0, 50],
    nearClip: 1,
    farClip: 1000
  }
};

function sketch({THREE, scene}) {
  const { lerp, mapLinear } = THREE.Math;

  const vertexShader = /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform vec2 u_resolution;

    float random1d(float dt) {
      float c = 43758.5453;
      float sn = mod(dt, 3.14);

      return fract(sin(sn) * c);
    }

    float random2d(vec2 co) {
      float a = 12.9898;
      float b = 78.233;
      float c = 43758.5453;

      float dt = dot(co.xy, vec2(a, b));
      float sn = mod(dt, 3.14);

      return fract(sin(sn) * c);
    }

    float noise1d(float value) {
      float i = floor(value);
      float f = fract(value);

      return mix(random1d(i), random1d(i), smoothstep(0.0, 1.0, f));
    }

    void main () {
      vec2 square = floor(gl_FragCoord.xy / .05);
      float strength = (0.3 + 0.7 * noise1d(0.3)) / u_resolution.x;
      vec3 pixel_color = vec3(random2d(square * square) * 4.0);

      gl_FragColor = vec4(pixel_color, 0.20);
    } 
  `;

  const mat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_resolution: { value: new THREE.Vector2() },
    },
  });
  const {width, height} = settings
  mat.transparent = true;

  let count = 0;
  while (count < 10) {
    const r = Math.random() * count / Math.random() * 10.0;

    const geo = new THREE.BoxGeometry(Math.random() * r, Math.random() * r, r);

    const mesh = new THREE.Mesh(geo, mat);
    const x = mapLinear(r, 0, 90, -width * .125, width * .125) * .125;

    mesh.position.x = x;
    mesh.position.z = 1.0;

    mesh.rotation.z = x;

    scene.add(mesh);

    count++;
  }
}

createThree(settings, sketch);
