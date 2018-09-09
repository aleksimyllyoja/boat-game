var scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 100, 400);
camera.lookAt(0, 0, 0);

scene.background = new THREE.Color( 0xffffff );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

var geometry = new THREE.PlaneGeometry(900, 900, 0);

var uniforms = {
  time: { value: 1.0 }
};

var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
material.transparent = true;

var sky = new THREE.Mesh( geometry, material );

sky.position.set(0, 0, -250);

//scene.add(sky);

scene.fog = new THREE.FogExp2( 0xffffff, 0.0015 );

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
    /*
    gltf.scene.children[0].position.x = 0;
    gltf.scene.children[0].position.y = -5;
    gltf.scene.children[0].position.z = 0;
    */

    //boat.rotation.y = Math.PI/;
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

var cg = new THREE.CubeGeometry(10, 50, 10);

var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var cube = new THREE.Mesh( cg, material );

cube.position.set(10, 0, -250);
cube.rotation.set(0.2, 0.4, 0.9);

scene.add(cube);

var keys = {};

function animate( timestamp ) {

  if(loaded) {
    if(keys[37]) {
      boat.rotation.y = Math.min(-1.2, boat.rotation.y+0.002);
      boat.rotation.x = Math.min(0.2, boat.rotation.x+0.001);
      boat.rotation.z = Math.max(-0.01, boat.rotation.z-0.001);
      uniforms.speed.value += 0.01;

      uniforms.speed.value = Math.min(1, uniforms.speed.value+0.01);


      cube.position.x += 0.4;

    } else if(keys[39]) {
      boat.rotation.y = Math.max(-1.9, boat.rotation.y-0.002);
      boat.rotation.x = Math.min(0.2, boat.rotation.x+0.001);
      boat.rotation.z = Math.max(-0.01, boat.rotation.z-0.001);

      uniforms.speed.value = Math.min(1, uniforms.speed.value+0.01);

      cube.position.x -= 0.4;
    } else {
      var d = -1.55-boat.rotation.y;
      var dx = boat.rotation.x;
      var dz = boat.rotation.z;
      var ds = uniforms.speed.value;

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
    }
  }

  cube.position.z += 0.6;

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
