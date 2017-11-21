(function(global) {
  class Laser {
    constructor() {
      this.object3d = new THREE.Object3D();

      const canvas = this.generateLaserBodyCanvas();
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        blending : THREE.AdditiveBlending,
        color: 0x4444aa,
        side: THREE.DoubleSide,
        depthWrite: false,
        transparent: true,
      });
      const geometry = new THREE.PlaneGeometry(1, 0.1);
      const numberOfPlanes = 16;
      for (var i = 0; i < numberOfPlanes; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 1 / 2;
        mesh.rotation.x = i/numberOfPlanes * Math.PI;
        this.object3d.add(mesh);
      }

      const particleTexture = Loader.loadTexture('res/blue_particle.jpg');
      const particleMaterial = new THREE.SpriteMaterial({
        map: particleTexture,
        blending: THREE.AdditiveBlending,
      });

      const sprite = new THREE.Sprite(particleMaterial);
      sprite.scale.x = 0.5;
      sprite.scale.y = 2;

      sprite.position.x = 1 - 0.01;
      this.object3d.add(sprite);

      // add a point light
      const light = new THREE.PointLight(0x4444ff);
      light.intensity = 0.5;
      light.distance = 4;
      light.position.x = -0.05;
      sprite.add(light);
    }

    generateLaserBodyCanvas(){
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 1;
      canvas.height = 64;

      var gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0  , 'rgba(  0,  0,  0,0.1)');
      gradient.addColorStop(0.1, 'rgba(160,160,160,0.3)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
      gradient.addColorStop(0.9, 'rgba(160,160,160,0.3)');
      gradient.addColorStop(1.0, 'rgba(  0,  0,  0,0.1)');

      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      return canvas;
    }

    update(t) {
      this.object3d.scale.x = lerp(0, 10, t);
      this.object3d.position.y = lerp(1, 11, t);
    }
  }

  global.Laser = Laser;
})(this);
