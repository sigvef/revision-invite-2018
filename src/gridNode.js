(function (global) {
  class gridNode extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      const splashScreenTexture = Loader.loadTexture('res/Revision-Black-Mesa-Crushed.png');
      splashScreenTexture.minFilter = THREE.LinearFilter;
      splashScreenTexture.magFilter = THREE.LinearFilter;

      this.revisionTitle = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1920, 1080, 1),
        new THREE.MeshBasicMaterial({
          map: splashScreenTexture,
        })
      );

      this.scene.add(this.revisionTitle);

      this.camera.position.z = 1000;

      this.throb = 0;
    }

    update(frame) {
      super.update(frame);

      this.throb *= 0.96;
      if (BEAT && BEAN % 12 == 0) {
        this.throb = 1.0;
      }

      this.revisionTitle.material.color.setRGB(this.throb, this.throb, this.throb);
    }
  }

  global.gridNode = gridNode;
})(this);
