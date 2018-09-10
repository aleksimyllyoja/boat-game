var scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 100, 300);
camera.lookAt(0, 0, 0);

scene.background = new THREE.Color( 0xffffff );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

scene.fog = new THREE.FogExp2( 0xffffff, 0.0025 );

var geometry = new THREE.PlaneGeometry(1200, 1200, 0);

var uniforms = {
  time: {
    value: 1.0
  },
  speed: {
    value: 0.0
  }
};

var material = new THREE.ShaderMaterial({
  uniforms: uniforms,
	vertexShader: document.getElementById( 'vertexShader' ).textContent,
	fragmentShader: document.getElementById( 'fragmentShader' ).textContent
});
material.transparent = true;

var plane = new THREE.Mesh( geometry, material );

scene.add(plane);

plane.rotation.x = -Math.PI/2;

light = new THREE.HemisphereLight(0xffffff, 0x444444);
light.position.set(0, 200, 0);
scene.add(light);

var loader = new THREE.GLTFLoader();

var boat;
var loaded = false;
// Load a glTF resource
loader.load(
	// resource URL
	'/data/HouseBoat_1384.gltf',
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Scene
		gltf.scenes; // Array<THREE.Scene>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

    boat = gltf.scene.children[0];

    boat.position.set(0, -3, 0);
    boat.scale.set(0.4, 0.4, 0.4);
    boat.rotation.y = -1.6;

    loaded = true;
	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

var cg = new THREE.CylinderGeometry(1, 1, 30, 8, 1, false, 0, 2*Math.PI);

var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var cube = new THREE.Mesh( cg, material );

cube.position.set(10, 5, -950);
cube.rotation.set(0.2, 0.4, 0.1);

scene.add(cube);

var keys = {};

var throttle = 0;

function resetCube() {
  cube.position.set(Math.cos(Math.random()*2*Math.PI)*100, 0, -550);
  cube.rotation.set(0.2, 0.4, Math.cos(Math.random()*2*Math.PI)*0.2);
  if(Math.random() < 0.5) {
    cube.material = new THREE.MeshBasicMaterial( { color: 0x00ee00 } );
  } else {
    cube.material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  }
}

var sinkSpeed = 0;

function animate( timestamp ) {

  if(loaded) {
    if(keys[37]) {
      boat.rotation.y = Math.min(-1.2, boat.rotation.y+0.01);
      boat.rotation.x = Math.min(0.2, boat.rotation.x+0.001);
      boat.rotation.z = Math.max(-0.01, boat.rotation.z-0.001);
      uniforms.speed.value += 0.01;

      uniforms.speed.value = Math.min(1, uniforms.speed.value+0.01);

      camera.position.z = Math.min(390, camera.position.z+0.2);

      cube.position.x += 0.4;

    }
    if(keys[39]) {
      boat.rotation.y = Math.max(-1.9, boat.rotation.y-0.01);
      boat.rotation.x = Math.min(0.2, boat.rotation.x+0.001);
      boat.rotation.z = Math.max(-0.01, boat.rotation.z-0.001);

      uniforms.speed.value = Math.min(1, uniforms.speed.value+0.01);

      camera.position.z = Math.min(390, camera.position.z+0.2);

      cube.position.x -= 0.4;

    }
    if(keys[38]) {

      boat.rotation.x = Math.min(0.2, boat.rotation.x+0.001);
      boat.rotation.z = Math.max(-0.01, boat.rotation.z-0.001);

      uniforms.speed.value = Math.min(1, uniforms.speed.value+0.01);
      throttle = Math.min(1, throttle+0.01);

      camera.position.z = Math.min(390, camera.position.z+0.5);
    }

    if(!keys[39] && !keys[37]){
      var d = -1.55-boat.rotation.y;
      var dx = boat.rotation.x;
      var dz = boat.rotation.z;
      var ds = uniforms.speed.value;
      var cc = camera.position.z-300;

      if(Math.abs(d) > 0.01) {
        boat.rotation.y += d/100;
      }

      if(Math.abs(dx) > 0.01) {
        boat.rotation.x -= dx/100;
      }

      if(Math.abs(dz) > 0.01) {
        boat.rotation.z -= dz/100;
      }

      if(Math.abs(ds) > 0.01) {
        uniforms.speed.value -= ds/100;
      }

      if(throttle > 0.01) {
        throttle -= 0.01;
      }

      if(Math.abs(cc) > 0.01) {
        camera.position.z -= cc/100;
      }
    }

    if(cube.position.z >= 40) {
      //resetCube();
      sinkSpeed = 0.5;
    }

    if(sinkSpeed > 0) {
      boat.rotation.x = Math.min(boat.rotation.x+0.03, Math.PI/2.0);
      boat.position.y -= sinkSpeed;
    }
  }

  cube.position.z += 1.0+throttle;
  cube.position.y = 5+Math.cos(timestamp/200)*1;

  if(Math.sqrt(Math.pow(cube.position.z, 2) + Math.pow(cube.position.x, 2)) <= 30) {
     resetCube();
  }

  uniforms.time.value = timestamp / 1000;
  renderer.render( scene, camera );
  requestAnimationFrame(animate);
}
animate();

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    keys[event.which] = true;
};

document.addEventListener("keyup", onDocumentKeyUp, false);
function onDocumentKeyUp(event) {
    keys[event.which] = false;
};
