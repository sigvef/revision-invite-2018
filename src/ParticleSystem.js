function ParticleSystem(options) {
  this.options = options;
  var amount = 10000;
  var positions = new Float32Array(amount * 3);
  this.velocities = new Float32Array(amount * 3);
  var colors = new Float32Array(amount * 3);
  var sizes = new Float32Array(amount);
  this.particleGeometry = new THREE.Geometry();
  this.particleGeometry = new THREE.BufferGeometry();
  this.index = 0;
  this.particleGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
  this.particleGeometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
  this.particleGeometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
  const sprite = new THREE.CanvasTexture(generateSprite());
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      amplitude: {value: 1.0},
      color:     {value: new THREE.Color(0xffffff)},
      texture:   {value: sprite},
      gu:   {value: GU},
    },
    vertexShader:   ParticleSystem.vertexShader,
    fragmentShader: ParticleSystem.fragmentShader,
    blending:       THREE.AdditiveBlending,
    depthTest:      true,
    transparent:    true,
  });
  this.particles = new THREE.Points(this.particleGeometry, particleMaterial);
  this.particleMaterial = particleMaterial;
}

ParticleSystem.prototype.spawn = function(position, velocity, size) {
  this.index = (this.index + 1) % this.particleGeometry.attributes.size.array.length;
  this.particleGeometry.attributes.position.array[this.index * 3] = position.x;
  this.particleGeometry.attributes.position.array[this.index * 3 + 1] = position.y;
  this.particleGeometry.attributes.position.array[this.index * 3 + 2] = position.z;
  this.particleGeometry.attributes.customColor.array[this.index * 3] = this.options.color.r;
  this.particleGeometry.attributes.customColor.array[this.index * 3 + 1] = this.options.color.g;
  this.particleGeometry.attributes.customColor.array[this.index * 3 + 2] = this.options.color.b;
  this.velocities[this.index * 3] = velocity.x;
  this.velocities[this.index * 3 + 1] = velocity.y;
  this.velocities[this.index * 3 + 2] = velocity.z;
  this.particleGeometry.attributes.size.array[this.index] = size || 20;
};

ParticleSystem.prototype.update = function() {
  const attributes = this.particleGeometry.attributes;
  for(var i = 0; i < attributes.size.array.length; i++) {
    //attributes.size.array[i] *= 0.95;
    attributes.position.array[i * 3] += this.velocities[i * 3];
    attributes.position.array[i * 3 + 1] += this.velocities[i * 3 + 1];
    attributes.position.array[i * 3 + 2] += this.velocities[i * 3 + 2];
  }
  attributes.size.needsUpdate = true;
};

ParticleSystem.prototype.render = function() {
  this.particleGeometry.attributes.size.needsUpdate = true;
  this.particleGeometry.attributes.position.needsUpdate = true;
  this.particleGeometry.attributes.customColor.needsUpdate = true;
  this.particleMaterial.uniforms.gu.value = GU;
};

function generateSprite() {
  var canvas = document.createElement( 'canvas' );
  canvas.width = 16;
  canvas.height = 16;
  var context = canvas.getContext( '2d' );
  var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
  gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
  gradient.addColorStop( 0.2, 'rgba(255,255,255,1)' );
  gradient.addColorStop( 0.4, 'rgba(64,64,64,1)' );
  gradient.addColorStop( 1, 'rgba(0,0,0,1)' );
  context.fillStyle = gradient;
  context.fillRect( 0, 0, canvas.width, canvas.height );
  return canvas;
}

ParticleSystem.vertexShader = `
uniform float amplitude;
uniform float gu;
attribute float size;
attribute vec3 customColor;

varying vec3 vColor;

void main() {
  vColor = customColor;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_PointSize = size * ( 300.0 / -mvPosition.z * gu);
  gl_Position = projectionMatrix * mvPosition;
}
`;


ParticleSystem.fragmentShader = `
uniform vec3 color;
uniform sampler2D texture;

varying vec3 vColor;

void main() {
  gl_FragColor = vec4(color * vColor, 1.0);
  gl_FragColor = gl_FragColor * texture2D(texture, gl_PointCoord);
}
`;
