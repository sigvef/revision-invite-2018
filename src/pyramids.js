(function(global) {
  class pyramids extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        },
        inputs: {
          griddymid: new NIN.Input(),
        }
      });

      this.ps = new global.ParticleSystem({color: new THREE.Color(1, 1, 1)});
      this.scene.add(this.ps.particles);


      this.cameraPreviousPosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakePosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakeVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAcceleration = new THREE.Vector3(0, 0, 0);
      this.cameraShakeRotation = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularAcceleration = new THREE.Vector3(0, 0, 0);

      const ambientLight = new THREE.AmbientLight(0xffffff);
      ambientLight.intensity = 0.1;
      this.scene.add(ambientLight);

      this.pyramids = [{
      /* R */
        upperFromBean: 2208, 
        upperToBean: 2208 + 24, 
        spinBean: 2208 + 24,
        lowerFromBean: 0, 
        lowerToBean: 0, 
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 24, 
        lowerToBean: 2256 + 24 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 24 + 48, 
        lowerToBean: 2256 + 24 + 48 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 24 + 48 * 2, 
        lowerToBean: 2256 + 24 + 48 * 2 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 24 + 48 * 1.5 + 9, 
        lowerToBean: 2256 + 24 + 48 * 1.5 + 6 + 9,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 24 + 48 * 1.5, 
        lowerToBean: 2256 + 24 + 48 * 1.5 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 24 + 48, 
        lowerToBean: 2256 + 24 + 48 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 24 + 48 * 2, 
        lowerToBean: 2256 + 24 + 48 * 2 + 6,

      /* E */
      }, {
        upperFromBean: 2256 + 48 * 3, 
        upperToBean: 2256 + 48 * 3 + 24,
        lowerFromBean: 0, 
        lowerToBean: 0,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 4, 
        lowerToBean: 2256 + 48 * 4 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 4, 
        lowerToBean: 2256 + 48 * 4 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 5, 
        lowerToBean: 2256 + 48 * 5 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 6, 
        lowerToBean: 2256 + 48 * 6 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 6, 
        lowerToBean: 2256 + 48 * 6 + 6,

      /* V */
      }, {
        upperFromBean: 2256 + 48 * 3, 
        upperToBean: 2256 + 48 * 3 + 24,
        lowerFromBean: 0, 
        lowerToBean: 0,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 4, 
        lowerToBean: 2256 + 48 * 4 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 5, 
        lowerToBean: 2256 + 48 * 5 + 6,

      /* I */
      }, {
        upperFromBean: 2256 + 48 * 3, 
        upperToBean: 2256 + 48 * 3 + 24,
        lowerFromBean: 0, 
        lowerToBean: 0,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 4, 
        lowerToBean: 2256 + 48 * 4 + 6,

      /* S */
      }, {
        upperFromBean: 2256 + 48 * 2, 
        upperToBean: 2256 + 48 * 3,
        lowerFromBean: 0, 
        lowerToBean: 0,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 3.25, 
        lowerToBean: 2256 + 48 * 3.25 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 3.5, 
        lowerToBean: 2256 + 48 * 3.5 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 3.75, 
        lowerToBean: 2256 + 48 * 3.75 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 4, 
        lowerToBean: 2256 + 48 * 4 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 4.25, 
        lowerToBean: 2256 + 48 * 4.25 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 4.5, 
        lowerToBean: 2256 + 48 * 4.5 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 4.75, 
        lowerToBean: 2256 + 48 * 4.75 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 5, 
        lowerToBean: 2256 + 48 * 5 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 5.25 - 2,
        lowerToBean: 2256 + 48 * 5.25 + 6 - 2,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 5.5, 
        lowerToBean: 2256 + 48 * 5.5 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 5.75 - 2, 
        lowerToBean: 2256 + 48 * 5.75 + 6 - 2,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 6, 
        lowerToBean: 2256 + 48 * 6 + 6,

      /* I */
      }, {
        upperFromBean: 2256 + 48 * 2, 
        upperToBean: 2256 + 48 * 3,
        lowerFromBean: 0, 
        lowerToBean: 0,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 4, 
        lowerToBean: 2256 + 48 * 4 + 6,

      /* O */
      }, {
        upperFromBean: 2256 + 48 * 2, 
        upperToBean: 2256 + 48 * 3,
        lowerFromBean: 0, 
        lowerToBean: 0,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 3.25, 
        lowerToBean: 2256 + 48 * 3.25 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 3.5, 
        lowerToBean: 2256 + 48 * 3.5 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 3.75, 
        lowerToBean: 2256 + 48 * 3.75 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 4, 
        lowerToBean: 2256 + 48 * 4 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 4.25, 
        lowerToBean: 2256 + 48 * 4.25 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 4.5, 
        lowerToBean: 2256 + 48 * 4.5 + 6,
      }, {
        upperFromBean: 0, 
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 4.75, 
        lowerToBean: 2256 + 48 * 4.75 + 6,
      /* N */
      }, {
        upperFromBean: 2256 + 48 * 2, 
        upperToBean: 2256 + 48 * 3,
        lowerFromBean: 0, 
        lowerToBean: 0,
      }, {
        upperFromBean: 0,
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 4,
        lowerToBean: 2256 + 48 * 4 + 6,
      }, {
        upperFromBean: 0,
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 5,
        lowerToBean: 2256 + 48 * 5 + 6,
      }, {
        upperFromBean: 0,
        upperToBean: 0,
        lowerFromBean: 2256 + 48 * 6,
        lowerToBean: 2256 + 48 * 6 + 6,
      }];

      this.coords = [
        /* R */
        {x: 121, z: 669},
        {x: 121, z: 539},
        {x: 121, z: 410},
        {x: 255, z: 410},
        {x: 303, z: 460},
        {x: 303, z: 512},
        {x: 254, z: 540},
        {x: 303, z: 659},

        /* E */
        {x: 386, z: 659},
        {x: 572, z: 659},
        {x: 386, z: 539},
        {x: 496, z: 539},
        {x: 386, z: 410},
        {x: 582, z: 410},

        /* V */
        {x: 622, z: 410},
        {x: 712, z: 659},
        {x: 808, z: 410},

        /* I */
        {x: 874, z: 410},
        {x: 874, z: 659},

        /* S */
        {x: 959, z: 610},
        {x: 1003, z: 659},
        {x: 1092, z: 659},
        {x: 1133, z: 610},
        {x: 1133, z: 558},
        {x: 1091, z: 539},
        {x: 1003, z: 539},
        {x: 1003, z: 539},
        {x: 959, z: 512},
        {x: 959, z: 460},
        {x: 1003, z: 410},
        {x: 1091, z: 410},
        {x: 1133, z: 460},

        /* I */
        {x: 1216, z: 410},
        {x: 1216, z: 659},

        /* O */
        {x: 1298, z: 460},
        {x: 1343, z: 410},
        {x: 1435, z: 410},
        {x: 1481, z: 460},
        {x: 1481, z: 610},
        {x: 1425, z: 659},
        {x: 1343, z: 659},
        {x: 1298, z: 610},

        /* N */
        {x: 1565, z: 659},
        {x: 1565, z: 410},
        {x: 1748, z: 659},
        {x: 1748, z: 410},
      ];

      this.edges = [
        /* R */
        {from: 0, to: 1, startBean: 2232, endBean: 2232 + 48},
        {from: 1, to: 2, startBean: 2232 + 48, endBean: 2232 + 48 * 2},
        {from: 1, to: 6, startBean: 2232 + 48, endBean: 2232 + 48 * 2},
        {from: 6, to: 5, startBean: 2232 + 48 * 2, endBean: 2232 + 48 * 2.5},
        {from: 5, to: 4, startBean: 2232 + 48 * 2.5, endBean: 2232 + 48 * 3 - 24 + 9},
        {from: 4, to: 3, startBean: 2232 + 48 * 3, endBean: 2232 + 48 * 3.25},
        {from: 6, to: 7, startBean: 2232 + 48 * 2, endBean: 2232 + 48 * 3},
        {from: 2, to: 3, startBean: 2232 + 48 * 2, endBean: 2232 + 48 * 3},

        /* E */
        {from: 8, to: 9, startBean: 2400, endBean: 2400 + 48},
        {from: 8, to: 10, startBean: 2400, endBean: 2400 + 48},
        {from: 10, to: 11, startBean: 2400 + 48, endBean: 2400 + 48 * 2},
        {from: 10, to: 12, startBean: 2400 + 48, endBean: 2400 + 48 * 2},
        {from: 12, to: 13, startBean: 2400 + 48 * 2, endBean: 2400 + 48 * 3},

        /* V */
        {from: 14, to: 15, startBean: 2400, endBean: 2400 + 48},
        {from: 15, to: 16, startBean: 2400 + 48, endBean: 2400 + 48 * 2},

        /* I */
        {from: 17, to: 18, startBean: 2400, endBean: 2400 + 48},

        /* S */
        {from: 19, to: 20, startBean: 2400, endBean: 2400 + 12},
        {from: 20, to: 21, startBean: 2400 + 12 * 1, endBean: 2400 + 12 * 2},
        {from: 21, to: 22, startBean: 2400 + 12 * 2, endBean: 2400 + 12 * 3},
        {from: 22, to: 23, startBean: 2400 + 12 * 3, endBean: 2400 + 12 * 4},
        {from: 23, to: 24, startBean: 2400 + 12 * 4, endBean: 2400 + 12 * 5},
        {from: 24, to: 25, startBean: 2400 + 12 * 5, endBean: 2400 + 12 * 6},
        {from: 25, to: 26, startBean: 2400 + 12 * 6, endBean: 2400 + 12 * 7},
        {from: 26, to: 27, startBean: 2400 + 12 * 7, endBean: 2400 + 12 * 8},
        {from: 27, to: 28, startBean: 2496, endBean: 2496 + 10},
        {from: 28, to: 29, startBean: 2496 + 10, endBean: 2400 + 12 * 10},
        {from: 29, to: 30, startBean: 2400 + 12 * 10, endBean: 2400 + 12 * 10 + 10},
        {from: 30, to: 31, startBean: 2400 + 12 * 10 + 10, endBean: 2400 + 12 * 12},

        /* I */
        {from: 32, to: 33, startBean: 2400, endBean: 2400 + 48},

        /* O */
        {from: 34, to: 35, startBean: 2400, endBean: 2400 + 12},
        {from: 35, to: 36, startBean: 2400 + 12 * 1, endBean: 2400 + 12 * 2},
        {from: 36, to: 37, startBean: 2400 + 12 * 2, endBean: 2400 + 12 * 3},
        {from: 37, to: 38, startBean: 2400 + 12 * 3, endBean: 2400 + 12 * 4},
        {from: 38, to: 39, startBean: 2400 + 12 * 4, endBean: 2400 + 12 * 5},
        {from: 39, to: 40, startBean: 2400 + 12 * 5, endBean: 2400 + 12 * 6},
        {from: 40, to: 41, startBean: 2400 + 12 * 6, endBean: 2400 + 12 * 7},
        {from: 41, to: 34, startBean: 2400 + 12 * 7, endBean: 2400 + 12 * 8},

        /* N */
        {from: 42, to: 43, startBean: 2400, endBean: 2400 + 48},
        {from: 43, to: 44, startBean: 2400 + 48 * 1, endBean: 2400 + 48 * 2},
        {from: 44, to: 45, startBean: 2400 + 48 * 2, endBean: 2400 + 48 * 3},
      ];

      this.camera.near = 0.1;
      this.camera.fov = 45;
      this.camera.updateProjectionMatrix();

      this.cameraLight = new THREE.PointLight(0xffffff, 1, 100);
      this.scene.add(this.cameraLight);

      this.groundMirror = new THREE.Mirror(demo.renderer, this.camera, {
        clipBias: 0.003,
        textureWidth: 16 * GU,
        textureHeight: 16 * GU,
        color: 'rgb(55, 60, 63)',
      });
      const planeGeo = new THREE.PlaneBufferGeometry(500, 500);
      const mirrorMesh = new THREE.Mesh(planeGeo, this.groundMirror.material);
      mirrorMesh.position.y = -0.375;
      mirrorMesh.add(this.groundMirror);
      mirrorMesh.rotateX(-Math.PI / 2);
      this.scene.add(mirrorMesh);

      this.mirrorOverlayMesh = new THREE.Mesh(
        planeGeo,
        new THREE.ShaderMaterial(SHADERS[options.shader])
      );
      this.mirrorOverlayMesh.rotateX(-Math.PI / 2);
      this.mirrorOverlayMesh.position.y = -0.5;
      this.mirrorOverlayMesh.material.uniforms.foregroundColor.value = new THREE.Vector4(
        0.02,
        0.00,
        0.02,
        0.8
      );
      this.mirrorOverlayMesh.material.uniforms.backgroundColor.value = new THREE.Vector4(
        0.04,
        0.00,
        0.04,
        0.8
      );
      this.mirrorOverlayMesh.material.transparent = true;
      this.scene.add(this.mirrorOverlayMesh);

      this.scene.add(new THREE.AmbientLight(0xffffff));

      this.pyramidMeshes = [];
      const pyramidGeometry = new THREE.ConeBufferGeometry(1, 1.2, 4, 1, true);
      const griddyMaterial = new THREE.ShaderMaterial(SHADERS.griddymid);
      griddyMaterial.transparent = true;
      griddyMaterial.side = THREE.DoubleSide;
      griddyMaterial.depthTest = false;
      griddyMaterial.blending = THREE.AdditiveBlending;
      const ballGeometry = new THREE.SphereBufferGeometry(0.12, 32, 32);
      const baseGeometry = new THREE.BoxBufferGeometry(1.8, 0.1, 1.8);
      for (let i = 0; i < this.coords.length; i++) {
        const coords = this.coords[i];
        const pyramidMesh = new THREE.Mesh(
          pyramidGeometry,
          griddyMaterial.clone());
        pyramidMesh.position.set(
            coords.x / 10,
            0.5,
            coords.z / 10);
        this.scene.add(pyramidMesh);
        this.pyramidMeshes.push(pyramidMesh);
        const ball = new THREE.Mesh(
            ballGeometry, new THREE.MeshBasicMaterial({color: 0xffffff}));
        pyramidMesh.add(ball);
        ball.position.y = 0.5;
        pyramidMesh.ball = ball;
        const base = new THREE.Mesh(
            baseGeometry, new THREE.ShaderMaterial(SHADERS.griddymidbox));
        base.material.uniforms.upper.value = 1;
        base.material.uniforms.lower.value = 0;
        base.rotation.y = Math.PI / 4;
        pyramidMesh.base = base;
        pyramidMesh.add(base);
        base.position.y = -.65;
      }

      const directionalLight = new THREE.DirectionalLight();
      directionalLight.position.set(1, 1, 1);
      this.scene.add(directionalLight);

      this.lasers = [];
      for(let i = 0; i < this.edges.length; i++) {
        let edge = this.edges[i];
        if(!edge.from) {
          edge = this.edges[0];
        }
        const coords = this.coords[edge.from];
        const next = this.coords[edge.to];
        const laserBeam = new global.Laser();
        this.scene.add(laserBeam.object3d);
        const object3d = laserBeam.object3d;
        object3d.position.x = coords.x / 10;
        object3d.position.y = 1;
        object3d.position.z = coords.z / 10;
        object3d.scale.x = Math.max(0.001, Math.sqrt(Math.pow(next.z - coords.z, 2) + Math.pow(next.x - coords.x, 2)) / 10);
        const angle = -Math.atan2(next.z - coords.z, next.x - coords.x);
        object3d.rotation.y = angle;
        this.lasers.push(laserBeam);
      }
    }

    warmup(renderer) {
      this.update(5775);
      this.render(renderer);
    }

    update(frame) {
      super.update(frame);

      this.ps.update(frame);

      if(BEAT) {
        switch(BEAN) {
        case 2232:
        case 2280:
        case 2328:
        case 2400:
        case 2424:
        case 2424 + 24:
        case 2424 + 24 + 9:
        case 2424 + 24 + 9 +9:
          this.cameraShakeVelocity.x = this.camera.position.x -
            this.cameraPreviousPosition.x;
          this.cameraShakeVelocity.y = this.camera.position.y -
            this.cameraPreviousPosition.y;
          this.cameraShakeVelocity.z = this.camera.position.z -
            this.cameraPreviousPosition.z;
        case 2208:
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

      const startBEAN = 46 * 12 * 4;
      const t = (frame - FRAME_FOR_BEAN(startBEAN)) / (FRAME_FOR_BEAN(54 * 12 * 4) - FRAME_FOR_BEAN(startBEAN));

      for (const index of this.coords.keys()) {
        let pyramid = this.pyramids[index];
        if(!pyramid) {
          pyramid =  this.pyramids[this.pyramids.length - 1];
        }
        const scale = 1 + (Math.random() - 0.5) * 0.5;
        const mesh = this.pyramidMeshes[index];
        mesh.ball.scale.set(scale, scale, scale);
        mesh.material.uniforms.lower.value = lerp(
            1, 0, (frame - FRAME_FOR_BEAN(pyramid.lowerFromBean)) / (
                FRAME_FOR_BEAN(pyramid.lowerToBean) - FRAME_FOR_BEAN(pyramid.lowerFromBean)));
        let t = (frame - FRAME_FOR_BEAN(pyramid.upperFromBean)) / (
                FRAME_FOR_BEAN(pyramid.upperToBean) - FRAME_FOR_BEAN(pyramid.upperFromBean));
        mesh.material.uniforms.upper.value = lerp(0, 1, t);
        mesh.material.uniforms.frame.value = frame;
        mesh.ball.visible = t > 0.999 && mesh.material.uniforms.lower.value < 0.99;

        mesh.base.visible = mesh.material.uniforms.lower.value < t;

        if(mesh.material.uniforms.lower.value < 0.999 && t > 0.999) {
          mesh.rotation.y = frame / 20;
        }
        mesh.rotation.y += easeOut(0, Math.PI, (frame - FRAME_FOR_BEAN(pyramid.spinBean || pyramid.lowerFromBean)) / 35);
      }

      //Use same random numbers for all lasers
      let rand1 = Math.random();
      let rand2 = Math.random();
      let rand3 = Math.random();
      let rand4 = Math.random();
      let rand5 = Math.random();

      for (let i = 0; i < this.lasers.length; i++) {

        if(frame < 6573){
          //First part of the scene each laser has a different seed
          //Done this way because Math.random doesn't support seeds
          let rand1 = Math.random();
          let rand2 = Math.random();
          let rand3 = Math.random();
          let rand4 = Math.random();
          let rand5 = Math.random();
        }
        const laser = this.lasers[i];
        laser.update(rand1, rand2, rand3, rand4, rand5);
        let edge = this.edges[i];
        if(!edge.from) {
          edge = this.edges[0];
        }
        const coords = this.coords[edge.from];
        const next = this.coords[edge.to];
        const length = Math.max(0.001, Math.sqrt(Math.pow(next.z - coords.z, 2) + Math.pow(next.x - coords.x, 2)) / 10);
        const localT = (frame - FRAME_FOR_BEAN(edge.startBean)) / (FRAME_FOR_BEAN(edge.endBean) - FRAME_FOR_BEAN(edge.startBean));
        laser.object3d.scale.x = lerp(0.001, length, localT);

        let distToCam = laser.object3d.position.distanceTo(this.camera.position);
        let laserThickness =  Math.max(1.0, distToCam/15.0);
        laser.object3d.scale.y = laserThickness;
        laser.object3d.scale.z = laserThickness;

        laser.sprite.visible = localT > 0.05 && localT < 0.9999;
        laser.object3d.visible = localT > 0.0001;

        if(localT > 0.001) {
          for(let i = 0; i < 2; i++) {
            const spawnLocation = new THREE.Vector3(0, 1, 0);
            const random = Math.random();
            spawnLocation.x = lerp(coords.x / 10, next.x / 10, localT * random);
            spawnLocation.z = lerp(coords.z / 10, next.z / 10, localT * random);
            const angle = Math.PI * 2 * Math.random();
            const amplitude = Math.random() * 0.02;
            this.ps.spawn(spawnLocation, {
              x: Math.sin(angle) * amplitude,
              y: Math.cos(angle) * amplitude,
              z: (Math.random() - 0.5) * amplitude,
            }, 0.002);
          }
        }
      }

      if (!this.camera.isOverriddenByFlyControls) {

        let t = (frame - 5759) / (5822 - 5759);
        const quaternion = this.camera.quaternion;
        const position = new THREE.Vector3(0, 0, 0);
        position.set(
          13.72,
          0.98,
          70.64
        );
        quaternion.set(
          -0.06615928156879762,
          0.08265160047578583,
          -0.011051121978294878,
          0.9943186285613442);

        t = (frame - 5822) / (5947 - 5822);
        position.set(
          easeIn(position.x,
            8.591754047806516,
            t * t),
          easeIn(position.y,
            1.9522453302794827,
            t * t * t) + smoothstep(0, -0.7, t) + easeIn(0, 0.7, t * t),
          easeIn(position.z,
            54.948434201311095,
            t)
        );
        quaternion.set(
          easeIn(quaternion.x, -0.13938890236880308, t * t),
          easeIn(quaternion.y, -0.48807642028165527, t * t),
          easeIn(quaternion.z, -0.12374866545972402, t * t),
          easeIn(quaternion.w, 0.852665473476206, t * t)
        );

        t = clamp(0, (frame - 5947) / (6072 - 5947), 1);
        position.set(
          easeIn(position.x,
            21.72810605982261,
            t),
          easeIn(position.y,
            2.610694762592062,
            t),
          easeIn(position.z,
            56.31111129243994,
            t)
        );
        quaternion.set(
            lerp(quaternion.x, -0.2299600654102617, t),
            lerp(quaternion.y, -0.3576233423821262, t),
            lerp(quaternion.z, -0.09421327323726097, t),
            lerp(quaternion.w, 0.9001931861805363, t));

        t = clamp(0, (frame - 6072) / (6260 - 6072), 1);
        position.set(

          easeIn(position.x,
            29.48526056137387,
            t * t),
          lerp(position.y,
            60.629444705590565,
            t * t * t),
          easeIn(position.z,
            40.94734287697881,
            t)
        );
        this.camera.quaternion.set(

          lerp(quaternion.x,
           -0.7751457473569122,
            t * t),
          easeIn(quaternion.y,
            0.04173864444709695,
            t * t),
          easeIn(quaternion.z,
            -0.02408080621712149,
            t * t),
          easeIn(quaternion.w,
            0.6299421169330928,
            t * t)
        );

        if(frame >= 6322) {
          t = clamp(0, (frame - 6322) / (6572 - 6322), 1);
          position.set(
            lerp(
              25.450525545916232,
              84.29672878275879,
              t),
            lerp(
              2,
              9,
              t),
            lerp(
              66.29971622560141,
              61.931533464535605,
              t)
          );
          quaternion.set(
            -0.07784756581525434,
            -0.6023211701415451,
            -0.047595680369875086,
            0.7939694219054555);
          quaternion.set(
            easeIn(quaternion.x, -0.19, t),
            easeIn(quaternion.y, -0.5525695174641078, t),
            easeIn(quaternion.z, -0.07535741284411338, t),
            easeIn(quaternion.w, 0.7401997383707709, t)
          );
        }

        if (frame >= 6573) {
          t = easeOut(0, 1, (frame - 6573) / (6760 - 6573));
          position.set(
            80.23663475501766,
            lerp(80, 124.45170796782712, t),
            57.94665184861699
          );

          quaternion.set(
            -0.6942563169058162,
            lerp(-0.15712347526530384, -0.02712347526530384, t),
            0.02833570303862777,
            0.7186581742798239
          );
        }

        this.camera.updateProjectionMatrix();
        this.cameraPreviousPosition.copy(this.camera.position);
        this.camera.position.copy(position);
        this.camera.position.add(this.cameraShakePosition);
        this.camera.rotation.x += this.cameraShakeRotation.x;
        this.camera.rotation.y += this.cameraShakeRotation.y;
        this.camera.rotation.z += this.cameraShakeRotation.z;
        this.cameraLight.position.copy(this.camera.position);
      }
    }

    render(renderer) {
      renderer.setClearColor(new THREE.Color(0x120b13));
      for(let i = 0; i < this.pyramidMeshes.length; i++) {
        this.pyramidMeshes[i].material.depthTest = true;
      }
      this.groundMirror.render();
      for(let i = 0; i < this.pyramidMeshes.length; i++) {
        this.pyramidMeshes[i].material.depthTest = false;
      }

      this.ps.render();
      super.render(renderer);
    }
  }

  global.pyramids = pyramids;
})(this);
