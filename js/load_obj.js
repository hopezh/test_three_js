'use strict';

jsLibAdd = 'https://threejs.org/examples'

import * as THREE from 'https://threejs.org/build/three.module.js'; 

import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import Stats from "https://threejs.org/examples/jsm/libs/stats.module.js";
import { Rhino3dmLoader } from jsLibAdd + '/jsm/loaders/3DMLoader.js';
// import { OBJLoader2 }     from 'https://threejs.org/examples/jsm/loaders/OBJLoader2.js';
// import { GUI } from 'https://threejs.org/examples/jsm/libs/dat.gui.module.js';
// import { TrackballControls } from "https://threejs.org/examples/jsm/controls/TrackballControls.js";
// import { VertexNormalsHelper } from "https://threejs.org/examples/jsm/helpers/VertexNormalsHelper.js";

// import { MTLLoader } from "https://threejs.org/examples/jsm/loaders/MTLLoader.js";
// import { MtlObjBridge } from "https://threejs.org/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js";
// import { OBJLoader2Parallel } from "./jsm/loaders/OBJLoader2Parallel.js";
// import { LoadedMeshUserOverride } from "./jsm/loaders/obj2/shared/MeshReceiver.js";


// create scene
var scene = new THREE.Scene();

// add camera
var camera = new THREE.PerspectiveCamera(75, 
                                         window.innerWidth / window.innerHeight, 
                                         0.1, 
                                         1000);
camera.position.z = 20;                                     

// add light
const directionalLight = new THREE.DirectionalLight( 0xffffff );
directionalLight.position.set( 0, 0, 2 );
directionalLight.castShadow = true;
directionalLight.intensity = 2;
scene.add( directionalLight );                                    

// create renderer 
var renderer = new THREE.WebGLRenderer( { antialias: true } );

renderer.setSize(window.innerWidth, 
                 window.innerHeight); 

document.body.appendChild(renderer.domElement); 

// controls
var controls = new OrbitControls( camera, renderer.domElement );





//--- monitor change in window size
window.addEventListener( 
    'resize', 
    function()
        {
            var width  = window.innerWidth;
            var height = window.innerHeight;
            renderer.setSize( width, height ); 
            camera.aspect = width / height;
            camera.updateProjectionMatrix(); 
            render(); 
        }, 
        false
); 


//---- define update
var update = function(){
    // cube.rotation.x += 0.01; 
    // cube.rotation.y += 0.005; 
    // cube.position.x += 0.001;
}; 

//---- define render scene
var render = function(){
    renderer.render(scene, camera); 
};

//---- get status 
var stats = Stats();
document.body.appendChild(stats.dom);

//---- define animation -> update, render, repeat
var animate = function(){
    requestAnimationFrame(animate); 
    update();
    render();
    stats.update(); 
};

//---- run animation
animate();