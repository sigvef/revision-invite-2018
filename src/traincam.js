(function(global) {
  class traincam extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          camera: new NIN.Output()
        }
      });

      this.camera = new THREE.PerspectiveCamera(25, 16/9, 1, 100000);
      this.outputs.camera.value = this.camera;
    }

    update(frame) {
      this.camera.position.x = 3;
      this.camera.position.y = 3;
      this.camera.position.z = -5  -(frame - 5258) / 30;
      this.camera.rotation.x = 0;
      this.camera.rotation.y = 0;
      this.camera.rotation.z = 0;

      if(frame >= FRAME_FOR_BEAN(2064 -2) && frame < FRAME_FOR_BEAN(2112)) {
        if(frame >= FRAME_FOR_BEAN(2064 + 10)) {
          this.camera.position.z = 0;
          this.camera.position.y = 4;
          this.camera.position.x = 4;
        } else if(frame >= FRAME_FOR_BEAN(2064 + 4)) {
          this.camera.position.z = -15;
          this.camera.position.y = -2;
          this.camera.position.x = -2;
        } else {
          this.camera.position.z = -10;
          this.camera.position.y = 0;
          this.camera.position.x = 2;
        }
      }
      if(frame > FRAME_FOR_BEAN(2112)) {
        const distance = easeIn(4, 16, (frame - FRAME_FOR_BEAN(2160)) / (FRAME_FOR_BEAN(2208) - FRAME_FOR_BEAN(2160)));
        this.camera.position.z = 0;
        this.camera.position.y = distance;
        this.camera.position.x = distance;
      }

      this.outputs.camera.value = this.camera;

    }

    resize() {
      this.renderTarget.setSize(16 * GU, 9 * GU);
    }
  }

  global.traincam = traincam;
})(this);
