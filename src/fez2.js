(function(global) {
  class fez2 extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      for (let i=0; i < 23; i++) {
        for (let j=0; j < 23; j++) {
          const box = new THREE.Object3D();
          const geometry = new THREE.TetrahedronGeometry(0.5);
          const materials = [
            new THREE.MeshStandardMaterial({ color: 0xff0000 }),
            new THREE.MeshStandardMaterial({ color: 0x00ff00 }),
            new THREE.MeshStandardMaterial({ color: 0x0000ff }),
            new THREE.MeshStandardMaterial({ color: 0xffff00 }),
          ];
          geometry.faces[0].materialIndex = 0;
          geometry.faces[1].materialIndex = 1;
          geometry.faces[2].materialIndex = 2;
          geometry.faces[3].materialIndex = 3;
          const triangle = new THREE.Mesh(
            geometry,
            new THREE.MultiMaterial(materials)
          );
          triangle.rotation.y = Math.PI / 4;
          triangle.rotation.x = -Math.PI / 8;
          //triangle.rotation.z = Math.PI / 3;

          box.add(triangle);
          if (i%2==0) {
            box.rotation.z = Math.PI / 2;
            box.position.y = (j) - 10;
            box.position.x = (i * .528) - 10;
          } else {
            box.rotation.z = -Math.PI / 2;
            box.position.y = (j) - 10;
            box.position.x = (i * 0.528) - 10;
          }
          this.scene.add(box);
        }
      }

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(0, 0, 5);
      this.scene.add(light);

      const ambient = new THREE.AmbientLight(0xffffff);
      this.scene.add(ambient);

      this.camera = new THREE.OrthographicCamera(-8, 8, -4.5, 4.5, 1, 1000);

      this.camera.position.z = 10;
    }

    update(frame) {
      super.update(frame);
    }
  }

  global.fez2 = fez2;
})(this);
