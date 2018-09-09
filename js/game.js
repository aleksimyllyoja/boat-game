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

scene.add(sky);

//scene.fog = new THREE.FogExp2( 0xffffff, 0.0025 );

var geometry = new THREE.PlaneGeometry(1200, 1200, 0);

var uniforms = {
  time: { value: 1.0 }
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
    boat.rotation.y = -1.5;
    /*
    gltf.scene.children[0].position.x = 0;
    gltf.scene.children[0].position.y = -5;
    gltf.scene.children[0].position.z = 0;
    */

    //boat.rotation.y = Math.PI/;
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

var cg = new THREE.CubeGeometry(10, 10, 10);

var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var cube = new THREE.Mesh( cg, material );

cube.position.set(10, 100, -250);

scene.add(cube);


function animate( timestamp ) {
  requestAnimationFrame( animate );
  uniforms.time.value = timestamp / 1000;
  renderer.render( scene, camera );

//  if(d != 0) boat.rotation.y = Math.min(boat.rotation.y+0.05, -0.8);
}
animate();


document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 37) {
      boat.rotation.y = Math.min(boat.rotation.y+0.05, -0.8);
    } else if (keyCode == 39) {
      boat.rotation.y = Math.max(boat.rotation.y-0.05, -2.2);
    }
};
