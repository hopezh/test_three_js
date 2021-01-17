// import libraries
import * as THREE from 'https://threejs.org/build/three.module.js';

import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'https://threejs.org/examples/jsm/controls/TransformControls.js';

import { Rhino3dmLoader } from 'https://threejs.org/examples/jsm/loaders/3DMLoader.js';

import { GUI } from 'https://threejs.org/examples/jsm/libs/dat.gui.module.js';

import { MTLLoader } from "https://threejs.org/examples/jsm/loaders/MTLLoader.js";
import { MtlObjBridge } from "https://threejs.org/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js";
import { OBJLoader2 } from "https://threejs.org/examples/jsm/loaders/OBJLoader2.js";
import { OBJLoader2Parallel } from "https://threejs.org/examples/jsm/loaders/OBJLoader2Parallel.js";
import { LoadedMeshUserOverride } from "https://threejs.org/examples/jsm/loaders/obj2/shared/MeshReceiver.js";

// init variables
let cameraPersp, cameraOrtho, currentCamera;
let scene, renderer, control, orbit;
let raycaster;
let gui; 
let context_mesh; 
let INTERSECTED; 
const mouse = new THREE.Vector2();

// init & render
init();
render();

// functions 
function init() {

    // add raycaster
    // raycaster = new THREE.Raycaster();

// create renderer	
    renderer = new THREE.WebGLRenderer( { antialiasing: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

// create camera
    const aspect = window.innerWidth / window.innerHeight;

    cameraPersp = new THREE.PerspectiveCamera( 50, aspect, 0.01, 30000 );
    cameraOrtho = new THREE.OrthographicCamera( - 600 * aspect, 600 * aspect, 600, - 600, 0.01, 30000 );
    currentCamera = cameraPersp;

    currentCamera.position.set( 200, 200, 200 );
    currentCamera.lookAt( 0, 0, 0 );

// create scene	
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x222222 );
    
    const gridHelper = new THREE.GridHelper( 200, 20, 0x888888, 0x444444 ); 
    gridHelper.position.y = -27.648109;
    scene.add( gridHelper );
    
    const axesHelper = new THREE.AxesHelper( 50 );
    axesHelper.position.x = -110; 
    axesHelper.position.y = -27.648109; 
    axesHelper.position.z = -110; 
    scene.add( axesHelper );

// add light
    // directional light
    const light1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light1.position.set( -1000, 1000, 1000 );
    scene.add( light1 );

    const light2 = new THREE.DirectionalLight( 0xffffff, 0.3 );
    light1.position.set( 1000, 1000, -1000 );
    scene.add( light2 );

    // ambient light
    scene.add( new THREE.AmbientLight( 0xffffff, 0.5 ) );

    // add texture
    // const texture = new THREE.TextureLoader().load( './textures/crate.gif', render );
    // texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // add boxbuffer and mesh material 
    // const geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );
    // const material = new THREE.MeshLambertMaterial( { map: texture, transparent: true } );

// create mesh mat 
    const meshMaterial_b = new THREE.MeshLambertMaterial( {
        color: 0xFFFFFF,
        opacity: 1.0,
        transparent: false, 
        wireframe: false, 
        } );

    const meshMaterial_c = new THREE.MeshLambertMaterial( {
        color: 0x808080,
        opacity: 1.0,
        transparent: false, 
        wireframe: false, 
        } );

    const meshMaterial_pv = new THREE.MeshLambertMaterial( {
        color: 0x0000ff,
        opacity: 1.0,
        transparent: false, 
        wireframe: false, 
        } );

    const meshMaterial_sun = new THREE.MeshLambertMaterial( {
        color: 0xffff00,
        opacity: 1.0,
        transparent: false, 
        wireframe: false, 
        } );    

    const line_mat = new THREE.LineBasicMaterial( {
        color: 0xffffff,
        linewidth: 10,
        // linecap: 'round', //ignored by WebGLRenderer
        // linejoin:  'round' //ignored by WebGLRenderer
        } );

// orbit control
    orbit = new OrbitControls( currentCamera, renderer.domElement );
    orbit.update();
    orbit.addEventListener( 'change', render ); 

    control = new TransformControls( currentCamera, renderer.domElement );
    control.addEventListener( 'change', render );
    control.addEventListener( 'dragging-changed', 
                                function ( event ) {
                                    orbit.enabled = ! event.value;
                                } );

    // add mesh 
    // const mesh = new THREE.Mesh( geometry, material );
    // const mesh = new THREE.Mesh( geometry, meshMaterial ); // add mesh mat
    // scene.add( mesh );

// load 3dm files
    const loader = new Rhino3dmLoader(); 
    loader.setLibraryPath( '/jsm/libs/rhino3dm/' ); 

    // loader.load('./models/building.3dm', 
    //             function ( object ) {
    //                 object.traverse ( 
    //                     function( child ) { 
    //                         if ( child instanceof THREE.Mesh ) { 
    //                             child.material = meshMaterial_b; 
    //                         } 
    //                     } 
    //                 ); 
    //                 scene.add( object );
    //                 // control.attach( object ); 
    //                 // scene.add( control ); 
    //             } );	

    // loader.load('./models/context.3dm', 
    //             function ( object ) {
    //                 object.traverse ( 
    //                     function( child ) { 
    //                         if ( child instanceof THREE.Mesh ) { 
    //                             child.material = meshMaterial_c; 
    //                         } 
    //                     } 
    //                 ); 
    //                 scene.add( object );
    //             } );	

    // // test 
    // loader.load('./models/context.3dm', 
    //             function ( object ) {
    //                 object.traverse ( 
    //                     function( child ) { 
    //                         if ( child instanceof THREE.Mesh ) { 
    //                             context_mesh = new THREE.Mesh(child.geometry, meshMaterial_c);
    //                             // child.material = meshMaterial_c; 
    //                         } 
    //                     } ); 
    //                 // scene.add( object );
    //                 scene.add( context_mesh );
    //             } );	

    // loader.load('./models/pv.3dm', 
    //             function ( object ) {
    //                 object.traverse ( 
    //                     function( child ) { 
    //                         if ( child instanceof THREE.Mesh ) { 
    //                             child.material = meshMaterial_pv; } 
    //                 } ); 
    //                 scene.add( object );
    //             });	

    // loader.load('./models/result.3dm', 
    // 			function ( object ) {
    //                 object.traverse ( 
    //                     function( child ) { 
    //                         if ( child instanceof THREE.Mesh ) { 
    //                             child.material = meshMaterial; 
    //                         } 
    //                     } 
    //                 ); 
    //                 scene.add( object );
    //             }
    // );	
             
    // loader.load('./models/sunpath.3dm', 
    //         function ( object ) {
    //             object.traverse ( 
    //                 function( child ) { 
    //                     if ( child instanceof THREE.Line ) { 
    //                         child.material = line_mat; } 
    //             } ); 
    //             scene.add( object );
    //         });		

    // loader.load('./models/terra.3dm', 
    //         function ( object ) {
    //             object.traverse ( 
    //                 function( child ) { 
    //                     if ( child instanceof THREE.Mesh ) { 
    //                         child.material = meshMaterial_b; } 
    //             } ); 
    //             scene.add( object );
    //         });	

//load terra simplified model 

    loader.load('./models/terra_simplified.3dm', 
                function ( object ) {
                    object.traverse ( 
                        function( child ) { 
                            if ( child instanceof THREE.Mesh ) { 
                                child.material = meshMaterial_b; 
                            } 
                        } 
                    ); 
                    scene.add( object );
                } );	

    // loader.load('./models/terra_pv.3dm', 
    //             function ( object ) {
    //                 object.traverse ( 
    //                     function( child ) { 
    //                         if ( child instanceof THREE.Mesh ) { 
    //                             child.geometry.translate(0, 0.1, 0); 
    //                             child.material = meshMaterial_pv; 
    //                         } 
    //                     } 
    //                 ); 
    //                 scene.add( object );
    //             } );

    // loader.load('./models/terra_result.3dm', 
    //             function ( object ) {
    //                 object.traverse ( 
    //                     function( child ) { 
    //                         if ( child instanceof THREE.Mesh ) { 
    //                             child.geometry.translate(0, 0.1, 0); 
    //                             // child.material = meshMaterial_pv; 
    //                         } 
    //                     } 
    //                 ); 
    //                 scene.add( object );
    //             } );            

    // loader.load('./models/terra_sunpath.3dm', 
    //             function ( object ) {
    //                 object.traverse ( 
    //                     function( child ) { 
    //                         if ( child instanceof THREE.Line ) { 
    //                             child.material = line_mat; } 
    //                 } ); 
    //                 scene.add( object );
    //             });	

    // loader.load('./models/terra_sun.3dm', 
    //             function ( object ) {
    //                 object.traverse ( 
    //                     function( child ) { 
    //                         if ( child instanceof THREE.Mesh ) { 
    //                             child.material = meshMaterial_sun; 
    //                             // child.material.side = THREE.DoubleSide; 
    //                         } 
    //                 } ); 
    //                 scene.add( object );
    //             });	
                
    // loader.load('./models/terra_num.3dm', 
    //             function ( object ) {
    //                 object.traverse ( 
    //                     function( child ) { 
    //                         if ( child instanceof THREE.Mesh ) { 
    //                             child.material = meshMaterial_b; 
    //                             child.material.side = THREE.DoubleSide; 
    //                         } 
    //                 } ); 
    //                 scene.add( object );
    //             });	

// // load obj file 
//     const objName = 'terra';

//     const objLoader2 = new OBJLoader2();

//     const callbackOnLoad = function ( object3d ) {
//         object3d.rotateX(-0.5*Math.PI);
//         scene.add( object3d );
//     };

//     const onLoadMtl = function ( mtlParseResult ) {
//         objLoader2.setModelName( objName );
//         objLoader2.setLogging( true, true );
//         objLoader2.addMaterials( MtlObjBridge.addMaterialsFromMtlLoader( mtlParseResult ), true );
//         objLoader2.load( './models/terra_obj/texture.obj', callbackOnLoad, null, null, null );
//     };

//     const mtlLoader = new MTLLoader();
//     mtlLoader.load( './models/terra_obj/texture.mtl', onLoadMtl );        



// add event listener
    window.addEventListener( 'resize', onWindowResize, false );

    window.addEventListener( 'keydown', function ( event ) {
        switch ( event.keyCode ) {
            case 81: // Q
                control.setSpace( control.space === "local" ? "world" : "local" );
                break;

            case 16: // Shift
                control.setTranslationSnap( 100 );
                control.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
                control.setScaleSnap( 0.25 );
                break;

            case 87: // W
                control.setMode( "translate" );
                break;

            case 69: // E
                control.setMode( "rotate" );
                break;

            case 82: // R
                control.setMode( "scale" );
                break;

            case 67: // C
                const position = currentCamera.position.clone();

                currentCamera = currentCamera.isPerspectiveCamera ? cameraOrtho : cameraPersp;
                currentCamera.position.copy( position );

                orbit.object = currentCamera;
                control.camera = currentCamera;

                currentCamera.lookAt( orbit.target.x, orbit.target.y, orbit.target.z );
                onWindowResize();
                break;

            case 86: // V
                const randomFoV = Math.random() + 0.1;
                const randomZoom = Math.random() + 0.1;

                cameraPersp.fov = randomFoV * 160;
                cameraOrtho.bottom = - randomFoV * 500;
                cameraOrtho.top = randomFoV * 500;

                cameraPersp.zoom = randomZoom * 5;
                cameraOrtho.zoom = randomZoom * 5;
                onWindowResize();
                break;

            case 187:
            case 107: // +, =, num+
                control.setSize( control.size + 0.1 );
                break;

            case 189:
            case 109: // -, _, num-
                control.setSize( Math.max( control.size - 0.1, 0.1 ) );
                break;

            case 88: // X
                control.showX = ! control.showX;
                break;

            case 89: // Y
                control.showY = ! control.showY;
                break;

            case 90: // Z
                control.showZ = ! control.showZ;
                break;

            case 32: // Spacebar
                control.enabled = ! control.enabled;
                break;

        }

    } );

    window.addEventListener( 'keyup', function ( event ) {
        switch ( event.keyCode ) {
            case 16: // Shift
                control.setTranslationSnap( null );
                control.setRotationSnap( null );
                control.setScaleSnap( null );
                break;
        }
    } );

    // document.addEventListener( 'mousemove', onDocumentMouseMove, false );

// init gui
    initGUI();

}

function onWindowResize() {

    const aspect = window.innerWidth / window.innerHeight;

    cameraPersp.aspect = aspect;
    cameraPersp.updateProjectionMatrix();

    cameraOrtho.left = cameraOrtho.bottom * aspect;
    cameraOrtho.right = cameraOrtho.top * aspect;
    cameraOrtho.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    render();

}

function render() {
    
    // // find intersectoin 
    // currentCamera.updateMatrixWorld();

    // raycaster.setFromCamera( mouse, currentCamera );

    // const intersects = raycaster.intersectObjects( scene.children );

    // if ( intersects.length > 0 ) {

    //     // if ( INTERSECTED != intersects[ 0 ].object ) {

    //     //     if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

    //     //     INTERSECTED = intersects[ 0 ].object;
    //     //     INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
    //     //     INTERSECTED.material.emissive.setHex( 0xff0000 );

    //     // }

    //     intersects[ 0 ].object.material.color.set( 0xff0000 );

    // } else {

    //     // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
    
    //     INTERSECTED = null;

    // }

    renderer.render( scene, currentCamera );

}

function initGUI() {
    gui = new GUI( { width: 300 } );
    const options = gui.addFolder( 'options' );
    options.open();
}

// function onDocumentMouseMove( event ) {
//     event.preventDefault();
//     mouse.x =   ( event.clientX / window.innerWidth  ) * 2 - 1;
//     mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
// }
