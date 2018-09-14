var scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0xffffff, 0.0025);

var camera = new THREE.PerspectiveCamera(40, window.innerWidth/window.innerHeight, 1, 10000);
camera.position.set(0, -300, 140);
camera.lookAt(0, 0, 0);

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffffff, 0.0);
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

var light = new THREE.HemisphereLight(0xffeeff, 0x444444);
light.position.set(0, 300, 0);
scene.add(light);

var loader = new THREE.GLTFLoader();
var boat;
var loaded = false;
var rotationy0 = -Math.PI/2;
var spotLight;

loader.load(
	'data/HouseBoat_1384.gltf',
	function(gltf) {
    boat = gltf.scene.children[0];
    boat.position.set(2, -3, -3);
    boat.scale.set(0.4, 0.4, 0.4);
    boat.rotation.x = Math.PI/2;
    boat.rotation.y = rotationy0;

    ocean.add(boat);

    loaded = true;
	}
);

var keys = {};
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
  uniforms.speed.value = Math.min(1, uniforms.speed.value+0.1);
}

function rockTheBoat(timestamp) {
  boat.position.z = -2+Math.cos(timestamp/400)*1-1;
}

var ARROW_LEFT = 37;
var ARROW_RIGHT = 39;
var ARROW_UP = 38;

function handleKeys() {
  if(keys[ARROW_LEFT]) {
    steerBoatLeft();
    eff();
  }
  if(keys[ARROW_RIGHT]) {
    steerBoatRight();
    eff();
  }
  if(keys[ARROW_UP]) {
    eff();
  }

  if(!keys[ARROW_LEFT] && !keys[ARROW_RIGHT] && !keys[ARROW_UP]) {
      var dy = Math.PI/2+boat.rotation.y;
      var ds = uniforms.speed.value;
      acc = new THREE.Vector2(0, 0);

      if(Math.abs(dy) > 0.0001) {
        boat.rotation.y -= dy/100;
      } else {
        boat.rotation.y = rotationy0;
      }
      if(Math.abs(ds) > 0.0001) {
        uniforms.speed.value -= ds/400;
      }
    }
}

function moveTheBoat(timestamp) {
  uniforms.rotation.value = boat.rotation.y+Math.PI/2;
  ocean.rotation.z += 0.01*(boat.rotation.y+Math.PI/2);

  var c = ocean.rotation.z+Math.PI/2;
  ocean.position.x += 0.1*Math.cos(c);
  ocean.position.z += -0.1*Math.sin(c);
}

function animate( timestamp ) {
  if(loaded) {
    handleKeys();

    rockTheBoat(timestamp);
    moveTheBoat(timestamp);
  }

  uniforms.time.value = timestamp/1000;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

window.onkeydown = function (event) { keys[event.which] = true; };

window.onkeyup = function (event) { keys[event.which] = false; };

window.onresize = function () {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

animate();
