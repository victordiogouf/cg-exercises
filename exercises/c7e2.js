import * as THREE from 'three';
import { TeapotGeometry } from '../build/jsm/geometries/TeapotGeometry.js';
import {
  initRenderer,
  initDefaultSpotlight,
  createGroundPlaneXZ,
  onWindowResize
} from "../libs/util/util.js";

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
camera.position.set(5, 3, 4)
camera.lookAt(0, 0, 0)

const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 1, 4), new THREE.MeshPhongMaterial({ color: "#5ad", flatShading: true }));
cylinder.position.set(2, 0, 0)
cylinder.receiveShadow = true;
cylinder.castShadow = true;
scene.add(cylinder);

const teapot = new THREE.Mesh(new TeapotGeometry(0.45), new THREE.MeshPhongMaterial({ color: "#f00", shininess: 200, specular: "#777" }))
teapot.rotateY(0.7)
teapot.position.y = 0.5
teapot.receiveShadow = true;
teapot.castShadow = true;
scene.add(teapot)

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.45), new THREE.MeshLambertMaterial({ color: "#8da" }))
sphere.position.set(-2, 0.5, 0)
sphere.receiveShadow = true;
sphere.castShadow = true;
scene.add(sphere)

render();
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera) // Render scene
}