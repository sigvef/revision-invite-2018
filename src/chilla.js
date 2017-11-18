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

      this.kickThrob = 0;

      this.train = new THREE.Object3D();
      this.scene.add(this.train);

      const cylinder = new THREE.Mesh(
          new THREE.BoxGeometry(5, 1.2, 1.2),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color(55 / 255, 60 / 255, 63 / 255),
          }));
      this.train.add(cylinder);
      this.cyl = cylinder;
      const caboose = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 2.0, 2.0),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color(55 / 255, 60 / 255, 63 / 255),
          }));
      this.caboose = caboose;
      this.train.add(caboose);
      const chimney = new THREE.Mesh(
          new THREE.BoxGeometry(0.5, .5, 1.),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color(55 / 255, 60 / 255, 63 / 255),
          }));
      this.chimney = chimney;
      this.train.add(chimney);

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
        const scale = easeOut(0.00001, 1, (frame - FRAME_FOR_BEAN(1920 - 96) - i * 4) / 20);
        crosser.visible = scale > 0.001;
        crosser.scale.y = scale;
        crosser.position.y = 2. / 2 * (1 - scale);
        if(i % 2 == 0) {
          crosser.position.y = -crosser.position.y;
        }
      }

      const cameraT = smoothstep(0, -Math.PI / 2 * 0.85, (this.frame - FRAME_FOR_BEAN(1968 - 96) + 30) / 30);
      this.camera.position.y = 10 * Math.sin(cameraT);
      this.camera.position.z = 10 * Math.cos(cameraT);
      this.camera.position.y -= smoothstep(0, 20 / 2, (this.frame - FRAME_FOR_BEAN(2016 - 96)) / 500);
      this.camera.position.z += smoothstep(0, 10 / 2, (this.frame - FRAME_FOR_BEAN(2016 - 96)) / 500);
      const cameraY = easeIn(0, 7, (this.frame - FRAME_FOR_BEAN(1992 - 96) + 30) / 30);
      this.camera.lookAt(new THREE.Vector3(this.camera.position.x, cameraY, 0));

      const relativeFrame = frame - FRAME_FOR_BEAN(1920 -96);
      const percentage = relativeFrame / 500 + easeOut(0, 0.08, relativeFrame / 50);
      this.camera.position.x = relativeFrame / 500 * 10 * 3;
      this.leftRail.material.uniforms.percentage.value = percentage;
      this.rightRail.material.uniforms.percentage.value = percentage;

      this.cyl.position.x = this.camera.position.x;
      this.cyl.position.z = 1.3;
      this.cyl.rotation.x = Math.PI / 4;
      this.caboose.position.x = this.camera.position.x - 2.5;
      this.caboose.position.z = 1.6;
      this.chimney.position.x = this.camera.position.x + 2.;
      this.chimney.position.z = 2.25;

      let scale = elasticOut(0.000001, 1, 1., (frame - FRAME_FOR_BEAN(1944)) / (FRAME_FOR_BEAN(1956) - FRAME_FOR_BEAN(1944)));
      this.cyl.scale.set(scale, scale, scale);
      this.caboose.scale.set(scale, scale, scale);
      this.chimney.scale.set(scale, scale, scale);



      if(BEAN >= 1992) {
        const xOffset = 10 + (frame - FRAME_FOR_BEAN(1992)) / 50;
        const yOffset = 5 + (frame - FRAME_FOR_BEAN(1992)) / 50;
        this.camera.position.x += xOffset;
        this.camera.position.y += yOffset;
        this.camera.up = new THREE.Vector3(0, 0, 1);
        this.camera.lookAt(new THREE.Vector3(this.camera.position.x - 10 - xOffset, cameraY, 0));
      }

      this.kickThrob *= 0.75;
      if(BEAT && BEAN >= 1920) {
        switch(BEAN % 96) { 
        case 0:
        case 42:
        case 48:
        case 48 + 9:
        case 48 + 18:
        case 48 + 24 + 6:
        case 48 + 24 + 8:
        case 48 + 24 + 10:
          this.kickThrob = 1;
        }
      }

      this.whiteoutAmount = (frame - 4757) / 80;
      demo.nm.nodes.bloom.opacity = easeOut(10, 0.1 + this.kickThrob, this.whiteoutAmount * 2);

      this.camera.rotation.x += this.kickThrob * (Math.random() - 0.5) * 0.05;
      this.camera.rotation.y += this.kickThrob * (Math.random() - 0.5) * 0.05;
      this.camera.rotation.z += this.kickThrob * (Math.random() - 0.5) * 0.05;
    }

    render(renderer) {
      const clearColor = new THREE.Color(
          easeOut(1, 0, this.whiteoutAmount),
          easeOut(1, 0xe0 / 255, this.whiteoutAmount),
          easeOut(1, 0x4f / 255, this.whiteoutAmount));
      renderer.setClearColor(clearColor.getHex());
      return super.render(renderer);
    }
  }

  global.chilla = chilla;
})(this);
