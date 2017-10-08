(function(global) {
  class metatron extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.cube = new THREE.Mesh(new THREE.BoxGeometry(160, 90, 0.1),
                                 new THREE.MeshBasicMaterial({ color: 0x23132 }));
      this.cube.position.set(0,0, 0)
      this.scene.add(this.cube);

      this.camera.position.z = 100;
    }

    update(frame) {
      super.update(frame);

    }
  }

  global.metatron = metatron;
})(this);
