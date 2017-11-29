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
        })
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
        })
      );
      this.scene.add(this.bottomRevisionTitle);


      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1920;
      canvas.height = 1080;

      const gradient = ctx.createLinearGradient(
        0.50 * 1920,
        0.50 * 1080,
        0.50 * 1920 + (0.5 * 1080) / Math.tan(2 * Math.PI / 6),
        1080);
      gradient.addColorStop(0, '#cecece');
      gradient.addColorStop(1, '#4d3999');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1920, 1080);

      //ctx.beginPath();
      //ctx.fillStyle = '#3d2d78';
      //ctx.arc(100, 100, 10, 0, Math.PI * 2);
      //ctx.fill();


      //ctx.scale(canvas.width / 2, canvas.height / 2);
      //ctx.translate(1, 1);

      //ctx.fillStyle = 'rgb(255, 73, 130)';
      //ctx.strokeStyle = 'white';
      //ctx.strokeStyle = '#b71346';
      //ctx.lineWidth = 0.06;

      this.starfield = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1920, 1080, 1),
        new THREE.MeshBasicMaterial({
          map: new THREE.CanvasTexture(canvas),
        })
      );

      this.scene.add(this.starfield);

      this.camera.position.z = 1300;
    }

    update(frame) {
      super.update(frame);

      const startFrame = FRAME_FOR_BEAN(672);
      const duration = 180;
      const tan30deg = Math.tan(2 * Math.PI / 12);
      const driftX = (frame - startFrame) / 15;
      const driftY = driftX * tan30deg;
      const startPosX = 1000;
      const startPosY = startPosX * tan30deg;

      this.topRevisionTitle.position.x = easeOut(startPosX, 0, (frame - startFrame) / duration) - driftX;
      this.topRevisionTitle.position.y = easeOut(startPosY, 0, (frame - startFrame) / duration) - driftY;
      this.bottomRevisionTitle.position.x = easeOut(-startPosX, 0, (frame - startFrame) / duration) + driftX;
      this.bottomRevisionTitle.position.y = easeOut(-startPosY, 0, (frame - startFrame) / duration) + driftY;

      Math.max(1780 - frame, 0);
    }
  }

  global.revisionFezLogo = revisionFezLogo;
})(this);
