(function(global) {
  class iceberg extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.cube = new THREE.Mesh(
        new THREE.BoxGeometry(50, 50, 50),
        new THREE.MeshLambertMaterial({ color: 0xffffff }));
      this.scene.add(this.cube);

      var light = new THREE.DirectionalLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 200;
      this.scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    }

    update(frame) {
      super.update(frame);

      this.cube.rotation.x = Math.sin(frame / 100);
      this.cube.rotation.y = Math.cos(frame / 100);
    }
  }

  global.iceberg = iceberg;
})(this);
