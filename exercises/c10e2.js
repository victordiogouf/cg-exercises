import * as THREE from 'three';
import { OrbitControls } from '../build/jsm/controls/OrbitControls.js';
import {
  initRenderer,
  initCamera,
  initDefaultSpotlight,
  createGroundPlaneXZ
} from "../libs/util/util.js";

const scene = new THREE.Scene();    // Create main scene
const renderer = initRenderer();    // View function in util/utils
const camera = initCamera(new THREE.Vector3(-10, 15, 10)); // Init camera in this position
const light = initDefaultSpotlight(scene, new THREE.Vector3(5, 15, 10), 250); // Use default light
const loader = new THREE.TextureLoader();
const controls = new OrbitControls(camera, renderer.domElement);
controls.target = new THREE.Vector3(0, 3, 0)
controls.enabled = true;

const sphereGeometry = new THREE.SphereGeometry(3, 64, 64);
const sphereMaterial = createMaterial(
  "../assets/textures/Displacement/rockWall.jpg",
  "../assets/textures/Displacement/rockWall_Normal.jpg",
  "../assets/textures/Displacement/rockWall_Height.jpg",
  4, 3);
sphereMaterial.displacementScale = 0.2;
sphereMaterial.metalness = 0;
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.y = 3;
sphere.castShadow = true;
scene.add(sphere);

const ground = createGroundPlaneXZ(25, 25);
ground.material = createMaterial("../assets/textures/floorWood.jpg");
ground.receiveShadow = true;
scene.add(ground);

render();

function render() {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(render);
}

function createMaterial(
  mapFile, normalMapFile = null, dispMapFile = null,
  repeatU = 1, repeatV = 1, offsetX = 0, offsetY = 0,
  color = 'rgb(255,255,255)') {
  let mat = new THREE.MeshStandardMaterial({
    map: loader.load(mapFile),
    normalMap: normalMapFile ? loader.load(normalMapFile) : null,
    displacementMap: dispMapFile ? loader.load(dispMapFile) : null,
    color: color
  });
  mat.map.colorSpace = THREE.SRGBColorSpace;
  mat.map.wrapS = mat.map.wrapT = THREE.RepeatWrapping;
  mat.map.minFilter = mat.map.magFilter = THREE.LinearFilter;
  mat.map.repeat.set(repeatU, repeatV);
  mat.map.offset.set(offsetX, offsetY);

  if (normalMapFile) {
    mat.normalMap.wrapS = mat.map.wrapS;
    mat.normalMap.wrapT = mat.map.wrapT;
    mat.normalMap.minFilter = mat.map.minFilter;
    mat.normalMap.magFilter = mat.map.magFilter;
    mat.normalMap.repeat.set(repeatU, repeatV);
    mat.normalMap.offset.set(offsetX, offsetY);
  }

  if (dispMapFile) {
    mat.displacementMap.wrapS = mat.map.wrapS;
    mat.displacementMap.wrapT = mat.map.wrapT;
    mat.displacementMap.minFilter = mat.map.minFilter;
    mat.displacementMap.magFilter = mat.map.magFilter;
    mat.displacementMap.repeat.set(repeatU, repeatV);
    mat.displacementMap.offset.set(offsetX, offsetY);
  }

  return mat;
}