(function(global) {
  class predith extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.cube = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30),
                                 new THREE.MeshStandardMaterial({
                                   color: new THREE.Color(1, 73 / 255, 130 / 255),
                                 }));
      this.outerCube = new THREE.Mesh(new THREE.SphereGeometry(30, 8, 8),
                                 new THREE.MeshStandardMaterial({
                                   color: 0x000000,
                                   wireframe: true,
                                 }));
      this.scene.add(this.cube);
      //this.scene.add(this.outerCube);
      //this.outerCube.scale.set(1.1, 1.1, 1.1);


      var light = new THREE.PointLight(0x00e04f, 1);
      light.position.set(50, 50, 50);
      this.scene.add(light);
      this.scene.add(new THREE.AmbientLight(0xffffff, 0.1));

      this.camera.position.z = 100;
    }

    update(frame) {
      super.update(frame);

      this.cube.rotation.x = Math.sin(frame / 50);
      this.cube.rotation.y = Math.cos(frame / 50);
      this.outerCube.rotation.x = Math.sin(frame / 50);
      this.outerCube.rotation.y = Math.cos(frame / 50);
    }

    render(renderer) {
      renderer.setClearColor(new THREE.Color(55 / 255, 60 / 255, 63 / 255));
      super.render(renderer);

    }
  }

  global.predith = predith;
})(this);
