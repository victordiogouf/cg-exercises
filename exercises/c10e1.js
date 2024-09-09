import * as THREE from 'three';
import KeyboardState from '../libs/util/KeyboardState.js'
import {
  initRenderer,
  initCamera,
  initDefaultSpotlight
} from "../libs/util/util.js";

const scene = new THREE.Scene();    // Create main scene
const renderer = initRenderer();    // View function in util/utils
const camera = initCamera(new THREE.Vector3(0, 0, 12)); // Init camera in this position
const light = initDefaultSpotlight(scene, new THREE.Vector3(0, 0, 5), 60); // Use default light
const loader = new THREE.TextureLoader();
const keyboard = new KeyboardState();

const boxGeometry = new THREE.BoxGeometry(5, 5, 0.5);
const boxMaterials = [
  createMaterial('../assets/textures/NormalMapping/crossSide.png'),//x+
  createMaterial('../assets/textures/NormalMapping/crossSide.png'),//x-
  createMaterial('../assets/textures/NormalMapping/crossTop.png'), //y+
  createMaterial('../assets/textures/NormalMapping/crossTop.png'), //y-
  createMaterial("../assets/textures/NormalMapping/cross.png", "../assets/textures/NormalMapping/crossNormal.png"), //z+
  createMaterial("../assets/textures/NormalMapping/cross.png", "../assets/textures/NormalMapping/crossNormal.png"), //z-
];
const box = new THREE.Mesh(boxGeometry, boxMaterials);
scene.add(box);

render();

function render() {
  renderer.render(scene, camera);
  keyboard.update();
  processInput();
  requestAnimationFrame(render);
}

function processInput() {
  const rotationSpeed = 0.001 * 1000 / 60; // 60fps

  if (keyboard.pressed('A')) {
    box.rotation.y -= rotationSpeed;
  }

  if (keyboard.pressed('D')) {
    box.rotation.y += rotationSpeed;
  }

  if (keyboard.pressed('W')) {
    box.rotation.x -= rotationSpeed;
  }

  if (keyboard.pressed('S')) {
    box.rotation.x += rotationSpeed;
  }
}

function createMaterial(mapFile, normalMapFile = null, repeatU = 1, repeatV = 1, offsetX = 0, offsetY = 0, color = 'rgb(255,255,255)') {
  let mat = new THREE.MeshPhongMaterial({
    map: loader.load(mapFile),
    normalMap: normalMapFile ? loader.load(normalMapFile) : null,
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

  return mat;
}