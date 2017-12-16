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

      const ambient = new THREE.AmbientLight(0xffffff);
      this.scene.add(ambient);

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(0, 0, 20);
      this.scene.add(light);

      const backlight = new THREE.PointLight(0x555555, 1, 100);
      backlight.intensity = 10;
      backlight.position.set(0, -5, -20);
      this.scene.add(backlight);

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
          color: 0x373c3f,
          roughness: 1,
          metalness: 0,
        })
      );
      this.root.position.z = -2;
      this.scene.add(this.root);

      this.background = new THREE.Mesh(
        new THREE.PlaneGeometry(120, 120, 1),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(255 / 255, 73 / 255, 130 / 255),
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
          middleBean: 79,
          middleX: -6,
          middleY: 3.5,
          finalBean: 123,
          finalX: -6,
          finalY: 2.5
        },
        {
          letter: 'E',
          bean: 9,
          x: 2,
          y: 4.5,
          middleBean: 81,
          middleX: -2,
          middleY: 3.5,
          finalBean: 125,
          finalX: -2,
          finalY: 2.5
        },
        {
          letter: 'V',
          bean: 24,
          x: -4,
          y: 1.5,
          middleBean: 85,
          middleX: 2,
          middleY: 3.5,
          finalBean: 127,
          finalX: 2,
          finalY: 2.5
        },
        {
          letter: 'I',
          bean: 33,
          x: 0,
          y: 1.5,
          middleBean: 83,
          middleX: 6,
          middleY: 3.5,
          finalBean: 129,
          finalX: 6,
          finalY: 2.5
        },
        {
          letter: 'S',
          bean: 42,
          x: 4,
          y: 1.5,
          middleBean: 88,
          middleX: -6,
          middleY: -4.5,
          finalBean: 132,
          finalX: -6,
          finalY: -2.5
        },
        {
          letter: 'I',
          bean: 91,
          x: -2,
          y: -4.5,
          middleBean: 132,
          middleX: -2,
          middleY: -2.5,
          finalBean: 150,
          finalX: -2,
          finalY: -2.5
        },
        {
          letter: 'O',
          bean: 94,
          x: 2,
          y: -4.5,
          middleBean: 132,
          middleX: 2,
          middleY: -2.5,
          finalBean: 150,
          finalX: 2,
          finalY: -2.5
        },
        {
          letter: 'N',
          bean: 140,
          x: 6,
          y: -2.5,
          middleBean: 150,
          middleX: 6,
          middleY: -2.5,
          finalBean: 150,
          finalX: 6,
          finalY: -2.5
        },
      ];

      this.ballMeshes = [];
      for (const ball of this.balls) {
        const canvas = document.createElement('canvas');
        canvas.width = 2 * GU;
        canvas.height = 2 * GU;
        const ctx = canvas.getContext('2d');
        const output = new THREE.VideoTexture(canvas);
        output.minFilter = THREE.LinearFilter;
        output.magFilter = THREE.LinearFilter;
        output.needsUpdate = true;
        const hexBg = new THREE.MeshStandardMaterial({
          color: 0x77e15d,
          metalness: 0,
          roughness: 1,
          shading: THREE.FlatShading,
        });
        const ballMesh = new THREE.Mesh(
          new THREE.CylinderGeometry(1, 1, 0.5, 6),
          new THREE.MultiMaterial([
            hexBg,
            new THREE.MeshStandardMaterial({
              bumpMap: output,
              bumpScale: -0.01,
              metalness: 0,
              roughness: 1,
              map: output,
              shading: THREE.FlatShading,
            }),
            hexBg,
            hexBg,
            hexBg,
            hexBg,
            hexBg,
            hexBg,
          ])
        );
        ballMesh.output = output;
        ballMesh.canvas = canvas;
        ballMesh.ctx = ctx;
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
            color: 0x373c3f,
            shading: THREE.FlatShading,
            roughness: 1,
            metalness: 0,
          })
        );
        cylinder.applyMatrix(orientation);
        cylinder.position.copy(new THREE.Vector3().addVectors(new THREE.Vector3(0, 0, -2), direction.multiplyScalar(0.5)));
        this.scene.add(cylinder);
        this.cylinders.push(cylinder);
      }
    }

    update(frame) {
      demo.nm.nodes.bloom.opacity = 0;

      const scale = lerp(0.0001, 1, (frame - FRAME_FOR_BEAN(84 * 48 + 18)) / 6);
      this.root.scale.set(scale, scale, scale);
      /*
      for (const cylinder of this.cylinders) {
        cylinder.scale.set(scale, scale, scale);
      }
      */

      const cameraPosition = new THREE.Vector3(0, 0, 0);
      const cameraLookAt = new THREE.Vector3(0, 0, 0);

      for (const [index, ball] of this.balls.entries()) {
        if (BEAN < 84.5 * 48 + ball.middleBean - 4) {
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
            lerp(0.0001, 1, frame >= FRAME_FOR_BEAN(startBEAN) - 8),
            easeIn(0.0001, 1, t),
            lerp(0.0001, 1, frame >= FRAME_FOR_BEAN(startBEAN) - 8)
          );

          const orientation = new THREE.Matrix4();
          orientation.lookAt(
            new THREE.Vector3(0, 0, -2),
            new THREE.Vector3(
              easeIn(0, ball.x, t),
              easeIn(0, ball.y, t),
              0
            ),
            new THREE.Object3D().up
          );
          const m = new THREE.Matrix4();
          m.set(1, 0, 0, 0,
                0, 0, 1, 0,
                0, -1, 0, 0,
                0, 0, 0, 1);
          orientation.multiply(m);
          this.cylinders[index].setRotationFromMatrix(orientation);
        } else if (BEAN < 84.5 * 48 + ball.finalBean - 4) {
          const startBEAN = 84.5 * 48 + ball.middleBean;
          const t = (frame - FRAME_FOR_BEAN(startBEAN) + 4) / 4;

          this.ballMeshes[index].position.set(
            easeIn(ball.x, ball.middleX, t),
            easeIn(ball.y, ball.middleY, t),
            0
          );

          const orientation = new THREE.Matrix4();
          orientation.lookAt(
            new THREE.Vector3(0, 0, -2),
            new THREE.Vector3(
              easeIn(ball.x, ball.middleX, t),
              easeIn(ball.y, ball.middleY, t),
              0
            ),
            new THREE.Object3D().up
          );
          const m = new THREE.Matrix4();
          m.set(1, 0, 0, 0,
                0, 0, 1, 0,
                0, -1, 0, 0,
                0, 0, 0, 1);
          orientation.multiply(m);
          this.cylinders[index].setRotationFromMatrix(orientation);

          this.cylinders[index].position.set(
            easeIn(ball.x / 2, ball.middleX / 2, t),
            easeIn(ball.y / 2, ball.middleY / 2, t),
            -1
          );
          const oldDirection = new THREE.Vector3().subVectors(
            new THREE.Vector3(ball.x, ball.y, 0),
            new THREE.Vector3(0, 0, -2)
          );
          const direction = new THREE.Vector3().subVectors(
            new THREE.Vector3(
              easeIn(ball.x, ball.middleX, t),
              easeIn(ball.y, ball.middleY, t),
              0
            ),
            new THREE.Vector3(0, 0, -2)
          );
          this.cylinders[index].scale.set(
            1,
            easeIn(1, direction.length() / oldDirection.length(), t),
            1
          );
        } else {
          const startBEAN = 84.5 * 48 + ball.finalBean;
          const t = (frame - FRAME_FOR_BEAN(startBEAN) + 4) / 4;

          this.ballMeshes[index].position.set(
            easeIn(ball.middleX, ball.finalX, t),
            easeIn(ball.middleY, ball.finalY, t),
            0
          );

          const orientation = new THREE.Matrix4();
          orientation.lookAt(
            new THREE.Vector3(0, 0, -2),
            new THREE.Vector3(
              easeIn(ball.middleX, ball.finalX, t),
              easeIn(ball.middleY, ball.finalY, t),
              0
            ),
            new THREE.Object3D().up
          );
          const m = new THREE.Matrix4();
          m.set(1, 0, 0, 0,
                0, 0, 1, 0,
                0, -1, 0, 0,
                0, 0, 0, 1);
          orientation.multiply(m);
          this.cylinders[index].setRotationFromMatrix(orientation);

          this.cylinders[index].position.set(
            easeIn(ball.middleX / 2, ball.finalX / 2, t),
            easeIn(ball.middleY / 2, ball.finalY / 2, t),
            -1
          );
          const oldDirection = new THREE.Vector3().subVectors(
            new THREE.Vector3(ball.x, ball.y, 0),
            new THREE.Vector3(0, 0, -2)
          );
          const middleDirection = new THREE.Vector3().subVectors(
            new THREE.Vector3(ball.middleX, ball.middleY, 0),
            new THREE.Vector3(0, 0, -2)
          );
          const direction = new THREE.Vector3().subVectors(
            new THREE.Vector3(
              easeIn(ball.middleX, ball.finalX, t),
              easeIn(ball.middleY, ball.finalY, t),
              0
            ),
            new THREE.Vector3(0, 0, -2)
          );
          this.cylinders[index].scale.set(
            1,
            easeIn(
              middleDirection.length() / oldDirection.length(),
              direction.length() / oldDirection.length(),
              t
            ),
            1
          );
        }
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
      } else if (BEAN < 86.3125 * 48) {
        const t = (frame - FRAME_FOR_BEAN(85 * 48)) / (FRAME_FOR_BEAN(86.3125 * 48) - FRAME_FOR_BEAN(85 * 48));
        cameraPosition.set(
          easeOut(2, 6, t),
          lerp(2, 3.5, t),
          lerp(4, 10, t)
        );
        cameraLookAt.set(
          easeOut(-1, 2, t),
          lerp(1.5, 3, t),
          lerp(0, 0, t)
        );
      } else if (BEAN < 87.3125 * 48) {
        const t = (frame - FRAME_FOR_BEAN(86.3125 * 48)) / (FRAME_FOR_BEAN(87.3125 * 48) - FRAME_FOR_BEAN(86.3125 * 48));
        cameraPosition.set(
          0,
          lerp(-4, -5, t),
          lerp(11, 7, t)
        );
        cameraLookAt.set(
          0,
          lerp(-4, -3, t),
          0
        );
      } else {
        const t = (frame - FRAME_FOR_BEAN(87.3125 * 48)) / (FRAME_FOR_BEAN(88.5 * 48) - FRAME_FOR_BEAN(87.3125 * 48));
        cameraPosition.set(
          lerp(-0.95, 0, t),
          lerp(1.15, 0, t),
          lerp(4, 15, t)
        );
        cameraLookAt.set(
          lerp(6.25, 0, t),
          lerp(-3, 0, t),
          lerp(-5, 0, t)
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

      this.rotation = this.ballMeshes[0].rotation.y;

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

    resize() {
      for (const ballMesh of this.ballMeshes) {
        ballMesh.canvas.width = 2 * GU;
        ballMesh.canvas.height = 2 * GU;
      }
    }

    render(renderer) {
      const offsetX = Math.sin(this.rotation) * 0.15;
      const offsetY = -Math.cos(this.rotation) * 0.15;
      for(let i = 0; i < this.ballMeshes.length; i++) {
        const ballMesh = this.ballMeshes[i];
        const ball = this.balls[i];
        if (BEAN < 84.5 * 48 + ball.bean - 8) {
          continue;
        }
        const ctx = ballMesh.ctx;
        ctx.fillStyle = '#77e15d';
        ctx.fillRect(0, 0, ballMesh.canvas.width, ballMesh.canvas.height);
        ctx.save();
        ctx.scale(GU, GU);
        ctx.translate(1, 1);
        ctx.rotate(Math.PI / 6);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 1pt schmalibre';
        ctx.fillStyle = 'rgb(55, 60, 63)';
        ctx.fillText(
          ball.letter,
          offsetX,
          offsetY - 0.075
        );
        ctx.fillStyle = 'white';
        ctx.fillText(
          ball.letter,
          0,
          -0.075
        );
        ctx.restore();
        ballMesh.output.needsUpdate = true;
      }
      super.render(renderer);
    }
  }

  global.tree = tree;
})(this);
