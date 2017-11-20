(function(global) {
  class ewerk extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput(),
        }
      });

      this.cube = new THREE.Mesh(
        new THREE.BoxGeometry(10, 5, 20),
        new THREE.MeshStandardMaterial({color: 0xff0000})
      );
      this.cube.rotation.y = Math.PI / 2;
      this.cube.position.y = 2.5;
      this.scene.add(this.cube);

      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(0, 10);
      shape.lineTo(1, 5);
      shape.lineTo(0, 0);
      this.roof = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, {
          amount: 20,
          bevelSize: 1,
          bevelSegments: 1,
          bevelEnabled: false,
          steps: 1,
        }),
        new THREE.MeshStandardMaterial({color: 0xff0000})
      );
      this.roof.rotation.z = Math.PI/2;
      this.roof.rotation.y = Math.PI / 2;
      this.scene.add(this.cube);
      this.roof.position.set(-10, 5, -5);
      this.scene.add(this.roof);

      this.shader = SHADERS[options.shader];
      this.shader.uniforms.B.value = Loader.loadTexture('res/ewerk_zoom_1.png');
      this.shader.uniforms.C.value = Loader.loadTexture('res/ewerk_zoom_2.png');
      this.shader.uniforms.D.value = Loader.loadTexture('res/ewerk_zoom_3.png');
      this.map = new THREE.Mesh(
        new THREE.PlaneGeometry(2000, 2000),
        new THREE.ShaderMaterial(this.shader)
      );
      this.map.rotation.x = -Math.PI/2;
      this.scene.add(this.map);

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(10, 10, 15);
      this.scene.add(light);

      this.camera.position.z = 50;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    update(frame) {
      super.update(frame);
      const frame1 = FRAME_FOR_BEAN(34 * 12 * 4 + 24);
      const frame2 = FRAME_FOR_BEAN(35 * 12 * 4);
      const frame3 = FRAME_FOR_BEAN(35 * 12 * 4 + 24);
      const frame4 = FRAME_FOR_BEAN(36 * 12 * 4);
      if (frame <= frame1) {
        this.camera.position.set(
          lerp(30, 5, (frame - frame1 + 10) / 10),
          lerp(15, 150, (frame - frame1 + 10) / 10),
          lerp(10, 20, (frame - frame1 + 10) / 10)
        );
        this.shader.uniforms.t.value = lerp(0, 1, (frame - frame1 + 10) / 10);
      } else if (frame <= frame2) {
        this.camera.position.set(
          lerp(5, 0, (frame - frame2 + 10) / 10),
          lerp(150, 400, (frame - frame2 + 10) / 10),
          lerp(20, 100, (frame - frame2 + 10) / 10)
        );
        this.shader.uniforms.t.value = lerp(1, 2, (frame - frame2 + 10) / 10);
      } else if (frame <= frame3) {
        this.camera.position.set(
          lerp(0, 0, (frame - frame3 + 10) / 10),
          lerp(400, 900, (frame - frame3 + 10) / 10),
          lerp(100, 200, (frame - frame3 + 10) / 10)
        );
        this.shader.uniforms.t.value = lerp(2, 3, (frame - frame3 + 10) / 10);
      } else {
        this.camera.position.set(
          lerp(0, 0, (frame - frame4 + 10) / 10),
          lerp(900, 1200, (frame - frame4 + 10) / 10),
          lerp(200, 300, (frame - frame4 + 10) / 10)
        );
        this.shader.uniforms.t.value = lerp(3, 4, (frame - frame4 + 10) / 10);
      }
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
  }

  global.ewerk = ewerk;
})(this);
