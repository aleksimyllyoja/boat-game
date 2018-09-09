var scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(300, 100, 300);
camera.lookAt(0, 0, 0);

scene.background = new THREE.Color( 0xffffff );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

controls = new THREE.OrbitControls( camera, renderer.domElement );

var geometry = new THREE.PlaneGeometry(400, 400, 0);

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

// Load a glTF resource
loader.load(
	// resource URL
	'/data/Sailboat.gltf',
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Scene
		gltf.scenes; // Array<THREE.Scene>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
    console.log(gltf);

    gltf.scene.children[0].position.x = -80;
    gltf.scene.children[0].position.y = -4;
    gltf.scene.children[0].position.z = 140;

    gltf.scene.children[0].rotation.y = Math.PI/4.0

    gltf.scene.children[0].scale.x = 0.1;
    gltf.scene.children[0].scale.y = 0.1;
    gltf.scene.children[0].scale.z = 0.1;
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

function animate( timestamp ) {
  requestAnimationFrame( animate );
  uniforms.time.value = timestamp / 1000;
  renderer.render( scene, camera );
}
animate();
