
window.onload = function init()
{
	const canvas = document.getElementById( "gl-canvas" );
	canvas.width = window.innerWidth * 0.5;
	canvas.height = window.innerHeight;

	const renderer = new THREE.WebGLRenderer({canvas});
	renderer.setSize(canvas.width,canvas.height);

	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);

	camera = new THREE.PerspectiveCamera(75,canvas.width / canvas.height,0.1, 1000);
	camera.rotation.y = 45/180*Math.PI;
	camera.position.x = 150;
	camera.position.y = 150;
	camera.position.z = 150;

	const controls = new THREE.OrbitControls(camera, renderer.domElement);

	hlight = new THREE.AmbientLight (0x404040,11);
	scene.add(hlight);

	const loader = new THREE.GLTFLoader();
	loader.load('./model/main_earth/scene.gltf', function(gltf){
	  earth = gltf.scene.children[0];
	  earth.scale.set(100,100,100);
	  scene.add(gltf.scene);
	  animate();
	}, undefined, function (error) {
		console.error(error);
	});

	loader.load('./model/map_pin/scene.gltf', function(gltf) {
		pin = gltf.scene.children[0];
		pin.scale.set(35, 35, 35);
		pin.position.set(57, 57, 57);
		pin.rotation.x = 15;
		pin.rotation.y = 15;
		scene.add(gltf.scene);
		animate();
	}, undefined, function (error) {
		console.error(error);
	});

	loader.load('./model/map_pin/scene.gltf', function(gltf) {
		pin2 = gltf.scene.children[0];
		pin2.scale.set(35, 35, 35);
		pin2.position.set(0, -100, 0);  // 4, 254, 53
		pin2.rotation.x = 1.5;
		pin2.rotation.y = 0;
		scene.add(gltf.scene);
		animate();
	}, undefined, function (error) {
		console.error(error);
	});

	loader.load('./model/map_pin/scene.gltf', function(gltf) {
		pin3 = gltf.scene.children[0];
		pin3.scale.set(35, 35, 35);
		pin3.position.set(57, 80, 0);   // 157, 207, -2
		pin3.rotation.x = 20.3;
		pin3.rotation.y = 15.2;
		scene.add(gltf.scene);
		animate();
	}, undefined, function (error) {
		console.error(error);
	});

	loader.load('./model/map_pin/scene.gltf', function(gltf) {
		pin4 = gltf.scene.children[0];
		pin4.scale.set(35, 35, 35);
		pin4.position.set(0, 97, 20);   // 185, 172, 57
		pin4.rotation.x = 4.8;
		pin4.rotation.y = 0;
		scene.add(gltf.scene);
		animate();
	}, undefined, function (error) {
		console.error(error);
	});

	// loader.load('./model/map_pin/scene.gltf', function(gltf) {
	// 	pin5 = gltf.scene.children[0];
	// 	pin5.scale.set(35, 35, 35);
	// 	pin5.position.set(-70, 68, 20);
	// 	pin5.rotation.x = 5.4;
	// 	pin5.rotation.y = 5.5;
	// 	scene.add(gltf.scene);
	// 	animate();
	// }, undefined, function (error) {
	// 	console.error(error);
	// });

	var con1 = document.getElementById('era');
	var con2 = document.getElementById('ocean');
	var con3 = document.getElementById('land');
	var con4 = document.getElementById('climate');

	con1.onmouseover = function() {
		camera.position.x = 157;
		camera.position.y = 207;
		camera.position.z = -2;
	}

	con2.onmouseover = function() {
		camera.position.x = 150;
		camera.position.y = 150;
		camera.position.z = 150;
	}

	con3.onmouseover = function() {
		camera.position.x = -193;
		camera.position.y = 166;
		camera.position.z = 51;
	}

	con4.onmouseover = function() {
		camera.position.x = 4;
		camera.position.y = 254;
		camera.position.z = 53;
	}

	function animate() {
		controls.update();
	    renderer.render(scene,camera);
	    requestAnimationFrame(animate);
	}
}


