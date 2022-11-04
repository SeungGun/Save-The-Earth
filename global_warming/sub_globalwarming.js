
window.onload = function init()
{
	const canvas = document.getElementById( "gl-canvas" );
	canvas.width = window.innerWidth;
	canvas.height = window.outerHeight * 1.14; // set canvas height same as text height(handmade)

	const renderer = new THREE.WebGLRenderer({canvas, alpha:true});
	renderer.setSize(canvas.width,canvas.height);


	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0xAED6F1); // skyblue

	// const gl = document.getElementById("gl-canvas").getContext("webgl", {
	// 	premultipliedAlpha: false,});
	// gl.clearColor(1, 0, 0, 0.5);
	// gl.clear(gl.COLOR_BUFFER_BIT);
	  

	camera = new THREE.PerspectiveCamera(75,canvas.width / canvas.height,0.01, 1000);
	camera.rotation.y = 45/180*Math.PI;
	camera.position.x = 0;
	camera.position.y = 80;
	camera.position.z = 800;
	camera.lookAt(0,0,0);

	// const controls = new THREE.OrbitControls(camera, renderer.domElement);	//화면확대

	hlight = new THREE.AmbientLight (0x404040,1);
	scene.add(hlight);
	light = new THREE.PointLight(0xc4c4c4,1);
	light.position.set(0,3000,5000);
	scene.add(light);

	light2 = new THREE.PointLight(0xc4c4c4,1);
	light2.position.set(5000,1000,0);
	scene.add(light2);

	light3 = new THREE.PointLight(0xc4c4c4,1);
	light3.position.set(0,1000,-5000);
	scene.add(light3);

	const group_top = new THREE.Group()

	// ice berg + polar bear grouping
	const loader_ice = new THREE.GLTFLoader();
	loader_ice.load('../model/iceberg/scene.gltf', function(gltf){
	iceberg = gltf.scene.children[0];
	iceberg.scale.set(0.5, 0.3, 0.3);
	iceberg.position.x = -40;
	iceberg.position.z = 10;
	iceberg.position.y = 90; //높이, 170이 최대
	group_top.add(iceberg);

	loader_ice.load('../model/polarbear/scene.gltf', function(gltf){
	polarbear = gltf.scene.children[0];
	polarbear.scale.set(0.25, 0.25, 0.25);
	polarbear.position.x = -40;
	polarbear.position.z = 10;
	polarbear.position.y = 200; //높이, 280이 최대

	group_top.add(polarbear);
	scene.add(group_top);
	//scene.add(gltf.scene);
		animate();
	  }, undefined, function (error) {
		  console.error(error);
	  });
	  //scene.add(gltf.scene);
	  animate();
	}, undefined, function (error) {
		console.error(error);
	}); 

	// empire state building
	const loader_building = new THREE.GLTFLoader();
	loader_building.load('../model/empire_state_building/scene.gltf', function(gltf){
	  building = gltf.scene.children[0];
	  
	  building.scale.set(3,3,4);
	  building.rotation.x = Math.PI * 2;
	  building.position.x = -40;
	  building.position.y = -130; //높이
	  building.position.z = 10;
	  scene.add(gltf.scene);
	  animate();
	}, undefined, function (error) {
		console.error(error);
	});

	// earth
	const loader_earth = new THREE.GLTFLoader();
	loader_earth.load('../model/earth/scene.gltf', function(gltf){
	  earth = gltf.scene.children[0];
	  
	  earth.scale.set(1.7,1.7,1.7);
	  earth.position.x = -45;
	  earth.position.y = 5;
	  earth.position.z = 10;
	  scene.add(gltf.scene);
	  animate();
	}, undefined, function (error) {
		console.error(error);
	});

	const loader_thermometer = new THREE.GLTFLoader();
	loader_thermometer.load('../model/thermometer/scene.gltf', function(gltf){
	  thermometer = gltf.scene.children[0];
	  
	  thermometer.scale.set(18,18,12);
	  thermometer.position.x = -650;
	  thermometer.position.y = -180;
	  thermometer.position.z = 10;
	  scene.add(gltf.scene);
	  animate();
	}, undefined, function (error) {
		console.error(error);
	});

	const loader_watertap = new THREE.GLTFLoader();
	loader_watertap.load('../model/watertap/scene.gltf', function(gltf){
	  watertap = gltf.scene.children[0];
	  
	  watertap.scale.set(1000,1000,1000);
	  watertap.position.x = 600;
	  watertap.position.y = -30;
	  watertap.rotation.z = -3;
	  scene.add(gltf.scene);
	  animate();
	}, undefined, function (error) {
		console.error(error);
	});


	const bot_temp = new THREE.CylinderGeometry(23, 23, 250, 32); // 원기둥에 대한 형상 정의 -> 윗원 radius, 아랫원 radius, 높이, segment 수
	//let parameters = bot_temp.geometry.parameters;
    const material = new THREE.MeshPhongMaterial({color: 0x660000});
    const cube = new THREE.Mesh(bot_temp, material);
	cube.position.x = -650;
	cube.position.y = -20;
	cube.position.z = 35;
    scene.add(cube); // Scene에 위 Mesh를 추가

	const bot_water = new THREE.CylinderGeometry(12, 12, 95, 32); // 원기둥에 대한 형상 정의 -> 윗원 radius, 아랫원 radius, 높이, segment 수
    const material2 = new THREE.MeshPhongMaterial({color: 0x99ebff});
    const water = new THREE.Mesh(bot_water, material2);
	water.position.x = 395;
	water.position.y = 63;
    scene.add(water); // Scene에 위 Mesh를 추가

	function setSize( myMesh, ySize ){
		//scaleFactorX = myMesh.geometry.parameters.width;
		scaleFactorY = ySize / myMesh.geometry.parameters.height;
		//scaleFactorZ = myMesh.geometry.parameters.depth;
		myMesh.scale.set( 1, scaleFactorY, 1 );
	  }
	

	// 스크롤로 obj 움직이기
	  addEventListener("mousewheel", e => {
		//const direction = e.deltaY > 0 ? "Scroll Down" : "Scroll Up";;
		if(window.scrollY < 1 || window.scrollY > 200){ // min/max boundary of scroll
			return;
		}

		if(e.deltaY > 0) { //스크롤업
			group_top.position.y += 1; //빙하+북극곰 이동
			building.position.y += 1; //빌딩 이동
			cube.geometry.parameters.height -=0.7;
			cube.geometry = new THREE.CylinderGeometry(23, 23, cube.geometry.parameters.height, 32);
			cube.position.y -= 0.4;
			water.geometry.parameters.height -=1; //물줄기 줄어들기
			water.geometry = new THREE.CylinderGeometry(12, 12, water.geometry.parameters.height, 32);
			water.position.y += 0.5;

		}
		else { //스크롤다운
			group_top.position.y -= 1; //빙하+북극곰 이동
			building.position.y -= 1; //빌딩 이동
			cube.geometry.parameters.height +=0.6; //체온 수치 높이 증가
			cube.geometry = new THREE.CylinderGeometry(23, 23, cube.geometry.parameters.height, 32);
			cube.position.y += 0.4; //체온 수치 바닥 증가
			water.geometry.parameters.height +=1; //물줄기 늘어나기
			water.geometry = new THREE.CylinderGeometry(12, 12, water.geometry.parameters.height, 32);
			water.position.y -= 0.5; //물줄기 뚜껑 줄어들기

			
		}
		console.log( window.scrollY )
	  });
	  
	function animate() {
	   renderer.render(scene,camera);
	   requestAnimationFrame(animate);
	}

}


