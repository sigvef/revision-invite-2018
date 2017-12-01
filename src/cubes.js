(function(global) {
  class cubes extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.cubes = [];
      this.cubeWidth = 16 / 4 * 4;
      this.cubeHeight = 9 / 2 * 4;
      const cubeGeometry = new THREE.BoxGeometry(2, this.cubeHeight, this.cubeWidth);
      const map = Loader.loadTexture('res/testo.png');
      for(let i = 0; i < 8; i++) {
        const mapClone = Loader.loadTexture('res/testo.png');
        const cube = new THREE.Mesh(
          cubeGeometry,
          new THREE.MeshStandardMaterial({
            map: mapClone,
            emissive: 0xffffff,
            emissiveIntensity: 1,
            emissiveMap: mapClone,
          }));
        mapClone.repeat.set(1 / 4, 1 / 2);
        mapClone.offset.set(
            (i % 4) / 4,
            0.5 - (i / 4 | 0) / 2);
        this.cubes[i] = cube;
        this.scene.add(cube);
      }

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 100;
      this.camera.fov = 18;
      this.camera.updateProjectionMatrix();
    }

    update(frame) {
      const scaleUpT = (frame - 2002) / (2253 - 2002);
      for(let i = 0; i < this.cubes.length; i++) {
        const cube = this.cubes[i];
        cube.position.x = (((i % 4) + 0.5) / this.cubes.length - 0.25) * 4 * this.cubeWidth * 2;
        cube.position.y = (0.5 - (i / 4 | 0)) * this.cubeHeight;
        cube.rotation.y = Math.PI / 2;
        cube.rotation.x = 0;
        //cube.rotation.y = Math.PI / 2 + (frame - 2002) * Math.PI * 2 / 60 / 60 *115 / 2;
        cube.position.z = 0;
        cube.position.y *= smoothstep(1, 1.3, scaleUpT);
        cube.position.x *= smoothstep(1, 1.6, scaleUpT);
        cube.scale.x = smoothstep(1, 8, scaleUpT);
        this.camera.fov = smoothstep(20.6, 45, scaleUpT);
        this.camera.updateProjectionMatrix();
      }

      const A = easeOut(0, 3 * Math.PI * 2,
          (frame - 2002) / (2065 - 2002)) + frame * Math.PI * 2 / 60 / 60 * 115 / 2;
      const B = easeOut(0, 1 * Math.PI * 2,
          (frame - 2026) / 40);
      this.cubes[4].rotation.y += A;
      this.cubes[0].rotation.y += A;
      this.cubes[5].rotation.y += B;
      this.cubes[1].rotation.x += B;

      const C = easeIn(1, 0.3, (frame - 2002) / (2096 - 2002));
      this.cubes[2].scale.set(C, C, C);
      this.cubes[3].scale.set(C, C, C);
      this.cubes[6].scale.set(C, C, C);
      this.cubes[7].scale.set(C, C, C);

      if(frame >= 2096) {
        let scale = easeOut(1, 0.75, (frame - 2096) / 20);
        this.cubes[2].scale.set(scale, scale, scale);
      }
      if(frame >= 2107) {
        let scale = easeOut(1, 0.75, (frame - 2107) / 20);
        this.cubes[3].scale.set(scale, scale, scale);
      }
      if(frame >= 2109) {
        let scale = easeOut(1, 0.75, (frame - 2109) / 20);
        this.cubes[6].scale.set(scale, scale, scale);
      }
      if(frame >= 2117) {
        let scale = easeOut(1, 0.75, (frame - 2117) / 20);
        this.cubes[7].scale.set(scale, scale, scale);
      }
    }
  }

  global.cubes = cubes;
})(this);
