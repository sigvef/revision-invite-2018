(function (global) {
  class features extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        inputs: {
          featuretex: new NIN.TextureInput(),
          featurebg: new NIN.TextureInput(),
        },
        outputs: {
          render: new NIN.TextureOutput(),
          renderTunnel: new NIN.TextureOutput()
        }
      });

      this.kickThrob = 0;
      this.stabThrob = 0;

      this.renderTarget1 = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      });
      this.renderTarget2 = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      });

      this.tunnelScene = new THREE.Scene();

      this.bg = new THREE.Mesh(
        new THREE.BoxGeometry(160 * 2, 90 * 2, 1),
        new THREE.MeshBasicMaterial());
      this.bg.material.transparent = true;
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

      CustomSinCurve.prototype.getPoint = function (t) {
        const tx = 15 * Math.sin(t * Math.PI * 2);
        const ty = 15 * Math.cos(t * Math.PI * 2);
        const tz = t * 1000;
        return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
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

      this.tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
      this.tunnelScene.add(this.tunnel);
      this.tunnel2 = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
      this.tunnelScene.add(this.tunnel2);
      this.tunnel2.position.z = -1000;


      const gridGeometry = new THREE.IcosahedronGeometry(9, 2);
      const gridMaterial = new THREE.ShaderMaterial(SHADERS.gridball);
      for (let i = 0; i < gridGeometry.faceVertexUvs[0].length; i++) {
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

      this.tunnelScene.add(new THREE.AmbientLight(0xffffff, 0.1));

      this.camera.fov = 18;
      this.camera.updateProjectionMatrix();


      this.tunnelLights = [];
      const torusGeometry = new THREE.TorusGeometry(15, 1, 8, 8);
      for (let i = 0; i < 10; i++) {
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
        this.tunnelScene.add(light);
        //this.scene.add(light.helper);
        this.tunnelScene.add(light.mesh);
      }

      this.cameraPreviousPosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakePosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakeVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAcceleration = new THREE.Vector3(0, 0, 0);
      this.cameraShakeRotation = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularAcceleration = new THREE.Vector3(0, 0, 0);
    }

    resize() {
      this.renderTarget1.setSize(16 * GU, 9 * GU);
      this.renderTarget2.setSize(16 * GU, 9 * GU);
    }

    update(frame) {

      this.ball.material.uniforms.ambientLightIntensity.value = 0.2;

      this.kickThrob *= 0.95;
      this.stabThrob *= 0.95;

      if (BEAT && BEAN < 3816) {
        switch ((BEAN - 24) % 48) {
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

      if (BEAT && BEAN < 3864) {
        switch (BEAN % 24) {
          case 6:
          case 9:
          case 18:
            this.stabThrob = 1;
        }
      }

      if (BEAT) {
        switch (BEAN) {
          case 3816.1:
            this.cameraShakeVelocity.x = (this.camera.position.x -
              this.cameraPreviousPosition.x) * .05;
            this.cameraShakeVelocity.y = (this.camera.position.y -
              this.cameraPreviousPosition.y) * .05;
            this.cameraShakeVelocity.z = (this.camera.position.z -
              this.cameraPreviousPosition.z) * .05;
            break;
          case 3672:
          case 3768:
            this.cameraShakeAngularVelocity.x = (Math.random() - 0.5) * 0.05;
            this.cameraShakeAngularVelocity.y = (Math.random() - 0.5) * 0.05;
            this.cameraShakeAngularVelocity.z = (Math.random() - 0.5) * 0.05;
        }
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

      const threeEightT = (frame - FRAME_FOR_BEAN(3816 - 24) / (
        FRAME_FOR_BEAN(3816) - FRAME_FOR_BEAN(3816 - 24)));
      scale = easeIn(1, 1.08, threeEightT);

      scale = easeIn(0.01, scale, t);
      this.gridball.scale.set(scale, scale, scale);


      this.gridball.material.uniforms.lineWidth.value = 0.03;
      this.gridball.material.uniforms.ballRadius.value = 0.15;
      this.gridball.material.uniforms.smoothPercentage.value = 0.1;

      const scalediff = Math.abs(oldscale - scale);
      this.ball.material.uniforms.lineWidth.value = (0.03 + scalediff * scalediff) * 0.9 * 2;
      this.ball.material.uniforms.ballRadius.value = (0.15 + scalediff * scalediff) * 0.9;
      this.ball.material.uniforms.smoothPercentage.value = scalediff * 10;

      this.ball.material.uniforms.lineWidth.value = easeIn(
        this.ball.material.uniforms.lineWidth.value,
        0.03,
        threeEightT);
      this.ball.material.uniforms.ballRadius.value = easeIn(
        this.ball.material.uniforms.ballRadius.value,
        0.18,
        threeEightT);
      this.ball.material.uniforms.smoothPercentage.value = easeIn(
        this.ball.material.uniforms.smoothPercentage.value,
        0.1,
        threeEightT);

      this.textball.material.map = this.inputs.featuretex.getValue();
      if (this.textball.material.map) {
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
      //this.bg.visible = BEAN <= 3720;

      const tunnelStartBean = 3768 - 48 - 48;

      this.gridball.rotation.x = 1.5 + frame / 170;
      this.gridball.rotation.y = 1.7 + frame / 100;
      if (BEAN >= 3720) {
        this.gridball.rotation.x += (frame - 9954) / 7;
        this.gridball.rotation.y += 0;
      }
      this.textball.visible = true;
      if (BEAN >= 3840) {
        this.textball.visible = false;
        this.ball.position.set(0, 0, 0);
        position.set(1.1, .75, 13.);
        this.gridball.rotation.x = 1.5 + 9954 / 170;
        this.gridball.rotation.y = 1.7 + 9954 / 100;
        this.ball.scale.set(1, 1, 1);
        this.textball.scale.set(1, 1, 1);
        this.ball.material.uniforms.lineWidth.value = 0;
        this.ball.material.uniforms.ballRadius.value = 0;
        this.ball.material.uniforms.smoothPercentage.value = 0.01;
        this.gridball.material.uniforms.smoothPercentage.value = 0.02;
      } else if (BEAN >= 3816) {
        this.textball.visible = true;
        this.ball.position.set(0, 0, 0);

        if (this.textball.material.map) {
          this.textball.material.map.offset.set(-0.5, -2.5);
          this.textball.material.map.repeat.set(4, 6);
        }

        let t = (frame - FRAME_FOR_BEAN(3816 + 12 + 6)) / (
          FRAME_FOR_BEAN(3840) - FRAME_FOR_BEAN(3816 + 12 + 6));
        position.set(
          1.1,
          easeIn(0, .75, t),
          easeIn(25, 13, t));
        this.gridball.rotation.x = 1.5 + 9954 / 170;
        this.gridball.rotation.y = 1.7 + 9954 / 100;
        this.ball.scale.set(1, 1, 1);
        this.textball.scale.set(1, 1, 1);
        this.ball.material.uniforms.lineWidth.value = easeIn(0.03, 1, t * t * t);
        this.ball.material.uniforms.ballRadius.value = easeIn(0.18, 1, t * t * t);
        this.ball.material.uniforms.smoothPercentage.value = easeIn(0.1, 100, t * t * t);
        this.gridball.material.uniforms.smoothPercentage.value = easeIn(0.1, .02, t);
      } else if (BEAN >= tunnelStartBean) {
        let t = (frame - FRAME_FOR_BEAN(tunnelStartBean)) / (
          FRAME_FOR_BEAN(3816) - FRAME_FOR_BEAN(tunnelStartBean));
        t *= 2;
        t -= 0.5;
        let cameraT = (frame - FRAME_FOR_BEAN(tunnelStartBean)) / (
          FRAME_FOR_BEAN(3816) - FRAME_FOR_BEAN(tunnelStartBean));
        const point = this.tunnelPath.getPoint(1 - t);
        const cameraDistance = easeIn(0.15, 0.02, cameraT * cameraT);
        const cameraPoint = this.tunnelPath.getPoint(1 - (t - cameraDistance));
        const cameraLookatPoint = this.tunnelPath.getPoint(1 - (t + 0.15));
        point.x = easeIn(point.x, 0, cameraT);
        point.y = easeIn(point.y, 0, cameraT);
        point.z = easeIn(point.z, 0, cameraT);
        this.ball.position.copy(point);
        this.bg.position.copy(point);
        this.bg.position.z -= 100;
        cameraPoint.x = easeIn(cameraPoint.x, 1.1, cameraT);
        cameraPoint.y = easeIn(cameraPoint.y, 0, cameraT);
        cameraPoint.z = easeIn(cameraPoint.z, 25, cameraT);
        position.copy(cameraPoint);
        this.camera.lookAt(cameraLookatPoint);

        const ballTargetScale = easeIn(this.ball.scale.x, 1, cameraT);
        this.ball.scale.set(ballTargetScale, ballTargetScale, ballTargetScale);
        this.textball.scale.copy(this.ball.scale);


        if (BEAN <= 3720) {
          let ballT = clamp(0, (frame - FRAME_FOR_BEAN(3720 - 6)) / (
            FRAME_FOR_BEAN(3720) - FRAME_FOR_BEAN(3720 - 6)), 1);
          this.bg.position.z = cameraLookatPoint.z;
          this.bg.position.x = cameraLookatPoint.x;
          this.bg.position.y = cameraLookatPoint.y;
          const scale = easeIn(1.2, 1, ballT);
          this.bg.scale.set(scale, scale, scale);
          this.bg.lookAt(this.camera.position);
          this.ball.position.x =
            easeIn(
              8 + lerp(this.camera.position.x, cameraLookatPoint.x, 0.31),
              0,
              ballT) +
            easeIn(0, point.x, ballT);
          this.ball.position.y =
            easeIn(
              lerp(this.camera.position.y, cameraLookatPoint.y, 0.31),
              0,
              ballT) +
            easeIn(0, point.y, ballT);
          this.ball.position.z =
            easeIn(
              lerp(this.camera.position.z, cameraLookatPoint.z, 0.31),
              0,
              ballT) +
            easeIn(0, point.z, ballT);
        }


        const lightsInTunnel = 16;
        const wrapDistance = 0.1;
        for (let i = 0; i < this.tunnelLights.length; i++) {
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

      this.ball.material.uniforms.ambientLightIntensity.value = easeIn(
        this.ball.material.uniforms.ambientLightIntensity.value,
        0.2,
        (frame - FRAME_FOR_BEAN(3816 - 24)) / (
          FRAME_FOR_BEAN(3816) - FRAME_FOR_BEAN(3816 - 24)));

      this.gridball.material.uniforms.frame.value = frame;
      this.ball.material.uniforms.frame.value = frame;
      this.ball.rotation.copy(this.gridball.rotation);
      this.ballLight.position.copy(this.ball.position);
      this.gridball.position.copy(this.ball.position);
      this.textball.position.copy(this.ball.position);

      this.bg.material.map = this.inputs.featurebg.getValue();
      if (this.bg.material.map) {
        /*
        this.bg.material.map.repeat.set(1.5, 1.5);
        this.bg.material.map.offset.set(-0.25, -0.25);
        */
      }
      this.bg.material.needsUpdate = true;

      this.cameraPreviousPosition.copy(this.camera.position);
      this.camera.position.copy(position);
      this.camera.position.add(this.cameraShakePosition);
      this.camera.rotation.x += this.cameraShakeRotation.x;
      this.camera.rotation.y += this.cameraShakeRotation.y;
      this.camera.rotation.z += this.cameraShakeRotation.z;

      demo.nm.nodes.bloom.opacity = 0;
    }

    render(renderer) {
      renderer.setClearColor(new THREE.Color(0), 0);
      renderer.render(this.scene, this.camera, this.renderTarget1, true);
      this.outputs.render.value = this.renderTarget1.texture;
      renderer.render(this.tunnelScene, this.camera, this.renderTarget2, true);
      this.outputs.renderTunnel.value = this.renderTarget2.texture;
    }
  }

  global.features = features;
})(this);
