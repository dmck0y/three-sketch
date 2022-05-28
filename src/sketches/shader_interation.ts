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
    void main () {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
    } 
  `
  const fragmentShader = /* glsl */`
    uniform vec3 u_color;

    void main () {
      gl_FragColor = vec4(u_color, 1.0);
    }
  `

  const uniforms = {
    u_time: {value: 0.0},
    u_mouse: {value: {x: 0.0, y: 0.0}},
    u_resolution: {value: {x: 0.0, y: 0.0}},
    u_color: {value: new THREE.Color(0x0000FF)}
  }

  function move(e) {
    uniforms.u_mouse.value.x = (e.touches) ? e.touches[0].clientX : e.clientX;
    uniforms.u_mouse.value.y = (e.touches) ? e.touches[0].clientY : e.clientY;
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
