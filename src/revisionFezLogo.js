(function (global) {
  class revisionFezLogo extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      const splashScreenTexture = Loader.loadTexture('res/Revision-Fez.png');
      splashScreenTexture.minFilter = THREE.LinearFilter;
      splashScreenTexture.magFilter = THREE.LinearFilter;

      this.revisionTitle = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1920, 1080, 1),
        new THREE.MeshBasicMaterial({
          map: splashScreenTexture,
        }),
      );

      this.scene.add(this.revisionTitle);

      this.camera.position.z = 1300;
    }

    update(frame) {
      super.update(frame);
    }
  }

  global.revisionFezLogo = revisionFezLogo;
})(this);
