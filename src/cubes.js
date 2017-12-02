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
      const cubeGeometry = new THREE.BoxGeometry(this.cubeWidth,
          this.cubeHeight,
          2);
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
      this.camera.position.z = 100;
      this.camera.position.x = 0;
      this.camera.position.y = 0;
      const scaleUpT = (frame - 2002) / (2253 - 2002);
      for(let i = 0; i < this.cubes.length; i++) {
        const cube = this.cubes[i];
        cube.position.x = (((i % 4) + 0.5) / this.cubes.length - 0.25) * 4 * this.cubeWidth * 2;
        cube.position.y = (0.5 - (i / 4 | 0)) * this.cubeHeight;
        cube.rotation.x = 0;
        cube.rotation.z = 0;
        //cube.rotation.y = Math.PI / 2 + (frame - 2002) * Math.PI * 2 / 60 / 60 *115 / 2;
        cube.position.z = 0;
        cube.position.y *= smoothstep(1, 1.3, scaleUpT);
        cube.position.x *= smoothstep(1, 1.6, scaleUpT);
        cube.scale.z = smoothstep(1, 8, scaleUpT);
        cube.scale.x = 1;
        cube.scale.y = 1;
        this.camera.fov = smoothstep(20.6, 45, scaleUpT);
        this.camera.updateProjectionMatrix();
      }

      const A = easeOut(0, 3 * Math.PI * 2,
          (frame - 2002) / (2065 - 2002)) + frame * Math.PI * 2 / 60 / 60 * 115 / 2;
      const B = easeOut(0, 1 * Math.PI * 2,
          (frame - 2026) / 40);
      const D = easeOut(0, 1 * Math.PI * 2 / 2,
          (frame - 2049) / 10);
      const E = easeOut(1, 1.15,
          (frame - 2065) / 10);
      const F = easeOut(1, 1.15,
          (frame - 2076) / 10);
      this.cubes[4].rotation.y = A;
      this.cubes[0].rotation.y = A;
      this.cubes[5].rotation.y = B;
      this.cubes[1].rotation.x = B;
      this.cubes[6].rotation.z = D;
      this.cubes[2].rotation.z = D;
      this.cubes[3].scale.set(E, E, E);
      this.cubes[3].position.y += (E - 1) * 15;
      this.cubes[7].scale.set(F, F, F);
      this.cubes[7].position.y -= (F - 1) * 15;

      const C = easeIn(1, 0.3, (frame - 2002) / (2096 - 2002));
      this.cubes[2].scale.set(C, C, C);
      this.cubes[6].scale.set(C, C, C);

      const t = (frame - 2096 + 10) / 10;
      this.camera.position.x = easeIn(0, -30, t);
      this.camera.position.y = easeIn(0, 10, t);
      this.camera.position.z = easeIn(100, 25, t);
      if(frame >= 2096) {
        this.camera.position.x = -30;
        this.camera.position.y = 10;
        this.camera.position.z = 25;

        const t = (frame - 2109 + 10) / 10;
        this.camera.position.x = easeIn(-30, -10.5, t);
        this.camera.position.y = easeIn(10, 10.5, t);
        this.camera.position.z = easeIn(25, 25, t);
      }
      if(frame >= 2109) {
        this.camera.position.x = -10.5;
        this.camera.position.y = 10.5;
        this.camera.position.z = 25;

        const t = (frame - 2128 + 10) / 10;
        this.camera.position.x = easeIn(-10.5, 10.5, t);
        this.camera.position.y = easeIn(10.5, 10.5, t);
        this.camera.position.z = easeIn(25, 10, t);
      }
      if(frame >= 2128) {
        this.camera.position.x = 10.5;
        this.camera.position.y = 10.5;
        this.camera.position.z = 10;

        const t = (frame - 2143 + 10) / 10;
        this.camera.position.x = easeIn(10.5, 34, t);
        this.camera.position.y = easeIn(10.5, 13, t);
        this.camera.position.z = easeIn(10, 25, t);
      }
      if(frame >= 2143) {
        this.camera.position.x = 34;
        this.camera.position.y = 13;
        this.camera.position.z = 25;
      }
      if(frame >= 2159) {
        this.camera.position.x = -35;
        this.camera.position.y = -11;
        this.camera.position.z = 25;

        const t = (frame - 2169 + 7) / 7;
        this.camera.position.x = easeIn(-35, -12, t);
        this.camera.position.y = easeIn(-11, -11, t);
        this.camera.position.z = easeIn(25, 20, t);
      }
      if(frame >= 2169) {
        this.camera.position.x = -12;
        this.camera.position.y = -11;
        this.camera.position.z = 20;

        const t = (frame - 2186 + 10) / 10;
        this.camera.position.x = easeIn(-12, 0, t);
        this.camera.position.y = easeIn(-11, 0, t);
        this.camera.position.z = easeIn(20, 100, t);

        for(let i = 0; i < this.cubes.length; i++) {
          this.cubes[i].scale.x = easeIn(this.cubes[i].scale.x, 1, t);
          this.cubes[i].scale.y = easeIn(this.cubes[i].scale.y, 1, t);
        }
      }
      if(frame >= 2186) {
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 100;
      }
    }

    render(renderer) {
      renderer.setClearColor(new THREE.Color(
          55 / 255,
          60 / 255,
          63 / 255));
      super.render(renderer); 
    }
  }

  global.cubes = cubes;
})(this);
