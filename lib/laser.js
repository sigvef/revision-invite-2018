(function(global) {
  class Laser {
    constructor() {
      this.object3d = new THREE.Object3D();

      const canvas = this.generateLaserBodyCanvas();
      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      this.shaker = new THREE.Object3D();
      this.shaker.frustumCulled = false;
      this.object3d.add(this.shaker);
      this.object3d.frustumCulled = false;

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        blending : THREE.AdditiveBlending,
        color: 0x449955,
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: true,
        transparent: true,
      });
      const geometry = new THREE.PlaneGeometry(1, 0.1);
      const numberOfPlanes = 16;
      for (var i = 0; i < numberOfPlanes; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = 1 / 2;
        mesh.rotation.x = i / numberOfPlanes * Math.PI * 2;
        this.shaker.add(mesh);
        mesh.frustumCulled = false;
      }

      const particleTexture = Loader.loadTexture('res/blue_particle.jpg');
      const particleMaterial = new THREE.SpriteMaterial({
        map: particleTexture,
        blending: THREE.AdditiveBlending,
      });

      const sprite = new THREE.Sprite(particleMaterial);
      sprite.scale.x = 0.5;
      sprite.scale.y = 2;
      sprite.frustumCulled = false;

      sprite.position.x = 1 - 0.01;
      this.object3d.add(sprite);
      this.sprite = sprite;
    }

    update() {
      this.sprite.scale.x = 0.5 / this.object3d.scale.x;
      this.sprite.scale.y = 0.5 / this.object3d.scale.y;
      const scale = 1 + (Math.random() - 0.5) * 0.9;
      this.shaker.scale.y = scale;
      this.shaker.scale.z = scale;
      this.shaker.position.y = (Math.random() - 0.5) * 0.05;
      this.shaker.position.z = (Math.random() - 0.5) * 0.05;
      this.sprite.material.rotation = Math.random() * Math.PI * 2;
      const color = 1 + 0.5 * Math.random();
      this.sprite.material.color = new THREE.Color(color, color, color);
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
  }

  global.Laser = Laser;
})(this);
