import { createThree, SketchSettings, CameraType  } from "../core/three-core";
const settings: Partial<SketchSettings> = {
  width: 600,
  height: 275,
  cameraSettings: {
    cameraType: CameraType.PerspectiveCamera,
    fov: 50,
    cameraPosition: [0, 0, 25],
    nearClip: 1,
    farClip: 500
  }
}

function sketch ({THREE, scene}) {
  const vertexShader = /* glsl */`
    varying vec2 v_uv;

    void main () {
      v_uv = uv,
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
    } 
  `
  const fragmentShader = /* glsl */`
    varying vec2 v_uv;

    float random (vec2 st) {
      const float a = 12.9898;
      const float b = 78.233;
      const float c = 43758.543123;
      return fract(sin(dot(st, vec2(a,b))) * c);
    }

    void main () {
      vec3 color = random(v_uv) * vec3(1.0);
      gl_FragColor = vec4(color, 1.0);
    }
  `

  const uniforms = {
    u_color: {value: new THREE.Color(0x0000FF)}
  }

  const geo = new THREE.PlaneGeometry(20, 20);
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader
  });
  const mesh = new THREE.Mesh(geo, mat);

  scene.add(mesh);
}

createThree(settings, sketch);
