(function (global) {
  class fez2 extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.letters = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ];

      const redMaterial = new THREE.MeshBasicMaterial({ color: 0xc0392b });
      const grayMaterial = new THREE.MeshBasicMaterial({ color: 0xc3e50});
      const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xecf0f1});
      const geometry = new THREE.TetrahedronGeometry(0.61);

      this.boxes = new THREE.Object3D();
      for (let x = 0; x < 28; x++) {
        for (let y = 0; y < 23; y++) {
          const box = new THREE.Object3D();
          const colorIndex = this.letters[y][x];
          const triangle = new THREE.Mesh(
            geometry,
            colorIndex == 2 ? whiteMaterial
          : colorIndex == 1 ? whiteMaterial
                            : grayMaterial
          );
          triangle.position.y = 0.08;
          triangle.rotation.y = Math.PI / 4;
          triangle.rotation.x = -Math.PI / 8;

          box.add(triangle);
          if (y % 2 == 1) {
            box.rotation.z = Math.PI / 2;
          } else {
            box.rotation.z = -Math.PI / 2;
          }
          const boxx = new THREE.Object3D();
          boxx.add(box);

          const offset = 0.85;
          boxx.position.x = (x * offset);
          boxx.position.y = (y * 0.628);
          // Each box is .528 wide.
          if (x % 2 == 0) {
            boxx.rotation.y = -Math.PI / 1;
          }
          boxx.x = x;
          boxx.y = y;
          this.boxes.add(boxx);
        }
      }

      this.scene.add(this.boxes);
      this.boxes.position.x = -11.45;
      this.boxes.position.y = -6.92;

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(0, 0, 5);
      //this.scene.add(light);

      const ambient = new THREE.AmbientLight(0xffffff);
      this.scene.add(ambient);

      this.camera = new THREE.OrthographicCamera(-12, 12, -6.75, 6.75, 1, 1000);

      this.camera.position.z = 10;
      this.thwomp = 1.0
    }

    update(frame) {
      super.update(frame);

      const baseBean = 1632;
      const beans = [
        baseBean + 0,
        baseBean + 9,
        baseBean + 24,
        baseBean + 33,
        baseBean + 42,
        baseBean + 60,
        baseBean + 69,
        baseBean + 78,
        baseBean + 81,
        baseBean + 87,
      ];

      if (beans.includes(BEAN_FOR_FRAME(frame))) {
        this.thwomp = 1.0;
      }

      for (let box of this.boxes.children) {
        if (!this.letters[box.y][box.x]) {
          //if (frame > FRAME_FOR_BEAN(beans[0]) + 1.5 * box.x + 2. * box.y) {
          //box.rotation.z = frame / 70;
          //} else {
          box.rotation.y += this.thwomp * 0.20;
          //box.rotation.y = this.thwomp * 100;
          //box.rotation.z = this.thwomp * 100;
          //}
        } else {
          //box.rotation.x = frame / 40;
          box.rotation.y += -this.thwomp * 0.2;
          //box.rotation.y += -this.thwomp * 0.2;
          //box.rotation.z += -this.thwomp * 0.2;
          //box.rotation.y = frame / 60;
          //box.rotation.z = frame / 60;
        }
      }

      this.thwomp *= 0.96;
    }

    render(renderer) {
      super.render(renderer);
      renderer.setClearColor(0xc0392b, 1.0);
    }
  }

  global.fez2 = fez2;
})(this);
