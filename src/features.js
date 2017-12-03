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

      this.kickThrob = 0;
      this.stabThrob = 0;

      this.bg = new THREE.Mesh(
          new THREE.BoxGeometry(160, 90, 1), 
          new THREE.MeshBasicMaterial());
      this.scene.add(this.bg);

      this.directionalLight = new THREE.DirectionalLight();
      this.directionalLight.decay = 2;
      this.directionalLight.intensity = 0.1;
      this.directionalLight.position.set(0, 0, 1);
      //this.scene.add(this.directionalLight);

      function CustomSinCurve(scale) {
        THREE.Curve.call(this);
        this.scale = (scale === undefined) ? 1 : scale;
      }

      CustomSinCurve.prototype = Object.create(THREE.Curve.prototype);
      CustomSinCurve.prototype.constructor = CustomSinCurve;

      CustomSinCurve.prototype.getPoint = function(t) {
        const tx = 15 * Math.sin(t * Math.PI * 2);
        const ty = 15 * Math.cos(t * Math.PI * 2);
        const tz = t * 1000;
        return new THREE.Vector3( tx, ty, tz ).multiplyScalar(this.scale);
      };
      const path = new CustomSinCurve(1);
      this.tunnelPath = path;
      const tunnelGeometry = new THREE.TubeGeometry(path, 512, 20, 8, false);
      const tunnelMaterial = new THREE.MeshStandardMaterial({
        color: 0x82052c,
        side: THREE.BackSide,
        roughness: 1,
        metalness: 0,
        normalScale: new THREE.Vector2(0.05, 0.05),
        shading: THREE.FlatShading,
      });
      /*
      tunnelMaterial.map.wrapS = THREE.RepeatWrapping;
      tunnelMaterial.map.wrapT = THREE.RepeatWrapping;
      tunnelMaterial.map.repeat.set(32, 8);
      tunnelMaterial.normalMap.wrapS = THREE.RepeatWrapping;
      tunnelMaterial.normalMap.wrapT = THREE.RepeatWrapping;
      tunnelMaterial.normalMap.repeat.set(32, 8);
      tunnelMaterial.normalMap.wrapS = THREE.RepeatWrapping;
      tunnelMaterial.normalMap.wrapT = THREE.RepeatWrapping;
      tunnelMaterial.normalMap.repeat.set(64, 16);
      */
      this.tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
      this.scene.add(this.tunnel);


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

      this.ballLight = new THREE.PointLight(0xfffcac);
      this.ballLight.decay = 2;
      this.ballLight.intensity = 1;
      //this.scene.add(this.ballLight);

      this.scene.add(new THREE.AmbientLight(0xffffff, 0.1));

      this.camera.fov = 18;
      this.camera.updateProjectionMatrix();

      this.tunnelLights = [];
      const torusGeometry = new THREE.TorusGeometry(15, 1, 8, 8);
      for(let i = 0; i < 10; i++) {
        const light = new THREE.PointLight();
        light.decay = 2;
        light.intensity = 0.5;
        light.helper = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 2),
            new THREE.MeshBasicMaterial({
              color: 0xff0000,
            }));
        light.mesh = new THREE.Mesh(
          torusGeometry,
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(1, 73 / 255, 130 / 255),
            roughness: 1,
            metalness: 0,
            emissive: 0xffffff,
            emissiveIntensity: 1,
            blending: THREE.AdditiveBlending,
          }));
        this.tunnelLights[i] = light;
        this.scene.add(light);
        //this.scene.add(light.helper);
        this.scene.add(light.mesh);
      }

      this.cameraPreviousPosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakePosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakeVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAcceleration = new THREE.Vector3(0, 0, 0);
      this.cameraShakeRotation = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularAcceleration = new THREE.Vector3(0, 0, 0);
    }

    update(frame) {

      this.ball.material.uniforms.ambientLightIntensity.value = 0.2;

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

      if(BEAT && BEAN == 3672) {
        /*
          this.cameraShakeVelocity.x = this.camera.position.x -
            this.cameraPreviousPosition.x;
          this.cameraShakeVelocity.y = this.camera.position.y -
            this.cameraPreviousPosition.y;
          this.cameraShakeVelocity.z = this.camera.position.z -
            this.cameraPreviousPosition.z;
            */
        this.cameraShakeAngularVelocity.x = (Math.random() - 0.5) * 0.05;
        this.cameraShakeAngularVelocity.y = (Math.random() - 0.5) * 0.05;
        this.cameraShakeAngularVelocity.z = (Math.random() - 0.5) * 0.05;
      }

      this.cameraShakeAcceleration.x = -this.cameraShakePosition.x * 0.05;
      this.cameraShakeAcceleration.y = -this.cameraShakePosition.y * 0.05;
      this.cameraShakeAcceleration.z = -this.cameraShakePosition.z * 0.05;
      this.cameraShakeAngularAcceleration.x = -this.cameraShakeRotation.x * 0.05;
      this.cameraShakeAngularAcceleration.y = -this.cameraShakeRotation.y * 0.05;
      this.cameraShakeAngularAcceleration.z = -this.cameraShakeRotation.z * 0.05;
      this.cameraShakeVelocity.add(this.cameraShakeAcceleration);
      this.cameraShakeAngularVelocity.add(this.cameraShakeAngularAcceleration);
      this.cameraShakeVelocity.multiplyScalar(0.85);
      this.cameraShakeAngularVelocity.multiplyScalar(0.85);
      this.cameraShakePosition.add(this.cameraShakeVelocity);
      this.cameraShakeRotation.add(this.cameraShakeAngularVelocity);

      let scale = 0.75 + this.kickThrob * 0.2;
      const t = (frame - FRAME_FOR_BEAN(3672 + 6)) / (
          FRAME_FOR_BEAN(3672 + 10) - FRAME_FOR_BEAN(3672 + 6));
      scale = easeIn(0.001, scale, t);
      this.ball.visible = scale > 0.002;
      this.textball.visible = scale > 0.002;
      this.gridball.visible = scale > 0.002;
      this.ball.scale.set(scale, scale, scale);
      this.textball.scale.set(scale, scale, scale);
      let oldscale = scale;
      if(BEAN >= 3816) {
        scale = 0.85 + this.stabThrob * 0.2;
      } else {
        scale = 1;
      }
      scale = easeIn(0.01, scale, t);
      this.gridball.scale.set(scale, scale, scale);


      this.gridball.material.uniforms.lineWidth.value = 0.03;
      this.gridball.material.uniforms.ballRadius.value = 0.15;

      const scalediff = Math.abs(oldscale - scale);
      this.ball.material.uniforms.lineWidth.value = (0.03 + scalediff * scalediff) * 0.9;
      this.ball.material.uniforms.ballRadius.value = (0.15 + scalediff * scalediff) * 0.9;

      if(BEAN < 3720) {
        this.bg.position.z = this.camera.position.z - 284;
        this.bg.position.x = this.camera.position.x;
        this.bg.position.y = this.camera.position.y;
        this.bg.lookAt(this.camera.position);
      }

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

      const position = new THREE.Vector3(
          -8.5, 0, 95);
      this.camera.rotation.set(0, 0, 0);
      this.ball.position.set(0, 0, 0);
      this.bg.visible = BEAN < 3720 + 12;
      if(BEAN >= 3720) {
        let t = (frame - FRAME_FOR_BEAN(3720)) / (
            FRAME_FOR_BEAN(3816) - FRAME_FOR_BEAN(3720));
        t *= 2;
        t %= 2;
        const point = this.tunnelPath.getPoint(1 - t);
        this.ball.position.copy(point);
        const cameraPoint = this.tunnelPath.getPoint(1 - (t - 0.15));
        position.copy(cameraPoint);
        position.x += -3;

        const cameraLookatPoint = this.tunnelPath.getPoint(1 - (t + 0.15));
        this.camera.lookAt(cameraLookatPoint);

        const lightsInTunnel = 16;
        const wrapDistance = 0.1;
        for(let i = 0; i < this.tunnelLights.length; i++) {
          const lightT = ((t - wrapDistance) * lightsInTunnel | 0) / lightsInTunnel;
          const lightPosition = this.tunnelPath.getPoint(
              (1 - (lightT + i / lightsInTunnel)));
          const light = this.tunnelLights[i];
          light.position.copy(lightPosition);
          light.helper.position.copy(light.position);
          light.mesh.position.copy(lightPosition);

          light.mesh.material.emissiveIntensity = this.stabThrob;
          light.intensity = this.stabThrob * 0.5;
        }
        this.ball.material.uniforms.ambientLightIntensity.value = this.stabThrob;
      }

      this.gridball.rotation.x = frame / 170;
      this.gridball.rotation.y = frame / 100;
      this.gridball.material.uniforms.frame.value = frame;
      this.ball.material.uniforms.frame.value = frame;
      this.ball.rotation.copy(this.gridball.rotation);
      this.ballLight.position.copy(this.ball.position);
      this.gridball.position.copy(this.ball.position);
      this.textball.position.copy(this.ball.position);

      this.bg.material.map = this.inputs.featurebg.getValue();
      this.bg.material.needsUpdate = true;

      this.cameraPreviousPosition.copy(this.camera.position);
      this.camera.position.copy(position);
      this.camera.position.add(this.cameraShakePosition);
      this.camera.rotation.x += this.cameraShakeRotation.x;
      this.camera.rotation.y += this.cameraShakeRotation.y;
      this.camera.rotation.z += this.cameraShakeRotation.z;
    }

    render(renderer) {
      renderer.setClearColor(new THREE.Color(0x500019));
      super.render(renderer);
    }
  }

  global.features = features;
})(this);
