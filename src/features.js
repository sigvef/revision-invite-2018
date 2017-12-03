(function(global) {
  class features extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        inputs: {
          featuretex: new NIN.TextureInput(),
          featurebg: new NIN.TextureInput(),
        },
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.kickthrob = 0;
      this.stabthrob = 0;

      this.bg = new THREE.Mesh(
          new THREE.BoxGeometry(160, 90, 1), 
          new THREE.MeshBasicMaterial());
      this.scene.add(this.bg);

      const gridGeometry = new THREE.IcosahedronGeometry(9, 2);
      const gridMaterial = new THREE.ShaderMaterial(SHADERS.gridball);
      for(let i = 0; i < gridGeometry.faceVertexUvs[0].length; i++) {
        const faceVertexUv = gridGeometry.faceVertexUvs[0][i];
        faceVertexUv[0].x = 0; 
        faceVertexUv[0].y = 0; 
        faceVertexUv[1].x = 1; 
        faceVertexUv[1].y = 0; 
        faceVertexUv[2].x = 1; 
        faceVertexUv[2].y = 1; 
      }
      this.gridball = new THREE.Mesh(
          gridGeometry,
          gridMaterial.clone());
      this.gridball.material.transparent = true;
      this.gridball.material.side = THREE.DoubleSide;
      this.gridball.material.blending = THREE.AdditiveBlending;
      this.gridball.material.uniforms.gridMode.value = 1;

      this.scene.add(this.gridball);

      this.directionalLight = new THREE.DirectionalLight();
      this.directionalLight.decay = 2;
      this.directionalLight.position.set(1, 1, 1);
      this.scene.add(this.directionalLight);

      this.textball = new THREE.Mesh(
          new THREE.SphereGeometry(8.5, 32, 32),
          new THREE.MeshBasicMaterial({
            transparent: true,
            depthTest: false,
          }));
      this.scene.add(this.textball);

      this.ball = new THREE.Mesh(
        gridGeometry,
        new THREE.MeshStandardMaterial({
          color: 0x66c973,
          roughness: 1,
          metalness: 0,
          shading: THREE.FlatShading,
        }));
      this.ball.material = gridMaterial.clone();
      this.ball.material.uniforms.gridMode.value = 0;
      this.scene.add(this.ball);

      this.scene.add(new THREE.AmbientLight(0xffffff, 0.2));

      this.camera.fov = 18;
      this.camera.updateProjectionMatrix();
      this.camera.position.z = 95;
      this.camera.position.x = -8.5;
    }

    update(frame) {


      this.kickThrob *= 0.95;
      this.stabThrob *= 0.95;

      if(BEAT && BEAN < 3816) {
        switch((BEAN - 24) % 48) {
        case 16:
          this.kickThrob = 0.5;
          break;
        case 0:
        case 9:
        case 18:
        case 20:
        case 22:
        case 24:
        case 33:
        case 42:
          this.kickThrob = 1;
        }
      }

      if(BEAT && BEAN < 3864) {
        switch(BEAN % 24) {
        case 6:
        case 9:
        case 18:
          this.stabThrob = 1;
        }
      }

      let scale = 0.75 + this.kickThrob * 0.2;
      this.ball.scale.set(scale, scale, scale);
      this.textball.scale.set(scale, scale, scale);
      let oldscale = scale;
      if(BEAN >= 3816) {
        scale = 0.85 + this.stabThrob * 0.2;
      } else {
        scale = 1;
      }
      this.gridball.scale.set(scale, scale, scale);

      this.gridball.material.uniforms.lineWidth.value = 0.03;
      this.gridball.material.uniforms.ballRadius.value = 0.15;

      const scalediff = Math.abs(oldscale - scale);
      this.ball.material.uniforms.lineWidth.value = (0.03 + scalediff * scalediff) * 0.9;
      this.ball.material.uniforms.ballRadius.value = (0.15 + scalediff * scalediff) * 0.9;

      this.bg.position.z = this.camera.position.z - 284;
      this.bg.position.x = this.camera.position.x;
      this.bg.position.y = this.camera.position.y;
      this.bg.lookAt(this.camera.position);

      this.textball.material.map = this.inputs.featuretex.getValue();
      if(this.textball.material.map) {
        this.textball.material.map.wrapT = THREE.ClampToEdgeWrapping;
        this.textball.material.map.wrapS = THREE.ClampToEdgeWrapping;
        this.textball.material.map.repeat.set(2, 3);
        let offset = ((frame / 200 - 1) % 2) - 1;
        const t = frame / 60 / 60 * 115 / 2;
        offset = easeOut(0, 1, ((t % 1) - 0.25) * 2) - easeIn(1, 0, ((t % 1)) * 2 - 1);
        offset = Math.pow(offset, 5);
        this.textball.material.map.offset.set(
           offset,
          -1);
      }
      this.textball.material.needsUpdate = true;
      this.gridball.rotation.x = frame / 170;
      this.gridball.rotation.y = frame / 100;
      this.gridball.material.uniforms.frame.value = frame;
      this.ball.material.uniforms.frame.value = frame;
      this.ball.rotation.copy(this.gridball.rotation);

      this.bg.material.map = this.inputs.featurebg.getValue();
      this.bg.material.needsUpdate = true;
    }
  }

  global.features = features;
})(this);
