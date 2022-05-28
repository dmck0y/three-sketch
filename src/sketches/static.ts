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
  const geo = new THREE.PlaneGeometry(60, 40, 10);

  const vertexShader = /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform vec2 u_resolution;

    float random2d(vec2 co) {
      // float a = 12.9898;
      // float b = 78.233;
      // float c = 43758.5453;

      float a = 10.0;
      float b = 45.323;
      float c = 60.0;
      float dt = dot(co.xy, vec2(a, b));
      float sn = mod(dt, 3.14);

      return fract(sin(sn) * c);
    }

    void main () {
      vec2 square = floor(gl_FragCoord.xy / 5.5);
      vec3 square_color = vec3(random2d(square), random2d(1.234 * square), 1.0);

      gl_FragColor = vec4(square_color, 1.0);
    } 
  `;

  const mat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_resolution: { value: new THREE.Vector2() },
    },
  });

  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
}

createThree(settings, sketch);
