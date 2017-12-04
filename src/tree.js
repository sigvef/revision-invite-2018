(function(global) {
  class tree extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      var light = new THREE.PointLight(0xaaaaaa, 0.3, 100);
      light.position.set(0, 5, 10);
      this.scene.add(light);

      const ambient = new THREE.AmbientLight(0xcccccc);
      this.scene.add(ambient);

      const backlight = new THREE.PointLight(0x555555, 1, 100);
      backlight.position.set(0, -5, -20);
      this.scene.add(backlight);

      this.camera.position.z = 15;

      this.root = new THREE.Mesh(
        new THREE.SphereGeometry(.5, 32, 32),
        new THREE.MeshStandardMaterial({color: 0xccaaff})
      );
      this.root.position.z = -2;
      this.scene.add(this.root);

      this.background = new THREE.Mesh(
        new THREE.PlaneGeometry(80, 80, 1),
        new THREE.MeshStandardMaterial({color: 0xff88aa})
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
        ctx.fillStyle = '#00e04f';
        ctx.fillRect(0, 0, 8 * GU, 8 * GU);
        ctx.textAlign = 'center';
        ctx.font = 'bold 80pt calibre';
        ctx.fillStyle = 'white';
        ctx.fillText(
          ball.letter,
          4 * GU,
          4 * GU
        );
        const output = new THREE.VideoTexture(canvas);
        output.minFilter = THREE.LinearFilter;
        output.magFilter = THREE.LinearFilter;
        output.needsUpdate = true;
        const ballMesh = new THREE.Mesh(
          new THREE.SphereGeometry(1, 32, 32),
          new THREE.MeshStandardMaterial({color: 0xffffff, map: output})
        );
        ballMesh.position.set(ball.x, ball.y, 0);
        ballMesh.rotation.y = -Math.PI/2;
        ballMesh.rotation.x = 0.5;
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
          new THREE.CylinderGeometry(.2, .2, direction.length(), 32),
          new THREE.MeshStandardMaterial({color: 0xccaacc})
        );
        cylinder.applyMatrix(orientation);
        cylinder.position.copy(new THREE.Vector3().addVectors(new THREE.Vector3(0, 0, -2), direction.multiplyScalar(0.5)));
        this.scene.add(cylinder);
        this.cylinders.push(cylinder);
      }
    }

    update(frame) {
      super.update(frame);

      for (const [index, ball] of this.balls.entries()) {
        const startBEAN = 84.5 * 48 + ball.bean;
        const t = (frame - FRAME_FOR_BEAN(startBEAN)) / 8;
        this.ballMeshes[index].position.set(
          lerp(0, ball.x, t),
          lerp(0, ball.y, t),
          lerp(-2, 0, t)
        );
        this.ballMeshes[index].scale.set(
          lerp(0, 1, t),
          lerp(0, 1, t),
          lerp(0, 1, t)
        );

        this.cylinders[index].position.set(
          lerp(0, ball.x / 2, t),
          lerp(0, ball.y / 2, t),
          lerp(-2, -1, t)
        );
        this.cylinders[index].scale.set(
          lerp(1, 1, t),
          lerp(0, 1, t),
          lerp(1, 1, t)
        );
      }

      if (BEAN < 85 * 48) {
        const t = (frame - FRAME_FOR_BEAN(84.5 * 48)) / (FRAME_FOR_BEAN(85 * 48) - FRAME_FOR_BEAN(84.5 * 48));
        this.camera.position.set(
          0,
          lerp(0, 3, t),
          lerp(13, 9, t)
        );
        this.camera.lookAt(new THREE.Vector3(
          0,
          lerp(0, 3, t),
          lerp(0, 0, t)
        ));
      } else if (BEAN < 86.25 * 48) {
        const t = (frame - FRAME_FOR_BEAN(85 * 48)) / (FRAME_FOR_BEAN(86.25 * 48) - FRAME_FOR_BEAN(85 * 48));
        this.camera.position.set(
          lerp(2, 5, t),
          lerp(2, 1, t),
          lerp(4, 9, t)
        );
        this.camera.lookAt(new THREE.Vector3(
          lerp(-1, 1.5, t),
          lerp(1.5, 1.5, t),
          lerp(0, 0, t)
        ));
      } else if (BEAN < 87.25 * 48) {
        const t = (frame - FRAME_FOR_BEAN(86.25 * 48)) / (FRAME_FOR_BEAN(87.25 * 48) - FRAME_FOR_BEAN(86.25 * 48));
        this.camera.position.set(
          0,
          lerp(-2, -3, t),
          lerp(5, 6, t)
        );
        this.camera.lookAt(new THREE.Vector3(
          0,
          lerp(-2, -1, t),
          0
        ));
      } else {
        const t = (frame - FRAME_FOR_BEAN(87.25 * 48)) / (FRAME_FOR_BEAN(88.5 * 48) - FRAME_FOR_BEAN(87.25 * 48));
        this.camera.position.set(
          0,
          lerp(7, 2, t),
          lerp(10, 17, t)
        );
        this.camera.lookAt(new THREE.Vector3(
          0,
          lerp(-4, 0, t),
          lerp(0, 0, t)
        ));
      }
    }
  }

  global.tree = tree;
})(this);
