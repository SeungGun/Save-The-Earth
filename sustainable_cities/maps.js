import * as THREE from 'three';

import Stats from 'three/addons/stats.module.js';
import { GLTFLoader } from 'three/addons/GLTFLoader.js';
import { FontLoader } from 'three/addons/FontLoader.js';
import { TextGeometry } from 'three/addons/TextGeometry.js';
import { ShadowMapViewer } from 'three/addons/utils/ShadowMapViewer.js';
// import { GUI } from 'three/addons/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/OrbitControls.js';
import { DRACOLoader } from 'three/addons/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/RoomEnvironment.js';

function mainPage() {
    // main page
    const container = document.getElementById("container0");
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild( renderer.domElement );
    let camera = new THREE.PerspectiveCamera(75, 2, 0.1, 7);
    camera.position.z = 3;

    let scene = new THREE.Scene();
    scene.background = new THREE.Color(0x808080);

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    const sdgsloader = new THREE.TextureLoader();
    const materials = [
        new THREE.MeshBasicMaterial({ map: sdgsloader.load("./sdg-11.png") }),
        new THREE.MeshBasicMaterial({ map: sdgsloader.load("./sdg-11.png") }),
        new THREE.MeshBasicMaterial({ map: sdgsloader.load("./sdg-11.png") }),
        new THREE.MeshBasicMaterial({ map: sdgsloader.load("./sdg-11.png") }),
        new THREE.MeshBasicMaterial({ map: sdgsloader.load("./sdg-11.png") }),
        new THREE.MeshBasicMaterial({ map: sdgsloader.load("./sdg-11.png") }),
    ];  
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    function render(time){
        time *= 0.001;
        // const speed = 1 + ndx * .1;
        // const rot = time * speed;
        cube.rotation.x = time;
        cube.rotation.y = time;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}


init();
    
function init() {
    
    mainPage();

    document.getElementById("main").onclick = function(){
        document.getElementById('subs2').style.display = "block";

        // Change the map to main page
        if(document.getElementById('container0')){
            const delContainer = document.getElementById("container0");
            delContainer.parentNode.removeChild(delContainer);
        }
        const temp = document.createElement('div');
        temp.id = 'container0';
        document.body.appendChild(temp);

        if(document.getElementById('container1')){
            const delContainer = document.getElementById('container1');
            delContainer.parentNode.removeChild(delContainer);
        }
        if(document.getElementById('container2')){
            const delContainer = document.getElementById('container2');
            delContainer.parentNode.removeChild(delContainer);
        }
        if(document.getElementById('container3')){
            const delContainer = document.getElementById('container3');
            delContainer.parentNode.removeChild(delContainer);
        }        
        mainPage();
    }

    document.getElementById("primitive").onclick = function(){ 
        document.getElementById('subs2').style.display = "none";

        // Change the map to primitive era
        if(document.getElementById('container1')){
            const delContainer = document.getElementById('container1');
            delContainer.parentNode.removeChild(delContainer);
        }
        const temp = document.createElement('div');
        temp.id = 'container1';
        document.body.appendChild(temp);
        
        if(document.getElementById('container0')){
            const delContainer = document.getElementById('container0');
            delContainer.parentNode.removeChild(delContainer);
        }
        if(document.getElementById('container2')){
            const delContainer = document.getElementById('container2');
            delContainer.parentNode.removeChild(delContainer);
        }
        if(document.getElementById('container3')){
            const delContainer = document.getElementById('container3');
            delContainer.parentNode.removeChild(delContainer);
        }
        const container = document.getElementById("container1");


        const SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;
        let SCREEN_WIDTH = window.innerWidth;
        let SCREEN_HEIGHT = window.innerHeight;
        const FLOOR = - 250;

        let camera, controls, scene, renderer, stats;

        const NEAR = 1, FAR = 30000;

        let mixer;

        const morphs = [];

        let light;
        let lightShadowMapViewer;

        const clock = new THREE.Clock();

        let showHUD = false;
        
        // Camera
        camera = new THREE.PerspectiveCamera( 40, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR );
        camera.position.set( 500, 50, 3000 );

        // RENDERER
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
        container.appendChild( renderer.domElement );
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.autoClear = false;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;

        // SCENE    
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x59472b );
        scene.fog = new THREE.Fog( 0x59472b, 1000, FAR );
    
        // LIGHTS
        // light 2
        const ambient = new THREE.AmbientLight( 0x444444 );
        scene.add( ambient );
    
        light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 30, 0.3 );
        light.position.set( 0, 6000, 7500 );
        light.target.position.set( 0, 0, 0 );
        light.penumbra = 0
        light.castShadow = true;
        light.shadow.camera.near = 1200;
        light.shadow.camera.far = 1500;
        light.shadow.bias = 0.0001;
    
        light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
        light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    
        scene.add( light );
    
        createHUD();
        createScene();
    
        // CONTROLS
        controls = new OrbitControls( camera, renderer.domElement );
        controls.lookSpeed = 0.0125;
        controls.movementSpeed = 500;
        controls.noFly = false;
        controls.lookVertical = true;
        controls.target.set( 0, 0.5, 0 );
        // controls.lookAt( scene.position );
    
        // STATS
        stats = new Stats();
    
        //
        window.addEventListener( 'resize', onWindowResize );
        window.addEventListener( 'keydown', onKeyDown );


        // draw human
        let humanPosition;
        let mixerHuman, skeleton;
        const crossFadeControls = [];
        let currentBaseAction = 'walk';
        const allActions = [];
        const baseActions = {
            idle: { weight: 1 },
            walk: { weight: 0 },
            run: { weight: 0 }
        };
        const additiveActions = {
            sneak_pose: { weight: 0 },
            sad_pose: { weight: 0 },
            agree: { weight: 0 },
            headShake: { weight: 0 }
        };
        let panelSettings, numAnimations;
        
        const humanLoader = new GLTFLoader();
        humanLoader.load( '../model/primitive/Xbot.glb', function ( gltf ) {
        
        let human = gltf.scene;
        human.scale.multiplyScalar(100);
        humanPosition = [1, -250, 900];
        human.position.set(...humanPosition);
        scene.add( human );
    
        human.traverse( function ( object ) {
            if ( object.isMesh ) object.castShadow = true;
        } );
    
        skeleton = new THREE.SkeletonHelper( human );
        skeleton.visible = false;
        scene.add( skeleton );
    
        const animations = gltf.animations;
        mixerHuman = new THREE.AnimationMixer( human );
    
        numAnimations = animations.length;
    
        for ( let i = 0; i !== numAnimations; ++ i ) {
    
            let clip = animations[ i ];
            const name = clip.name;
    
            if ( baseActions[ name ] ) {
                const action = mixerHuman.clipAction( clip );
                activateAction( action );
                baseActions[ name ].action = action;
                allActions.push( action );
            } else if ( additiveActions[ name ] ) {
                // Make the clip additive and remove the reference frame
                THREE.AnimationUtils.makeClipAdditive( clip );
                if ( clip.name.endsWith( '_pose' ) ) {
    
                    clip = THREE.AnimationUtils.subclip( clip, clip.name, 2, 3, 30 );
    
                }
                const action = mixerHuman.clipAction( clip );
                activateAction( action );
                additiveActions[ name ].action = action;
                allActions.push( action );
            }
        }
    } );
    function activateAction( action ) {
        const clip = action.getClip();
        const settings = baseActions[ clip.name ] || additiveActions[ clip.name ];
        setWeight( action, settings.weight );
        action.play();
    }
    function setWeight( action, weight ) {
        action.enabled = true;
        action.setEffectiveTimeScale( 1 );
        action.setEffectiveWeight( weight );
    }
    
    function onWindowResize() {
    
        SCREEN_WIDTH = window.innerWidth;
        SCREEN_HEIGHT = window.innerHeight;
        renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );    
    }
    
    function onKeyDown( event ) {
    
        switch ( event.keyCode ) {
    
            case 84:	
                showHUD = ! showHUD;
                break;
    
        }
    }
    
    function createHUD() {
        lightShadowMapViewer = new ShadowMapViewer( light );
        lightShadowMapViewer.position.x = 10;
        lightShadowMapViewer.position.y = SCREEN_HEIGHT - ( SHADOW_MAP_HEIGHT / 4 ) - 10;
        lightShadowMapViewer.size.width = SHADOW_MAP_WIDTH / 4;
        lightShadowMapViewer.size.height = SHADOW_MAP_HEIGHT / 4;
        lightShadowMapViewer.update();
    }
    
    function createScene( ) {
    
        // GROUND
        const geometry = new THREE.PlaneGeometry( 100, 100 );
        const planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffb851 } );
    
        const ground = new THREE.Mesh( geometry, planeMaterial );
    
        ground.position.set( 0, FLOOR, 0 );
        ground.rotation.x = - Math.PI / 2;
        ground.scale.set( 100, 100, 100 );
    
        ground.castShadow = false;
        ground.receiveShadow = true;
    
        scene.add( ground );
    
        // TEXT
    
        const loader = new FontLoader();
        loader.load( '../model/primitive/helvetiker_bold.typeface.json', function ( font ) {
    
            const textGeo = new TextGeometry( 'Primitive Era', {
                font: font,
                size: 200,
                height: 50,
                curveSegments: 12,
    
                bevelThickness: 2,
                bevelSize: 5,
                bevelEnabled: true
    
            } );
    
            textGeo.computeBoundingBox();
            const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    
            const textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );
    
            const mesh = new THREE.Mesh( textGeo, textMaterial );
            mesh.position.x = centerOffset;
            mesh.position.y = FLOOR + 67;
            mesh.position.z = 100;
    
            mesh.castShadow = true;
            mesh.receiveShadow = true;
    
            scene.add( mesh );
    
        } );
    
        // CUBES
    
        const cubes1 = new THREE.Mesh( new THREE.BoxGeometry( 1800, 220, 150 ), planeMaterial );
        cubes1.position.y = FLOOR - 50;
        cubes1.position.z = 120;
        cubes1.castShadow = true;
        cubes1.receiveShadow = true;
        scene.add( cubes1 );
    
        const cubes2 = new THREE.Mesh( new THREE.BoxGeometry( 1900, 170, 250 ), planeMaterial );
        cubes2.position.y = FLOOR - 50;
        cubes2.position.z = 120;
        cubes2.castShadow = true;
        cubes2.receiveShadow = true;
        scene.add( cubes2 );
    
        // MORPHS
    
        mixer = new THREE.AnimationMixer( scene );
    
        function addMorph( mesh, clip, speed, duration, x, y, z, fudgeColor ) {
    
            mesh = mesh.clone();
            mesh.material = mesh.material.clone();
    
            if ( fudgeColor ) {
    
                mesh.material.color.offsetHSL( 0, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25 );
    
            }
    
            mesh.speed = speed;
    
            mixer.clipAction( clip, mesh ).
                setDuration( duration ).
            // to shift the playback out of phase:
                startAt( - duration * Math.random() ).
                play();
    
            mesh.position.set( x, y, z );
            mesh.rotation.y = Math.PI / 2;
    
            mesh.castShadow = true;
            mesh.receiveShadow = true;
    
            scene.add( mesh );
    
            morphs.push( mesh );
    
        }
    
        const gltfloader = new GLTFLoader();
    
        gltfloader.load( '../model/primitive/Horse.glb', function ( gltf ) {
    
            const mesh = gltf.scene.children[ 0 ];
    
            const clip = gltf.animations[ 0 ];
    
            addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, 300, true );
            addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, 450, true );
            addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, 600, true );
    
            addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, - 300, true );
            addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, - 450, true );
            addMorph( mesh, clip, 550, 1, 100 - Math.random() * 1000, FLOOR, - 600, true );
    
        } );
    
        gltfloader.load( '../model/primitive/Flamingo.glb', function ( gltf ) {
    
            const mesh = gltf.scene.children[ 0 ];
            const clip = gltf.animations[ 0 ];
    
            addMorph( mesh, clip, 500, 1, 500 - Math.random() * 500, FLOOR + 350, 40 );
    
        } );
    
        gltfloader.load( '../model/primitive/Stork.glb', function ( gltf ) {
    
            const mesh = gltf.scene.children[ 0 ];
            const clip = gltf.animations[ 0 ];
    
            addMorph( mesh, clip, 350, 1, 500 - Math.random() * 500, FLOOR + 350, 340 );
    
        } );
    
        gltfloader.load( '../model/primitive/Parrot.glb', function ( gltf ) {
    
            const mesh = gltf.scene.children[ 0 ];
            const clip = gltf.animations[ 0 ];
    
            addMorph( mesh, clip, 450, 0.5, 500 - Math.random() * 500, FLOOR + 300, 700 );
        } );
    }

    function animate() {
    
        requestAnimationFrame( animate );
        
        const delta = clock.getDelta();
    
        mixer.update(delta);

        for ( let i = 0; i < morphs.length; i ++ ) {
    
            const morph = morphs[ i ];
    
            morph.position.x += morph.speed * delta;
    
            if ( morph.position.x > 2000 ) {
                morph.position.x = - 1000 - Math.random() * 500;
            }
        }
    
        stats.update();
    
        controls.update( delta );
    
        renderer.clear();
        renderer.render( scene, camera );
    
        // Render debug HUD with shadow map
        if ( showHUD ) {
            lightShadowMapViewer.render( renderer );
        }
    }
    animate();
    }

    document.getElementById("middle").onclick = function(){
        document.getElementById('subs2').style.display = "none";

        // Change the map to middle era
        if(document.getElementById('container2')){
            const delContainer = document.getElementById('container2');
            delContainer.parentNode.removeChild(delContainer);
        }
        const temp = document.createElement('div');
        temp.id = 'container2';
        document.body.appendChild(temp);

        if(document.getElementById('container0')){
            const delContainer = document.getElementById('container0');
            delContainer.parentNode.removeChild(delContainer);
        }
        if(document.getElementById('container1')){
            const delContainer = document.getElementById('container1');
            delContainer.parentNode.removeChild(delContainer);
        }
        if(document.getElementById('container3')){
            const delContainer = document.getElementById('container3');
            delContainer.parentNode.removeChild(delContainer);
        }
        const container = document.getElementById("container2");


        let mixer;

        const clock = new THREE.Clock();

        const renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild( renderer.domElement );

        const pmremGenerator = new THREE.PMREMGenerator( renderer );

        const scene = new THREE.Scene();
        // scene.background = new THREE.Color( 0xbfe3dd );
        scene.background = new THREE.Color( 0xa0a0a0 );
        scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
        scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

        // light 1
        const hemiLight = new THREE.HemisphereLight( 0xffee44, 0x444444 );
        hemiLight.position.set( 0, 0, 4000 );
        scene.add( hemiLight );

        const ground = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x867d8c, depthWrite: false } ) );
        ground.rotation.x = - Math.PI / 2;
        ground.receiveShadow = true;
        scene.add( ground );

        const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
        camera.position.set( 5, 2, 10 );

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.target.set( 0, 0.5, 0 );
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '../jsm/draco/' );

        const loader = new GLTFLoader();
        loader.setDRACOLoader( dracoLoader );
        loader.load( '../model/middle/LittlestTokyo.glb', function ( gltf ) {

            const model = gltf.scene;
            model.position.set( 1, 1, 0 );
            model.scale.set( 0.01, 0.01, 0.01 );
            scene.add( model );

            mixer = new THREE.AnimationMixer( model );
            mixer.clipAction( gltf.animations[ 0 ] ).play();

            animate();

        }, undefined, function ( e ) {

	        console.error( e );

        } );    


        // draw human
        let mixerHuman, skeleton;
        // const crossFadeControls = [];
        // let currentBaseAction = 'walk';
        const allActions = [];
        const baseActions = {
            idle: { weight: 0 },
            walk: { weight: 1 },
            run: { weight: 0 }
        };
        const additiveActions = {
            sneak_pose: { weight: 0 },
            sad_pose: { weight: 0 },
            agree: { weight: 0 },
            headShake: { weight: 0 }
        };
        let panelSettings, numAnimations;

        const humanLoader = new GLTFLoader();
        humanLoader.load( '../model/middle/Xbot.glb', function ( gltf ) {

            let human = gltf.scene;
            human.scale.multiplyScalar(0.5);
            human.position.z = 3;
            human.position.y = -1;
            human.position.x = 1;
            scene.add( human );

            human.traverse( function ( object ) {
                if ( object.isMesh ) object.castShadow = true;
            } );

            skeleton = new THREE.SkeletonHelper( human );
            skeleton.visible = false;
            scene.add( skeleton );

            const animations = gltf.animations;
            mixerHuman = new THREE.AnimationMixer( human );

            numAnimations = animations.length;

            for ( let i = 0; i !== numAnimations; ++ i ) {

                let clip = animations[ i ];
                const name = clip.name;

                if ( baseActions[ name ] ) {
                    const action = mixerHuman.clipAction( clip );
                    activateAction( action );
                    baseActions[ name ].action = action;
                    allActions.push( action );
                } else if ( additiveActions[ name ] ) {
                    // Make the clip additive and remove the reference frame
                    THREE.AnimationUtils.makeClipAdditive( clip );
                    if ( clip.name.endsWith( '_pose' ) ) {

                        clip = THREE.AnimationUtils.subclip( clip, clip.name, 2, 3, 30 );

                    }
                    const action = mixerHuman.clipAction( clip );
                    activateAction( action );
                    additiveActions[ name ].action = action;
                    allActions.push( action );
                }
            }
        } );
        function activateAction( action ) {
            const clip = action.getClip();
            const settings = baseActions[ clip.name ] || additiveActions[ clip.name ];
            setWeight( action, settings.weight );
            action.play();
        }
        function setWeight( action, weight ) {
            action.enabled = true;
            action.setEffectiveTimeScale( 1 );
            action.setEffectiveWeight( weight );
        }

    // draw flamingo
    const flamingo = new GLTFLoader();
    const mixers = [];
    flamingo.load( '../model/middle/Flamingo.glb', function ( gltf ) {

        const bird= gltf.scene.children[ 0 ];

        const s = 0.005;
        bird.scale.set( s, s, s );
        bird.position.y = 3;
        bird.position.x = 3.5;
        bird.rotation.y = - 1;

        bird.castShadow = true;
        bird.receiveShadow = true;

        scene.add( bird );

        const mixer = new THREE.AnimationMixer( bird );
        mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();
        mixers.push( mixer );

    } );


    window.onresize = function () {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    };


    function animate() {

        requestAnimationFrame( animate );

        const delta = clock.getDelta();

        mixer.update( delta );

        // Flamingo fly
        for ( let i = 0; i < mixers.length; i ++ ) {
            mixers[ i ].update( delta );
        }

        for ( let i = 0; i !== numAnimations; ++ i ) {

            const action = allActions[ i ];
            const clip = action.getClip();
            const settings = baseActions[ clip.name ] || additiveActions[ clip.name ];
            settings.weight = action.getEffectiveWeight();

        }
        mixerHuman.update( delta );

        controls.update();

        renderer.render( scene, camera );

    }
    }

    document.getElementById("modern").onclick = function(){
        document.getElementById('subs2').style.display = "none";
        
        // Change the map to middle era
         if(document.getElementById('container3')){
            const delContainer = document.getElementById('container3');
            delContainer.parentNode.removeChild(delContainer);
        }
        const temp = document.createElement('div');
        temp.id = 'container3';
        document.body.appendChild(temp);

        if(document.getElementById('container0')){
            const delContainer = document.getElementById('container0');
            delContainer.parentNode.removeChild(delContainer);
        }
        if(document.getElementById('container1')){
            const delContainer = document.getElementById('container1');
            delContainer.parentNode.removeChild(delContainer);
        }
        if(document.getElementById('container2')){
            const delContainer = document.getElementById('container2');
            delContainer.parentNode.removeChild(delContainer);
        }
        const container = document.getElementById("container3");


        const clock = new THREE.Clock();
        const renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild( renderer.domElement );

        const pmremGenerator = new THREE.PMREMGenerator( renderer );

        const scene = new THREE.Scene();
        // scene.background = new THREE.Color( 0xbfe3dd );
        scene.background = new THREE.Color( 0xa0a0a0 );
        scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
        scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

        // light 1
        const hemiLight = new THREE.HemisphereLight( 0xffee44, 0x444444 );
        hemiLight.position.set( 0, 0, 4000 );
        scene.add( hemiLight );

        const ground = new THREE.Mesh( new THREE.PlaneGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x867d8c, depthWrite: false } ) );
        ground.rotation.x = - Math.PI / 2;
        ground.receiveShadow = true;
        scene.add( ground );

        const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
        camera.position.set( -2, 1.5, 8 );
        // camera.rotation.set(-100, 0, -220)

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.target.set( 0, 0.5, 0 );
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;

        // // draw building
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '../jsm/draco/' );

        const loader = new GLTFLoader();
        loader.setDRACOLoader( dracoLoader );
        loader.load( '../model/modern/scene.gltf', function ( gltf ) {
            const model = gltf.scene;
            model.position.set( -1, -2.1, -3 );
	        model.scale.set( 0.1, 0.1, 0.1 );
            // model.rotation.set(0, 140, 0)
            scene.add( model );

            animate();

        }, undefined, function ( e ) {

            console.error( e );

        } );    


        // draw human
        let mixerHuman, skeleton;
        const allActions = [];
        const baseActions = {
            idle: { weight: 0 },
            walk: { weight: 0 },
            run: { weight: 1 }
        };
        const additiveActions = {
            sneak_pose: { weight: 0 },
            sad_pose: { weight: 0 },
            agree: { weight: 0 },
            headShake: { weight: 0 }
        };
        let panelSettings, numAnimations;

        let humanLoader = new GLTFLoader();
        humanLoader.load( '../model/modern/Xbot.glb', function ( gltf ) {

            let human = gltf.scene;
            human.scale.multiplyScalar(0.5);
            human.position.z = 2.5;
            human.position.y = -1;
            human.position.x = 0;
            scene.add( human );

            human.traverse( function ( object ) {
                if ( object.isMesh ) object.castShadow = true;
            } );

            skeleton = new THREE.SkeletonHelper( human );
            skeleton.visible = false;
            scene.add( skeleton );

            const animations = gltf.animations;
            mixerHuman = new THREE.AnimationMixer( human );

            numAnimations = animations.length;

            for ( let i = 0; i !== numAnimations; ++ i ) {

                let clip = animations[ i ];
                const name = clip.name;

                if ( baseActions[ name ] ) {
                    const action = mixerHuman.clipAction( clip );
                    activateAction( action );
                    baseActions[ name ].action = action;
                    allActions.push( action );
                } 
                else if ( additiveActions[ name ] ) {
                    // Make the clip additive and remove the reference frame
                    THREE.AnimationUtils.makeClipAdditive( clip );
                    if ( clip.name.endsWith( '_pose' ) ) {

                        clip = THREE.AnimationUtils.subclip( clip, clip.name, 2, 3, 30 );

                    }
                    const action = mixerHuman.clipAction( clip );
                    activateAction( action );
                    additiveActions[ name ].action = action;
                    allActions.push( action );
                }
            }
        } );
        function activateAction( action ) {

            const clip = action.getClip();
            const settings = baseActions[ clip.name ] || additiveActions[clip.name];
            setWeight( action, settings.weight );
            action.play();

        }
        function setWeight( action, weight ) {
            action.enabled = true;
            action.setEffectiveTimeScale( 1 );
            action.setEffectiveWeight( weight );
        }


        // draw ferrari
        const carLoader = new GLTFLoader();
        carLoader.setDRACOLoader( dracoLoader );
        const shadow = new THREE.TextureLoader().load( '../model/modern/ferrari_ao.png' );
        carLoader.load( '../model/modern/ferrari.glb', function ( gltf ) {

            const bodyMaterial = new THREE.MeshPhysicalMaterial( {
                color: 0x000000, metalness: 1.0, roughness: 0.8,
                clearcoat: 1.0, clearcoatRoughness: 0.2
            } );

            const detailsMaterial = new THREE.MeshStandardMaterial( {
                color: 0xffffff, metalness: 1.0, roughness: 0.5
            } );

            const glassMaterial = new THREE.MeshPhysicalMaterial( {
                color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
            } );

            const carModel = gltf.scene.children[ 0 ];
            carModel.position.set(3, -1, 0);
            carModel.rotation.y = Math.PI;
            carModel.scale.multiplyScalar(0.4)

            carModel.getObjectByName( 'body' ).material = bodyMaterial;
            carModel.getObjectByName( 'rim_fl' ).material = detailsMaterial;
            carModel.getObjectByName( 'rim_fr' ).material = detailsMaterial;
            carModel.getObjectByName( 'rim_rr' ).material = detailsMaterial;
            carModel.getObjectByName( 'rim_rl' ).material = detailsMaterial;
            carModel.getObjectByName( 'trim' ).material = detailsMaterial;
            carModel.getObjectByName( 'glass' ).material = glassMaterial;

            // shadow
            const mesh = new THREE.Mesh(
                new THREE.PlaneGeometry( 0.655 * 4, 1.3 * 4 ),
                new THREE.MeshBasicMaterial( {
                    map: shadow, blending: THREE.MultiplyBlending, toneMapped: false, transparent: true
                } )
            );
            mesh.rotation.x = - Math.PI / 2;
            mesh.renderOrder = 2;
            carModel.add( mesh );
            scene.add( carModel );
        } );


        window.onresize = function () {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        };


        function animate() {

            requestAnimationFrame( animate );

            const delta = clock.getDelta();

            for ( let i = 0; i !== numAnimations; ++ i ) {
                const action = allActions[ i ];
                let clip = action.getClip();
                const settings = baseActions[ clip.name ] || additiveActions[clip.name];
                settings.weight = action.getEffectiveWeight();
            }
            mixerHuman.update( delta );

            controls.update();

            renderer.render( scene, camera );

        }


    }
}
        