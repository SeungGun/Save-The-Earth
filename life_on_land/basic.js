/*
 three.js의 기본 구성 요소
 1. 3차원 객체로 구성되는 Scene
 2. 위 장면을 모니터와 같은 출력장치에 출력할 수 있는, 즉 렌더링할 수 있는 Renderer
     장면을 렌더링할 때는 시점에 따라서 다양한 모습으로 렌더링됨
 3. 그 시점을 Camera로 정의
 4. 다시 장면(Scene)은 Light(광원)과 3차원 모델인 Mesh로 구성됨
     Mesh는 object3D의 파생 클래스
 5. Mesh는 형상을 정의하는 Geometry와 색상 및 투명도 등을 정의하는 Material로 정의됨 
*/

var x = 0; // 카메라 x 좌표
var y = 40; // 카메라 y 좌표
var z = 120; // 카메라 z 좌표;

var lastIndex = 0; // 마지막에 기준치에 달성한 오브젝트의 array index 값

const TOTAL_GALBAGE = 8; // 순환할 쓰레기 오브젝트의 총 개수
var INITIAL_DROP_SPEED = 3; // 기본 쓰레기 떨어지는 속도(차감되는 y 값)
var MAX_WEIGHT_SPEED = 5; // 최대 가중치 속도
const GARBAGE_SPAWN_Y = 70; // 쓰레기 생성 y 위치
const GROUND_SIZE = 220; // 바닥의 크기
const CONTAINER_SIZE = 20; // 쓰레기통의 크기
var MOVE_STEP = 15; // 쓰레기통의 이동 반경
var JUMP_STEP = 3; // 쓰레기통의 상하 이동 반경
const THRESHOLD = -30; // 기준 y
var LIMIT_CONTAINER_UP = -5;
var LIMIT_CONTAINER_DOWN = -20;

var currentGarbageIndex = 1;
var time = 100;
var isAdded = true; // GLTF 모델이 다 로드가 되었는지 판단
var flag = true; // 기준 바닥에 닿았는지 판단(= 새로 쓰레기 obj를 만들지)
var isCollision = false;
var isTimeAdded = false;

var garbages = []; // 랜덤으로 생성한 도형들을 담는 배열
var point = 0;
var cumulPoint = 0; // 누적 점수

var modelPathArray = [
    '../model/beer_bottle/scene.gltf', // 병(유리)
    '../model/crumbled_paper/scene.gltf', // 종이
    '../model/garbage/scene.gltf', // 캔
    '../model/garbage_bag/scene.gltf', // 비닐
    '../model/plastic_water_bottle/scene.gltf' // 플라스틱
]; // GLTF 모델을 불러오기 위한 모델들의 경로 배열

var containerTextureArray = [
    '../model/texture_glass.jpg',
    '../model/texture_paper.jpg',
    '../model/texture_can.jpg',
    '../model/texture_vinyl.jpg',
    '../model/texture_pet.png'
];
var modelScaleArray = [0.5, 80, 140, 0.06, 0.7]; // GLTF 모델들의 각각 scale 값

class App {
    constructor() {
        // id가 webgl-container div 태그 객체 가져옴
        const divContainer = document.querySelector("#webgl-container");
        // divContainer를 클래스의 멤버로 지정 (다른 method에서 전역으로 참조하기 위함)
        this._divContainer = divContainer;

        /* DOM 객체 */
        const score = document.getElementById("score");
        this._score = score;

        const img = document.getElementById("img");
        this._img = img;

        const timeElement = document.getElementById("time");
        this._time = timeElement;

        // Renderer 객체 생성 (antialias 속성은 Scene이 렌더링될 때 오브젝트들의 경계선이 부드럽게 표현)
        const renderer = new THREE.WebGLRenderer({ antialias: true });

        // 픽셀의 Radio 속성 설정
        renderer.setPixelRatio(window.devicePixelRatio);

        // 그림자 허용
        renderer.shadowMap.enabled = true;

        // 생성된 Renderer의 domElement를 id가 webgl-container인 divContainer의 자식으로 추가
        // renderer.domElement는 canvas 타입의 dom 객체
        divContainer.appendChild(renderer.domElement);

        // 이 Renderer가 다른 method에서 참조할 수 있도록(전역으로 사용할 수 있도록) 클래스의 멤버변수로 정의
        this._renderer = renderer;

        // Scene 객체 생성 
        const scene = new THREE.Scene();
        // Scene 객체를 필드화
        this._scene = scene;

        this._setupCamera(); // 카메라 객체를 구성하는 메소드 호출
        this._setupLight(); // 광원을 설정하는 메소드 호출
        this._setupBackground(); // 배경을 설정하는 메소드 호출
        // this._setupModel(); // 3차원 모델을 설정하는 메소드 호출
        this._setupControls(); // 컨트롤을 설정하는 메소드 호출

        // 창 크기가 변경되면 발생하는 onsize 이벤트 지정(renderer나 camera는 창 크기가 변경될때마다 속성 값 재설정해줘야하기 때문)
        // bind 사용: resize method안에서 this가 가리키는 객체가 이벤트 객체가 아니 App 클래스의 객체가 되도록 하기 위함
        window.onresize = this.resize.bind(this);

        // resize 이벤트 상관 없이 한번 무조건 호출: renderer, camera의 속성을 창 크기에 맞게 초기화
        this.resize();

        /* 키보드 이벤트 */
        window.onkeydown = (e) => {
            switch (e.key) {
                case 'a':
                case 'ArrowLeft':
                    if (this._container.position.x > -(GROUND_SIZE / 2 - MOVE_STEP)) {
                        x -= MOVE_STEP;
                        this._container.position.x -= MOVE_STEP;
                    }
                    break;
                case 'd':
                case 'ArrowRight':
                    if (this._container.position.x < (GROUND_SIZE / 2 - MOVE_STEP)) {
                        x += MOVE_STEP;
                        this._container.position.x += MOVE_STEP;
                    }
                    break;
                case 'w':
                case 'ArrowUp':
                    if (this._container.position.z > -(GROUND_SIZE / 2 - MOVE_STEP)) {
                        z -= MOVE_STEP;
                        this._container.position.z -= MOVE_STEP;
                    }
                    break;
                case 's':
                case 'ArrowDown':
                    if (this._container.position.z < (GROUND_SIZE / 2 - MOVE_STEP)) {
                        z += MOVE_STEP;
                        this._container.position.z += MOVE_STEP;
                    }
                    break;
                case ' ':
                    if (this._container.position.y < LIMIT_CONTAINER_UP) {
                        this._container.position.y += JUMP_STEP;
                        y += JUMP_STEP;
                    }
                    break;
                case 'Shift':
                    if (this._container.position.y > LIMIT_CONTAINER_DOWN) {
                        this._container.position.y -= JUMP_STEP;
                        y -= JUMP_STEP;
                    }
                    break;
            }

            this._camera.position.set(x, y, z);
        };
        const timerId = setInterval(()=>{
            if(time < 0){
                clearInterval(this._timerId);
                return;
            }
            this._time.innerHTML = "Time: "+time;
            time--;
        }, 1000);

        this._timerId= timerId;
    }

    _setupControls() {
        var control = new THREE.OrbitControls(this._camera, this._divContainer);
        this._control = control;
    }

    _setupCamera() {
        // 3차원 그래픽을 출력할 영역에 대한 가로, 세로 크기 가져오기
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        // 카메라 객체 생성(PerspectiveCamera: 거리감(원근감), Orthographic: 원근감 없이 물체의 크기대로)
        // Perspective: 4개의 인자 (fovy, aspect, zNear, zFar) -> 절두체 생성
        // 절두체 안에 존재하는 물체가 카메라를 통해 화면상에 렌더링
        const camera = new THREE.PerspectiveCamera(
            80, // fovy: 절두체의 높이 방향에 대한 각도(단위: degree)
            width / height, // aspect: 절두체의 가로 길이를 세로 길이로 나눈 비율
            0.1, // zNear: 카메라로부터의 거리(카메라로부터 최소 지점, 앞부분)
            1000 // zFar: 카메라로부터의 거리(카메라로부터 최대 지점, 뒷부분) 
        );
        // (zNear ~ zFar) 거리 사이에 존재하는 물체의 일부만 렌더링됨, 이 영역 벗어나면 렌더링x

        // camera.zoom = 2; // 크기 조정(배수) -> Orthographic에만 적용?..

        camera.position.z = z; // 카메라의 z좌표 위치 변경
        camera.position.y = y; // 카메라의 y좌표 위치 변경
        // camera.rotation.set(Math.PI, 0, Math.PI /2);
        // camera.position.set(7, 7, 0); // 카메라의 위치를 (7, 7, 0)으로 배치
        camera.lookAt(0, 60, 0); // 카메라가 (0, 60, 0)을 바라보도록 설정 

        // 카메라 객체를 필드화
        this._camera = camera;
    }

    _setupLight() {
        const color = 0x666666; // 광원의 색
        const intensity = 1; // 광원의 세기(밝기)
        const light = new THREE.DirectionalLight(color, intensity); // 광원의 색과 세기를 인자 값으로 받아 생성
        this._light = light;
        light.position.set(0, 80, 0); // 광원의 위치 

        /* 광원의 그림자 효과를 위한 카메라 크기 지정 */
        light.shadow.camera.left = -350;
        light.shadow.camera.right = 350;
        light.shadow.camera.top = 350;
        light.shadow.camera.bottom = -350;

        light.castShadow = true; // 그림자 주기

        this._scene.add(light); // scene에 위에 생성한 광원 요소 추가

        // this._scene.add(new THREE.CameraHelper(light.shadow.camera));

    }

    _setupModel() {

        /* 바닥 Mesh 정의 */
        const groundGeometry = new THREE.BoxGeometry(GROUND_SIZE, GROUND_SIZE, 1);
        const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);

        ground.receiveShadow = true; // 그림자 받기
        ground.rotation.x = -Math.PI / 2; // 회전
        ground.position.y = -30; // y 좌표 이동
        this._scene.add(ground);

        const textureLoader = new THREE.TextureLoader();
        this._textureLoader = textureLoader;

        /* 쓰레기통 Mesh 정의 */
        const containerGeometry = new THREE.BoxGeometry(CONTAINER_SIZE, 6, CONTAINER_SIZE);

        var random = Math.floor(Math.random() * 5);
        currentGarbageIndex = random;
        this._img.src = containerTextureArray[random];
        const img = this._textureLoader.load(containerTextureArray[random]);
        
        const materials = [
            new THREE.MeshBasicMaterial({ map: img }),
            new THREE.MeshBasicMaterial({ map: img }),
            new THREE.MeshBasicMaterial({ map: img }),
            new THREE.MeshBasicMaterial({ map: img }),
            new THREE.MeshBasicMaterial({ map: img }),
            new THREE.MeshBasicMaterial({ map: img }),
        ];

        const container = new THREE.Mesh(containerGeometry, materials);
        container.position.y = -5;
        container.castShadow = true; // 그림자 주기

        this._container = container;
        this._scene.add(container);
        
        const loader = new THREE.GLTFLoader();
        this._loader = loader;
    }

    resize() {
        // 크기 가져오기
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        // 카메라 속성 값 지정
        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        // Renderer의 크기 설정
        this._renderer.setSize(width, height);
    }

    _setupBackground() {
        // 텍스쳐 로더 객체 생성(정방형맵 -> 하나의 이미지를 360도로 보이도록)
        // 큐브맵: 6개의 이미지를 정육면체로 맵을 구성 -> CubeTextureLoader()
        const loader = new THREE.TextureLoader();

        loader.load("../map/goegap.jpg", texture => {
            const renderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height);
            renderTarget.fromEquirectangularTexture(this._renderer, texture);
            this._scene.background = renderTarget.texture;
            this._setupModel();

            requestAnimationFrame(this.render.bind(this));

        });
    }

    render() {
        /* GLTF 모델이 다 만들어졌다면*/
        if (isAdded)
            this._createGarbage();

        if (garbages.length > 0) {
            var currentRandomIndex = Math.floor(Math.random() * garbages.length);
            var weight = 1 + (Math.random() * MAX_WEIGHT_SPEED);

            /* 현재 garbage가 y 좌표가 -30 미만이라면 (= 바닥에 닿았다면) */
            if (garbages[currentRandomIndex].position.y < THRESHOLD) {
                lastIndex = currentRandomIndex; // 지워지는 obj의 index 기록
                this._scene.remove(garbages[currentRandomIndex]); // scene에서 obj 제거
                flag = false;
            }
            else { // 안 닿았다면 현재 garbage를 떨어뜨리기
                garbages[currentRandomIndex].position.y -= INITIAL_DROP_SPEED * weight;
            }

            // 쓰레기통의 Bounding Box 구하기
            const containerBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            containerBB.setFromObject(this._container);

            // 현재 Garbage의 Bounding Box 구하기
            const garbageBB = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
            garbageBB.setFromObject(garbages[currentRandomIndex]);

            /* 쓰레기통과 현재 Garbage가 교차하면 (= 충돌하면) */
            if (containerBB.intersectsBox(garbageBB) && !isCollision) {
                // console.log("index: "+currentRandomIndex+" col: "+isCollision);

                /* 현재 garbage의 쓰레기 타입이 현재 쓰레기통의 맵핑 타입과 같다면 */
                if (garbages[currentRandomIndex].index != -1 && garbages[currentRandomIndex].index == currentGarbageIndex) {
                    point++; // 점수 추가
                    cumulPoint++; // 누적 점수 추가
                    isTimeAdded = false; // 시간 추가 flag 초기화
                }
                else {
                    if (point > 0 && garbages[currentRandomIndex].index != -1) {
                        point--; // 다른 타입과 충돌했다면 점수 차감
                    }
                }

                isCollision = true;
                this._scene.remove(garbages[currentRandomIndex]); // scene에서 obj 제거
                garbages[currentRandomIndex].index = -1; // 제거된 obj의 index -1로 초기화

                /* 누적 점수가 3점씩 추가될 때마다 */
                if(cumulPoint % 3 == 0 && !isTimeAdded){
                    time += 6; // 타이머 6초 추가
                    this._time.innerHTML = "Time: "+time;
                    isTimeAdded = true;
                }

                /* 현재 점수가 1 이상이고, 5의 배수 단위일 때 */
                if (point > 0 && point % 5 == 0) {
                    
                    var random = Math.floor(Math.random() * 5);
                    currentGarbageIndex = random; // 랜덤 값을 현재 쓰레기 카테고리로 지정
                    this._img.src = containerTextureArray[currentGarbageIndex];

                    // 해당하는 쓰레기 카테고리에 대응되는 텍스처 이미지를 쓰레기통에 씌우기
                    var loaded = this._textureLoader.load(containerTextureArray[random]);
                    this._container.material = [
                        new THREE.MeshBasicMaterial({ map: loaded }),
                        new THREE.MeshBasicMaterial({ map: loaded }),
                        new THREE.MeshBasicMaterial({ map: loaded }),
                        new THREE.MeshBasicMaterial({ map: loaded }),
                        new THREE.MeshBasicMaterial({ map: loaded }),
                        new THREE.MeshBasicMaterial({ map: loaded }),
                    ];
                }

                flag = false;
                lastIndex = currentRandomIndex;
                console.log("point: " + point);
                this._score.innerHTML = 'Score: '+point;
            }
            isCollision = false;
        }

        this._renderer.render(this._scene, this._camera);
        // this._control.update();
        requestAnimationFrame(this.render.bind(this));
    }

    createDonut() {
        var geometry = new THREE.TorusGeometry(1, 0.5, 5, 30);
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff * Math.random });
        var donut = new THREE.Mesh(geometry, material);

        donut.position.x = this.randomRange(-15, 15);
        donut.position.z = this.randomRange(-15, 15);
        donut.position.y = 10;

        if (garbages.length < TOTAL_GALBAGE) {
            garbages.push(donut);
            this._scene.add(donut);
        }
        else if (garbages.length == TOTAL_GALBAGE && !flag) {
            flag = true;
            garbages[lastIndex] = donut;
            this._scene.add(donut);
        }

    }

    randomRange(from, to) {
        var x = Math.random() * (to - from);
        return x + from;
    }

    _createGarbage() {
        var that = this;

        if (garbages.length < TOTAL_GALBAGE) {
            isAdded = false;
            var randomIndex = Math.floor(Math.random() * 5);

            this._loader.load(modelPathArray[randomIndex], function (gltf) {

                gltf.scene.scale.set(
                    modelScaleArray[randomIndex],
                    modelScaleArray[randomIndex],
                    modelScaleArray[randomIndex]);
                gltf.scene.position.x = that.randomRange(-(GROUND_SIZE / 2), GROUND_SIZE / 2);
                gltf.scene.position.z = that.randomRange(-(GROUND_SIZE / 2), GROUND_SIZE / 2);
                gltf.scene.position.y = GARBAGE_SPAWN_Y;

                gltf.scene.index = randomIndex;

                // GLTF 모델을 traverse 하면서 현재 node 값에 해당하는 obj에 그림자 받기/주기 설정
                gltf.scene.traverse(function (node) {
                    if (node.isMesh || node.isLight) node.castShadow = true;
                    if (node.isMesh || node.isLight) node.receiveShadow = true;
                });

                garbages.push(gltf.scene);
                that._scene.add(gltf.scene);

                isAdded = true;
            }, undefined, (error) => {
                console.log(error);
            });

        }
        else if (garbages.length == TOTAL_GALBAGE && !flag) {
            isAdded = false;
            var randomIndex = Math.floor(Math.random() * 5);

            this._loader.load(modelPathArray[randomIndex], function (gltf) {

                gltf.scene.scale.set(
                    modelScaleArray[randomIndex],
                    modelScaleArray[randomIndex],
                    modelScaleArray[randomIndex]);

                gltf.scene.position.x = that.randomRange(-(GROUND_SIZE / 2), GROUND_SIZE / 2);
                gltf.scene.position.z = that.randomRange(-(GROUND_SIZE / 2), GROUND_SIZE / 2);
                gltf.scene.position.y = GARBAGE_SPAWN_Y;

                gltf.scene.index = randomIndex;

                gltf.scene.traverse(function (node) {
                    if (node.isMesh || node.isLight) node.castShadow = true;
                    if (node.isMesh || node.isLight) node.receiveShadow = true;
                });

                garbages[lastIndex] = gltf.scene;
                that._scene.add(gltf.scene);

                flag = true;
                isAdded = true;

            }, undefined, (error) => {
                console.log(error);
            });
        }
    }
}

// 페이지가 모두 로드가 되면 위에 만든 클래스에 대한 인스턴스 생성
window.onload = function () {
    new App();
}