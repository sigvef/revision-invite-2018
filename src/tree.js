(function(global) {
  class tree extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput(),
        },
        inputs: {
          globeTextures: new NIN.TextureInput(),
        }
      });

      var light = new THREE.PointLight(0xaaaaaa, 0.3, 100);
      light.position.set(0, 5, 10);
      this.scene.add(light);

      const ambient = new THREE.AmbientLight(0xffffff);
      ambient.intensity = 0.1;
      this.scene.add(ambient);

      const backlight = new THREE.PointLight(0x555555, 1, 100);
      backlight.intensity = 100000;
      backlight.position.set(0, -5, -20);
      this.scene.add(backlight);

      const frontlight = new THREE.DirectionalLight();
      frontlight.position.set(0, 1, 0);
      this.scene.add(frontlight);

      this.cameraPreviousPosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakePosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakeVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAcceleration = new THREE.Vector3(0, 0, 0);
      this.cameraShakeRotation = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularAcceleration = new THREE.Vector3(0, 0, 0);

      this.root = new THREE.Mesh(
        new THREE.SphereGeometry(.5, 32, 32),
        new THREE.MeshStandardMaterial({
          color: 0xccaaff,
          roughness: 0,
          metalness: 1,
        })
      );
      this.root.position.z = -2;
      this.scene.add(this.root);

      this.background = new THREE.Mesh(
        new THREE.PlaneGeometry(80, 80, 1),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(1, 73 / 255, 130 / 255),
          emissive: 0xffffff,
          emissiveIntensity: 0,
          roughness: 1,
          metalness: 0,
        })
      );
      this.background.position.z = -5;
      this.scene.add(this.background);

      this.balls = [
        {
          letter: 'R',
          bean: 0,
          x: -2,
          y: 4.5,
        },
        {
          letter: 'E',
          bean: 9,
          x: 2,
          y: 4.5,
        },
        {
          letter: 'V',
          bean: 24,
          x: -4,
          y: 1.5,
        },
        {
          letter: 'I',
          bean: 33,
          x: 0,
          y: 1.5,
        },
        {
          letter: 'S',
          bean: 42,
          x: 4,
          y: 1.5,
        },
        {
          letter: 'I',
          bean: 92,
          x: -2,
          y: -1.5,
        },
        {
          letter: 'O',
          bean: 92,
          x: 2,
          y: -1.5,
        },
        {
          letter: 'N',
          bean: 140,
          x: 0,
          y: -4.5,
        },
      ];

      this.ballMeshes = [];
      for (const ball of this.balls) {
        const canvas = document.createElement('canvas');
        canvas.width = 8 * GU;
        canvas.height = 8 * GU;
        const ctx = canvas.getContext('2d');
        ctx.fillRect(0, 0, 8 * GU, 8 * GU);
        ctx.scale(GU, GU);
        ctx.translate(4, 4);
        ctx.rotate(Math.PI / 6);
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = GU * 5;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 4pt schmalibre';
        ctx.fillStyle = 'white';
        ctx.fillText(
          ball.letter,
          0,
          1.6
        );
        const output = new THREE.VideoTexture(canvas);
        output.minFilter = THREE.LinearFilter;
        output.magFilter = THREE.LinearFilter;
        output.needsUpdate = true;
        const ballMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(1, 1, 0.5, 6),
          new THREE.MeshStandardMaterial({
            color: 0x00e04f,
            bumpMap: output,
            bumpScale: -0.01,
            metalness: 1,
            roughness: 0.3,
            emissive: 0xffffff,
            emissiveIntensity: 1,
            emissiveMap: output,
            shading: THREE.FlatShading,
          })
        );
        ballMesh.position.set(ball.x, ball.y, 0);
        ballMesh.rotation.x = Math.PI / 2;
        ballMesh.rotation.y = Math.PI / 2;
        ballMesh.rotation.y += Math.PI / 6 * 2 / 2;
        this.ballMeshes.push(ballMesh);
        this.scene.add(ballMesh);
      }

      this.cylinders = [];
      for (const ball of this.balls) {
        const direction = new THREE.Vector3().subVectors(
          new THREE.Vector3(ball.x, ball.y, 0),
          new THREE.Vector3(0, 0, -2)
        );
        const orientation = new THREE.Matrix4();
        orientation.lookAt(
          new THREE.Vector3(0, 0, -2),
          new THREE.Vector3(ball.x, ball.y, 0),
          new THREE.Object3D().up
        );
        const m = new THREE.Matrix4();
        m.set(1, 0, 0, 0,
              0, 0, 1, 0,
              0, -1, 0, 0,
              0, 0, 0, 1);
        orientation.multiply(m);
        const cylinder = new THREE.Mesh(
          new THREE.CylinderGeometry(.2, .2, direction.length(), 6),
          new THREE.MeshStandardMaterial({
            color: 0xccaacc,
            shading: THREE.FlatShading,
          })
        );
        cylinder.applyMatrix(orientation);
        cylinder.position.copy(new THREE.Vector3().addVectors(new THREE.Vector3(0, 0, -2), direction.multiplyScalar(0.5)));
        this.scene.add(cylinder);
        this.cylinders.push(cylinder);
      }
    }

    update(frame) {
      demo.nm.nodes.bloom.opacity = 0.5;

      const cameraPosition = new THREE.Vector3(0, 0, 0);
      const cameraLookAt = new THREE.Vector3(0, 0, 0);

      for (const [index, ball] of this.balls.entries()) {
        const startBEAN = 84.5 * 48 + ball.bean;
        const t = (frame - FRAME_FOR_BEAN(startBEAN) + 8) / 8;
        this.ballMeshes[index].position.set(
          easeIn(0, ball.x, t),
          easeIn(0, ball.y, t),
          easeIn(-2, 0, t)
        );
        this.ballMeshes[index].scale.set(
          easeIn(0.0001, 1, t),
          easeIn(0.0001, 1, t),
          easeIn(0.0001, 1, t)
        );

        this.cylinders[index].position.set(
          easeIn(0, ball.x / 2, t),
          easeIn(0, ball.y / 2, t),
          easeIn(-2, -1, t)
        );
        this.cylinders[index].scale.set(
          easeIn(1, 1, t),
          easeIn(0.0001, 1, t),
          easeIn(1, 1, t)
        );
      }

      if (BEAN < 85 * 48) {
        const t = (frame - FRAME_FOR_BEAN(84.5 * 48)) / (FRAME_FOR_BEAN(85 * 48) - FRAME_FOR_BEAN(84.5 * 48));
        cameraPosition.set(
          0,
          lerp(0, 3, t),
          lerp(13, 9, t)
        );
        cameraLookAt.set(
          0,
          lerp(0, 3, t),
          lerp(0, 0, t)
        );
      } else if (BEAN < 86.25 * 48) {
        const t = (frame - FRAME_FOR_BEAN(85 * 48)) / (FRAME_FOR_BEAN(86.25 * 48) - FRAME_FOR_BEAN(85 * 48));
        cameraPosition.set(
          lerp(2, 5, t),
          lerp(2, 1, t),
          lerp(4, 9, t)
        );
        cameraLookAt.set(
          lerp(-1, 1.5, t),
          lerp(1.5, 1.5, t),
          lerp(0, 0, t)
        );
      } else if (BEAN < 87.25 * 48) {
        const t = (frame - FRAME_FOR_BEAN(86.25 * 48)) / (FRAME_FOR_BEAN(87.25 * 48) - FRAME_FOR_BEAN(86.25 * 48));
        cameraPosition.set(
          0,
          lerp(-2, -3, t),
          lerp(5, 6, t)
        );
        cameraLookAt.set(
          0,
          lerp(-2, -1, t),
          0
        );
      } else {
        const t = (frame - FRAME_FOR_BEAN(87.25 * 48)) / (FRAME_FOR_BEAN(88.5 * 48) - FRAME_FOR_BEAN(87.25 * 48));
        cameraPosition.set(
          0,
          lerp(7, 2, t),
          lerp(10, 17, t)
        );
        cameraLookAt.set(
          0,
          lerp(-4, 0, t),
          lerp(0, 0, t)
        );
      }

      const spinnerT = lerp(0, 1, (frame - FRAME_FOR_BEAN(4056 + 24 + 9 + 9)) / 100);
      for(let i = 0; i < this.ballMeshes.length; i++) {
        const ball = this.ballMeshes[i];
        ball.rotation.y = easeOut(
            Math.PI / 2 + Math.PI / 6,
            Math.PI / 2 + Math.PI / 6 -3 * Math.PI * 2,
            Math.sqrt(spinnerT)) -
          Math.max((frame - FRAME_FOR_BEAN(4056 + 24 +9 +9)) / 60 / 60 * 115, 0);
      }

      if(BEAT) {
        switch(BEAN) {
        case 4056:
        case 4056 + 9:
        case 4056 + 24:
        case 4056 + 24 + 9:
        case 4056 + 24 + 9 + 9:
        case 4128 + 12 + 9:
        case 4128 + 12 + 9 + 48:
          this.cameraShakeVelocity.x = this.camera.position.x -
            this.cameraPreviousPosition.x;
          this.cameraShakeVelocity.y = this.camera.position.y -
            this.cameraPreviousPosition.y;
          this.cameraShakeVelocity.z = this.camera.position.z -
            this.cameraPreviousPosition.z;
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

      this.cameraPreviousPosition.copy(this.camera.position);
      this.camera.position.copy(cameraPosition);
      this.camera.position.add(this.cameraShakePosition);
      this.camera.lookAt(cameraLookAt);
      this.camera.rotation.x += this.cameraShakeRotation.x;
      this.camera.rotation.y += this.cameraShakeRotation.y;
      this.camera.rotation.z += this.cameraShakeRotation.z;
    }
  }

  global.tree = tree;
})(this);
