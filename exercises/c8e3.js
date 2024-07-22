import * as THREE from 'three';
import {
  initRenderer,
  initDefaultSpotlight,
  createGroundPlaneXZ,
  onWindowResize
} from "../libs/util/util.js";
import { CSG } from "../libs/other/CSGMesh.js";

let scene, renderer, light, camera, keyboard;
scene = new THREE.Scene();    // Create main scene
renderer = initRenderer("#000", THREE.PCFSoftShadowMap);    // View function in util/utils
light = initDefaultSpotlight(scene, new THREE.Vector3(6.0, 4.0, 0.7)); // Use default light    
light.shadow.mapSize.width = 4096;
light.shadow.mapSize.height = 4096;
window.addEventListener('resize', function () { onWindowResize(camera, renderer) }, false);

var groundPlane = createGroundPlaneXZ(10, 10, 40, 40); // width, height, resolutionW, resolutionH
groundPlane.receiveShadow = true;
scene.add(groundPlane);

camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 2.5, 4)
camera.lookAt(0, 0, 0)

const mat = new THREE.MeshPhongMaterial({ color: "#adf", shininess: 50, specular: "#fff" });
const bigCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 1.6), mat);
// scene.add(bigCylinder)
const smallCylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.4), mat);
smallCylinder.position.y = 0.2;
smallCylinder.updateMatrix();
// scene.add(smallCylinder)
const cup = CSG.toMesh(CSG.fromMesh(bigCylinder).subtract(CSG.fromMesh(smallCylinder)), new THREE.Matrix4(), mat);
scene.add(cup)
cup.position.y = 0.8;

const torus = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.12), mat);
// scene.add(torus);
const box = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.8), mat);
box.position.x = -0.9;
box.updateMatrix();
// scene.add(box)
const handle = CSG.toMesh(CSG.fromMesh(torus).subtract(CSG.fromMesh(box)), new THREE.Matrix4(), mat);
handle.position.x = 0.6;
handle.position.y = 0.8;
scene.add(handle)

render();
function render() {
  requestAnimationFrame(render);
  light.position.set(5 * Math.sin(Date.now() / 1500), (Math.sin(Date.now() / 3000) + 3), 5 * Math.cos(Date.now() / 1500));
  camera.lookAt(0, 0, 0)
  renderer.render(scene, camera) // Render scene
}