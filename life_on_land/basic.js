import * as THREE from 'three'; // three.js 라이브러리 import
import { OrbitControls} from '../build/OrbitControls.js'; // 마우스 컨트롤을 할 수 있도록 하는 OribitControls 클래스 import  

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
var x = 0;
var y = 0;
var z = 20;
class App{
    constructor(){
        // id가 webgl-container div 태그 객체 가져옴
        const divContainer = document.querySelector("#webgl-container");
        // divContainer를 클래스의 멤버로 지정 (다른 method에서 전역으로 참조하기 위함)
        this._divContainer = divContainer; 

        // Renderer 객체 생성 (antialias 속성은 Scene이 렌더링될 때 오브젝트들의 경계선이 부드럽게 표현)
        const renderer = new THREE.WebGLRenderer({antialias: true});

        // 픽셀의 Radio 속성 설정
        renderer.setPixelRatio(window.devicePixelRatio);

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

        window.onkeydown = (e) => {
            switch(e.key){
                case 'a':
                    x -= 2;
                    break;
                case 'd':
                    x += 2;
                    break;
                case 'w':
                    z-= 2;
                    break;
                case 's':
                    z += 2;
                    break;
                case ' ':
                    y += 2;
                    break;
                case 'Shift':
                    y -= 2;
                    break;
            }

            this._camera.position.set(x, y ,z);
        };

    }

    _setupControls(){
        new OrbitControls(this._camera, this._divContainer);
    }

    _setupCamera(){
        // 3차원 그래픽을 출력할 영역에 대한 가로, 세로 크기 가져오기
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        // 카메라 객체 생성(PerspectiveCamera: 거리감(원근감), Orthographic: 원근감 없이 물체의 크기대로)
        // Perspective: 4개의 인자 (fovy, aspect, zNear, zFar) -> 절두체 생성
            // 절두체 안에 존재하는 물체가 카메라를 통해 화면상에 렌더링
        const camera = new THREE.PerspectiveCamera(
            75, // fovy: 절두체의 높이 방향에 대한 각도(단위: degree)
            width / height, // aspect: 절두체의 가로 길이를 세로 길이로 나눈 비율
            0.1, // zNear: 카메라로부터의 거리(카메라로부터 최소 지점, 앞부분)
            100 // zFar: 카메라로부터의 거리(카메라로부터 최대 지점, 뒷부분) 
        );
        // (zNear ~ zFar) 거리 사이에 존재하는 물체의 일부만 렌더링됨, 이 영역 벗어나면 렌더링x
        
        // camera.zoom = 2; // 크기 조정(배수) -> Orthographic에만 적용?..

        camera.position.z = 20; // 카메라의 z좌표 위치 변경
        // camera.position.x = -3; // 카메라의 x좌표 위치 변경

        // camera.position.set(7, 7, 0); // 카메라의 위치를 (7, 7, 0)으로 배치
        // camera.lookAt(0, 0, 0); // 카메라가 원점인 (0, 0, 0)을 바라보도록 설정 
        
        // 카메라 객체를 필드화
        this._camera = camera;
    }

    _setupLight(){
        const color= 0xffffff; // 광원의 색
        const intensity = 1; // 광원의 세기(밝기)
        const light = new THREE.DirectionalLight(color, intensity); // 광원의 색과 세기를 인자 값으로 받아 생성
        light.position.set(-1, 2, 4); // 광원의 위치 
        this._scene.add(light); // scene에 위에 생성한 광원 요소 추가
    }

    _setupModel(){

        // const geometry = new THREE.BoxGeometry(1, 1, 1); // 정육면체에 대한 형상 정의 -> geometry 객체 생성
            // 인자 값은 각각 가로, 세로, 깊이

        // const material = new THREE.MeshPhongMaterial({color: 0x44a88});
            // 정육면체의 재질을 정의하기 위한 material 객체

        // const cube = new THREE.Mesh(geometry, material);
            // Mesh 생성, 형상과 재질을 인자로 받으면서

        // this._scene.add(cube); // Scene에 위 Mesh를 추가
        

        /* Scene Graph 이용 */ 
        
        const solarSystem = new THREE.Object3D();
        this._scene.add(solarSystem);

        const radius = 1;
        const widthSegments = 72;
        const heightSegments = 72;
        const sphereGeometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);

        const sunMaterial = new THREE.MeshPhongMaterial({
            emissive: 0xff0000, flatShading: true
        });

        const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
        sunMesh.scale.set(3, 3, 3);
        solarSystem.add(sunMesh);

        const earthOrbit = new THREE.Object3D();
        solarSystem.add(earthOrbit);

        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2233ff, emissive: 0x112244, flatShading: true
        });

        const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
        earthOrbit.position.x = 10;
        earthOrbit.add(earthMesh);

        const moonOrbit = new THREE.Object3D();
        moonOrbit.position.x = 2; // 태양으로부터 거리가 10 + 2 만큼 떨어지게됨
        earthOrbit.add(moonOrbit);

        const moonMaterial = new THREE.MeshPhongMaterial({
            color: 0x888888, emissive: 0x222222, flatShading: true
        });

        const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
        moonMesh.scale.set(0.5, 0.5, 0.5);
        moonOrbit.add(moonMesh);

        this._solarSystem = solarSystem;
        this._earthOrbit = earthOrbit;
        this._moonOrbit = moonOrbit;
    }

    resize(){
        // 크기 가져오기
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        // 카메라 속성 값 지정
        this._camera.aspect = width / height; 
        this._camera.updateProjectionMatrix();

        // Renderer의 크기 설정
        this._renderer.setSize(width, height);
    }

    _setupBackground(){
        // 텍스쳐 로더 객체 생성(정방형맵 -> 하나의 이미지를 360도로 보이도록)
            // 큐브맵: 6개의 이미지를 정육면체로 맵을 구성 -> CubeTextureLoader()
        const loader = new THREE.TextureLoader(); 
        
        loader.load("../map/goegap.jpg", texture => {
            const renderTarget = new THREE.WebGLCubeRenderTarget(texture.image.height);
            renderTarget.fromEquirectangularTexture(this._renderer, texture);
            this._scene.background = renderTarget.texture;
            this._setupModel();

            requestAnimationFrame(this.render.bind(this));

        })
    }
    render(time){
        // time 인자는 렌더링이 처음 시작된 이후 경과된 시간 값 (millisec)

        // Renderer가 Scene을 카메라의 시점으로 렌더링을 하라는 코드
        this._renderer.render(this._scene, this._camera);

        // 속성 값 변경함으로써 애니메이션 효과 발생
        this.update(time);

        // render 메소드가 무한으로 반복하여 호출
        requestAnimationFrame(this.render.bind(this));
    }

    update(time){
        time *= 0.001; // 1/1000을 곱해서 단위를 sec 단위로 변환

        /* Mesh들의 transformation */

        // this._cube.rotation.x = time;
        // this._cube.rotation.y = time;
        this._solarSystem.rotation.y = time / 2;
        this._earthOrbit.rotation.y = time * 2;
        this._moonOrbit.rotation.y = time * 5;

        // 카메라의 위치가 Moon Mesh의 위치로 계속 업데이트
        // this._moonOrbit.getWorldPosition(this._camera.position); 
    }
}

// 페이지가 모두 로드가 되면 위에 만든 클래스에 대한 인스턴스 생성
window.onload = function(){
    new App();
}