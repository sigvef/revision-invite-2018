(function(global) {

  class chilla extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.camera = new THREE.PerspectiveCamera(25, 16/9, 1, 100000);

      const railGeometry = new THREE.BoxBufferGeometry(100, 0.15, 0.15);
      this.leftRail = new THREE.Mesh(
          railGeometry,
          new THREE.ShaderMaterial(SHADERS.butterflylines).clone());
      this.rightRail = this.leftRail.clone();
      this.leftRail.position.x = 50 - 4;
      this.rightRail.position.x = 50 - 4;
      this.rightRail.material.uniforms.r.value = 55 / 255;
      this.rightRail.material.uniforms.g.value = 60 / 255;
      this.rightRail.material.uniforms.b.value = 63 / 255;
      this.leftRail.material.uniforms.r.value = 55 / 255;
      this.leftRail.material.uniforms.g.value = 50 / 255;
      this.leftRail.material.uniforms.b.value = 63 / 255;
      this.scene.add(this.leftRail);
      this.scene.add(this.rightRail);

      this.leftRail.material.uniforms.percentage.value = 1;
      this.rightRail.material.uniforms.percentage.value = 1;
      this.leftRail.position.y = 1.5 / 2;
      this.rightRail.position.y = -1.5 / 2;

      this.train = new THREE.Object3D();
      this.scene.add(this.train);

      this.resize();

      this.camera.position.z = 10;

      this.crossers = [];
      const crosserGeometry = new THREE.BoxBufferGeometry(0.30, 2, 0.1);
      for(let i = 0; i < 100; i++) {
        const crosser = new THREE.Mesh(
          crosserGeometry,
          new THREE.MeshBasicMaterial({
            color: 0x373c3f,
          }));
        this.scene.add(crosser);
        this.crossers.push(crosser);
        crosser.position.x = (i - 5) * 0.8;
        crosser.position.z = -0.15 / 2;
      }
    }

    update(frame) {
      super.update(frame);
      this.frame = frame;

      for(let i = 0; i < this.crossers.length; i++) {
        const crosser = this.crossers[i];
        const scale = easeOut(0.00001, 1, (frame - FRAME_FOR_BEAN(1920) - i * 4) / 20);
        crosser.visible = scale > 0.001;
        crosser.scale.y = scale;
        crosser.position.y = 2. / 2 * (1 - scale);
        if(i % 2 == 0) {
          crosser.position.y = -crosser.position.y;
        }
      }

      const cameraT = smoothstep(0, -Math.PI / 2 * 0.85, (this.frame - FRAME_FOR_BEAN(1968) + 30) / 30);
      this.camera.position.y = 10 * Math.sin(cameraT);
      this.camera.position.z = 10 * Math.cos(cameraT);
      this.camera.position.y -= smoothstep(0, 20 / 2, (this.frame - FRAME_FOR_BEAN(2016)) / 500);
      this.camera.position.z += smoothstep(0, 10 / 2, (this.frame - FRAME_FOR_BEAN(2016)) / 500);
      const cameraY = easeIn(0, 7, (this.frame - FRAME_FOR_BEAN(1992) + 30) / 30);
      this.camera.lookAt(new THREE.Vector3(this.camera.position.x, cameraY, 0));

      const relativeFrame = frame - FRAME_FOR_BEAN(1920);
      const percentage = relativeFrame / 500 + easeOut(0, 0.08, relativeFrame / 50);
      this.camera.position.x = relativeFrame / 500 * 10 * 3;
      this.leftRail.material.uniforms.percentage.value = percentage;
      this.rightRail.material.uniforms.percentage.value = percentage;
    }

    render(renderer) {
      renderer.setClearColor(0x00e04f);
      return super.render(renderer);
    }
  }

  global.chilla = chilla;
})(this);
