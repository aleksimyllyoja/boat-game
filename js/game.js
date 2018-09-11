var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
scene.fog = new THREE.FogExp2( 0xffffff, 0.0025);

camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);


//camera.position.set(0, 0, 1200);
camera.position.set(0, -300, 140);

camera.lookAt(0, 0, 0);

var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);

var uniforms = {
  time: {
    value: 1.0
  },
  speed: {
    value: 0.0
  },
  rotation: {
    value: 0.0
  }
};

var oceanGeometry = new THREE.PlaneGeometry(1200, 1200, 0);

var oceanMaterial = new THREE.ShaderMaterial({
  uniforms: uniforms,
	vertexShader: document.getElementById( 'vertexShader' ).textContent,
	fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
  transparent: true
});
var ocean = new THREE.Mesh( oceanGeometry, oceanMaterial );
ocean.rotation.x = -Math.PI/2;


ocean.add(camera);
scene.add(ocean);

light = new THREE.HemisphereLight(0xffffff, 0x444444);
light.position.set(0, 200, 0);
scene.add(light);

var loader = new THREE.GLTFLoader();

var boat;
var loaded = false;
var keys = {};
var rotationy0 = -Math.PI/2;

// Load a glTF resource
loader.load(
	// resource URL
	'data/HouseBoat_1384.gltf',
	// called when the resource is loaded
	function ( gltf ) {

		ocean.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Scene
		gltf.scenes; // Array<THREE.Scene>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

    boat = gltf.scene.children[0];

    boat.position.set(2, -3, -3);
    boat.scale.set(0.4, 0.4, 0.4);

    boat.rotation.x = Math.PI/2;
    boat.rotation.y = rotationy0;

    loaded = true;
	}
);

var geometry = new THREE.BoxBufferGeometry( 4, 4, 4 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00, transparent: true } );

mesh = new THREE.Mesh( geometry, material );
scene.add(mesh);

var course = 0;

mesh.position.set(10, 0, -200);

var rotationSpeed = 0.002;
var maxRotation = 0.2;

function rx(x, y, a) {
  return Math.cos(a)*x+y*Math.sin(a);
}

function ry(x, y, a) {
  return -Math.sin(a)*x+y*Math.cos(a);
}

function steerBoatLeft() {
  boat.rotation.y = Math.min(rotationy0+maxRotation, boat.rotation.y+rotationSpeed);
}

function steerBoatRight() {
  boat.rotation.y = Math.max(rotationy0-maxRotation, boat.rotation.y-rotationSpeed);
}

function tiltBoat() {
  boat.rotation.x = Math.min(0.2, boat.rotation.x+0.001);
}

function eff() {
  uniforms.speed.value = Math.min(1, uniforms.speed.value+0.01);
}

function handleKeys() {
  if(keys[37]) {
    steerBoatLeft();
    eff();
  }
  if(keys[39]) {
    steerBoatRight();
    eff();
  }
  if(keys[38]) {
    eff();
  }

  if(!keys[39] && !keys[37] && !keys[38]){
      var dy = Math.PI/2+boat.rotation.y;
      var ds = uniforms.speed.value;

      if(Math.abs(dy) > 0.0001) {
        boat.rotation.y -= dy/100;
      } else {
        boat.rotation.y = rotationy0;
      }
      if(Math.abs(ds) > 0.0001) {
        uniforms.speed.value -= ds/300;
      }
    }
}

function animate( timestamp ) {
  if(loaded) {
    handleKeys();

    uniforms.rotation.value = boat.rotation.y+Math.PI/2;
    boat.position.z = -2+Math.cos(timestamp/400)*1-1;

    ocean.rotation.z += (boat.rotation.y+Math.PI/2.0)*0.01;
    ocean.position.z += -0.14*Math.cos(ocean.rotation.z);
    ocean.position.x += -0.14*Math.sin(ocean.rotation.z);

    if(mesh.position.distanceTo(ocean.position) < 50) {
      mesh.position.x = (Math.random()-0.5)*200;
    }
  }

  mesh.position.y = -2+Math.cos(timestamp/400)+1;
  mesh.material.opacity = (240-mesh.position.distanceTo(ocean.position))/300.0;


  uniforms.time.value = timestamp / 1000;
  renderer.render( scene, camera );
  requestAnimationFrame(animate);
}

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    keys[event.which] = true;
};

document.addEventListener("keyup", onDocumentKeyUp, false);
function onDocumentKeyUp(event) {
    keys[event.which] = false;
};

animate();
