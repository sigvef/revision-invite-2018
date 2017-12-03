(function (global) {
  class fez2 extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      const letters = [
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
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
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      ];

      const redMaterial = new THREE.MeshBasicMaterial({ color: 0xdd2222 });
      const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe: true });
      this.boxes = new THREE.Object3D();
      for (let x = 0; x < 28; x++) {
        for (let y = 0; y < 23; y++) {
          const box = new THREE.Object3D();
          const geometry = new THREE.TetrahedronGeometry(0.55);
          //const materials = [
          //  new THREE.MeshStandardMaterial({ color: 0xff0000 }),
          //  new THREE.MeshStandardMaterial({ color: 0xffffff }),
          //  //new THREE.MeshStandardMaterial({ color: 0x0000ff }),
          //  //new THREE.MeshStandardMaterial({ color: 0xffff00 }),
          //];
          //geometry.faces[0].materialIndex = 0;
          //geometry.faces[1].materialIndex = 0;
          //geometry.faces[2].materialIndex = 1;
          //geometry.faces[3].materialIndex = 1;
          const triangle = new THREE.Mesh(
            geometry,
            letters[y][x] ? redMaterial : whiteMaterial,
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

          //box.position.y = (y) - 10;

          const offset = 0.85;
          boxx.position.x = (x * offset); // + ((y % 2 == 0) ? offset : 0);
          boxx.position.y = (y * 0.628);
          // Each box is .528 wide.
          if (x % 2 == 0) {
            boxx.rotation.y = -Math.PI / 1;
          }
          //} else {
          //  box.rotation.z = -Math.PI / 2;
          //  box.position.y = (y) - 10;
          //  box.position.x = (x * 0.528) - 10;
          //}
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
    }

    update(frame) {
      super.update(frame);

      for (let box of this.boxes.children) {
        //box.rotation.x = frame / 40;
        //box.rotation.y = frame / 30;
        //box.rotation.z = frame / 60;
      }
    }

    render(renderer) {
      super.render(renderer);
      renderer.setClearColor(0x202020, 1.0);
    }
  }

  global.fez2 = fez2;
})(this);
