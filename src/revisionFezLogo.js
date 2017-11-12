(function (global) {
  class revisionFezLogo extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      const topTexture = Loader.loadTexture('res/Revision-Fez-Top.png');
      topTexture.minFilter = THREE.LinearFilter;
      topTexture.magFilter = THREE.LinearFilter;
      this.topRevisionTitle = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1920, 1080, 1),
        new THREE.MeshBasicMaterial({
          map: topTexture,
          transparent: true,
        }),
      );
      this.scene.add(this.topRevisionTitle);

      const bottomTexture = Loader.loadTexture('res/Revision-Fez-Bottom.png');
      topTexture.minFilter = THREE.LinearFilter;
      topTexture.magFilter = THREE.LinearFilter;
      this.bottomRevisionTitle = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1920, 1080, 1),
        new THREE.MeshBasicMaterial({
          map: bottomTexture,
          transparent: true,
        }),
      );
      this.scene.add(this.bottomRevisionTitle);


      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 256;
      ctx.fillStyle = 'rgba(200, 200, 200, 1.0)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(canvas.width / 2, canvas.height / 2);
      ctx.translate(1, 1);
      //ctx.fillStyle = 'rgb(255, 73, 130)';
      //ctx.strokeStyle = 'white';
      //ctx.strokeStyle = '#b71346';
      //ctx.lineWidth = 0.06;

      /*const texture = new THREE.CanvasTexture(canvas);
      const birdo = new THREE.Mesh(
        new THREE.BoxBufferGeometry(256, 256, 1),
        new THREE.MeshBasicMaterial({ map: texture }),
      );*/

      //this.scene.add(birdo);

      this.camera.position.z = 1300;
    }

    update(frame) {
      super.update(frame);

      const startFrame = FRAME_FOR_BEAN(672);


      this.topRevisionTitle.position.x = easeOut(1000, 0, (frame - startFrame) / 90);
      this.bottomRevisionTitle.position.x = easeOut(-1000, 0, (frame - startFrame) / 90);

      Math.max(1780 - frame, 0)
    }

    render(renderer) {
      renderer.setClearColor(new THREE.Color(148 / 255, 227 / 255, 247 / 255));
      super.render(renderer);
    }
  }

  global.revisionFezLogo = revisionFezLogo;
})(this);
