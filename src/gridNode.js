(function (global) {
  class gridNode extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.cube = new THREE.Mesh(new THREE.BoxGeometry(100, 5, 5),
        new THREE.MeshBasicMaterial({ color: 0x000fff }));
      this.scene.add(this.cube);

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 100;
    }

    update(frame) {
      super.update(frame);

      this.cube.rotation.x = Math.sin(frame / 20);
      this.cube.rotation.y = Math.cos(frame / 20);
    }
  }

  global.gridNode = gridNode;
})(this);
