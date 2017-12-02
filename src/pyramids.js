(function(global) {
  class pyramids extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        },
        inputs: {
          butterflyContent: new NIN.Input(),
          griddymid: new NIN.Input(),
        }
      });

      this.cachedButterflyContent = undefined;

      const ambientLight = new THREE.AmbientLight(0xffffff);
      ambientLight.intensity = 0.1;
      this.scene.add(ambientLight);

      this.coords = [
        /* R */
        {x: 121, y: 669},
        {x: 121, y: 539},
        {x: 121, y: 410},
        {x: 255, y: 410},
        {x: 303, y: 460},
        {x: 303, y: 512},
        {x: 254, y: 540},
        {x: 303, y: 659},

        /* E */
        {x: 386, y: 659},
        {x: 572, y: 659},
        {x: 386, y: 539},
        {x: 496, y: 539},
        {x: 386, y: 410},
        {x: 582, y: 410},

        /* V */
        {x: 622, y: 410},
        {x: 712, y: 659},
        {x: 808, y: 410},

        /* I */
        {x: 874, y: 410},
        {x: 874, y: 659},

        /* S */
        {x: 959, y: 610},
        {x: 1003, y: 659},
        {x: 1092, y: 659},
        {x: 1133, y: 610},
        {x: 1133, y: 558},
        {x: 1091, y: 539},
        {x: 1003, y: 539},
        {x: 1003, y: 539},
        {x: 959, y: 512},
        {x: 959, y: 460},
        {x: 1003, y: 410},
        {x: 1091, y: 410},
        {x: 1133, y: 460},

        /* I */
        {x: 1216, y: 410},
        {x: 1216, y: 659},

        /* O */
        {x: 1298, y: 460},
        {x: 1343, y: 410},
        {x: 1435, y: 410},
        {x: 1481, y: 460},
        {x: 1481, y: 610},
        {x: 1425, y: 659},
        {x: 1343, y: 659},
        {x: 1298, y: 610},

        /* N */
        {x: 1565, y: 659},
        {x: 1565, y: 410},
        {x: 1748, y: 659},
        {x: 1748, y: 410},
      ];

      this.camera.near = 0.01;
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
      const planeGeo = new THREE.PlaneBufferGeometry(100, 100);
      const mirrorMesh = new THREE.Mesh(planeGeo, this.groundMirror.material);
      mirrorMesh.add(this.groundMirror);
      mirrorMesh.rotateX(-Math.PI / 2);
      //mirrorMesh.material.transparent = true;
      //this.scene.add(mirrorMesh);

      this.mirrorOverlayMesh = new THREE.Mesh(
        planeGeo,
        new THREE.ShaderMaterial(SHADERS[options.shader])
      );
      this.mirrorOverlayMesh.rotateX(-Math.PI / 2);
      this.mirrorOverlayMesh.position.y = 0.01;
      this.mirrorOverlayMesh.material.uniforms.foregroundColor.value = new THREE.Vector4(
        0,
        0.208,
        0.228,
        0.8
      );
      this.mirrorOverlayMesh.material.uniforms.backgroundColor.value = new THREE.Vector4(
        0,
        0.2,
        0.22,
        0.8
      );
      this.mirrorOverlayMesh.material.transparent = true;
      //this.scene.add(this.mirrorOverlayMesh);

      this.pyramids = [
        {
          x: 1.5,
          z: 1,
          radius: 1,
          height: 1,
          color: new THREE.Color('rgb(0, 224, 79)'),
          bean: 0
        },
        {
          x: -1.5,
          z: 3,
          radius: 1,
          height: 1,
          color: new THREE.Color('rgb(255, 73, 130)'),
          bean: 9,
        },
        {
          x: 1.5,
          z: 5,
          radius: 1,
          height: 1,
          color: new THREE.Color('purple'),
          bean: 24,
        },
        {
          x: -1.5,
          z: 7,
          radius: 1,
          height: 1,
          color: new THREE.Color('rgb(0, 224, 79)'),
          bean: 33,
        },
        {
          x: 1.5,
          z: 9,
          radius: 1,
          height: 1,
          color: new THREE.Color('rgb(255, 73, 130)'),
          bean: 48,
        },
        {
          x: -1.5,
          z: 11,
          radius: 1,
          height: 1,
          color: new THREE.Color('purple'),
          bean: 57,
        },
        {
          x: 4.5,
          z: 5,
          radius: 1,
          height: 1,
          color: new THREE.Color('rgb(255, 73, 130)'),
          bean: 70,
        },
        {
          x: -4.5,
          z: 7,
          radius: 1,
          height: 1,
          color: new THREE.Color('purple'),
          bean: 79,
        },
        {
          x: 4.5,
          z: 9,
          radius: 1,
          height: 1,
          color: new THREE.Color('rgb(0, 224, 79)'),
          bean: 94,
        },
        {
          x: -4.5,
          z: 11,
          radius: 1,
          height: 1,
          color: new THREE.Color('rgb(255, 73, 130)'),
          bean: 103,
        },
      ];

      this.pyramidMeshes = [];
      const roughnessMap = Loader.loadTexture('res/bg.jpg');
      for (let i = 0; i < this.coords.length; i++) {
        const pyramid = this.pyramids[i];
        const coords = this.coords[i];
        const pyramidMesh = new THREE.Mesh(
          new THREE.ConeGeometry(1, 1, 4),
          new THREE.MeshStandardMaterial({
            color: 0,
            emissive: 0xffffff,
            roughnessMap: roughnessMap,
            metalness: 0,
            transparent: true,
            side: THREE.DoubleSide,
          })
        );
        pyramidMesh.position.set(
            coords.x / 10,
            0.5,
            coords.y / 10);
        this.scene.add(pyramidMesh);
        this.pyramidMeshes.push(pyramidMesh);
      }

      const directionalLight = new THREE.DirectionalLight();
      directionalLight.position.set(1, 1, 1);
      this.scene.add(directionalLight);

      this.lasers = [];
      for (let i = 0; i < this.coords.length; i++) {
        const coords = this.coords[i];
        const laserBeam = new global.Laser();
        this.scene.add(laserBeam.object3d);
        const object3d = laserBeam.object3d;
        object3d.position.x = coords.x / 10;
        object3d.position.y = 11;
        object3d.position.z = coords.z / 10;
        object3d.rotation.z = -Math.PI / 2;
        this.lasers.push(laserBeam);
      }

      this.rings = [];
      for (const pyramid of this.pyramids) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(pyramid.radius, .1, 4, 4),
            new THREE.MeshBasicMaterial({color: 0xffffff})
        );
        ring.position.set(pyramid.x, 0, pyramid.z);
        ring.rotation.x = -Math.PI/2;
        this.rings.push(ring);
        this.scene.add(ring);
      }
    }

    update(frame) {
      super.update(frame);

      demo.nm.nodes.bloom.opacity = 3;

      const newButterflyContent = this.inputs.butterflyContent.getValue();
      if(this.cachedButterflyContent != newButterflyContent) {
        this.scene.remove(this.cachedButterflyContent);
        this.scene.add(newButterflyContent);
        this.cachedButterflyContent = newButterflyContent;
      }

      const startBEAN = 46 * 12 * 4;
      const t = (frame - FRAME_FOR_BEAN(startBEAN)) / (FRAME_FOR_BEAN(54 * 12 * 4) - FRAME_FOR_BEAN(startBEAN));

      for (const [index, coord] of this.coords.entries()) {
        const pyramid = this.pyramids[index];
        this.pyramidMeshes[index].material.map = this.inputs.griddymid.getValue();
        this.pyramidMeshes[index].material.emissiveMap = this.inputs.griddymid.getValue();
        this.pyramidMeshes[index].material.needsUpdate = true;
      }

      if (!this.camera.isOverriddenByFlyControls) {
        this.camera.position.set(
          easeIn(10.82, 0, t),
          easeIn(0.58, 0.5, t),
          easeIn(69.06, 4, t)
        );
        const lookAt = new THREE.Vector3(
          easeIn(11.61, -1.5, t),
          easeIn(0.35, 1, t),
          easeIn(67.06, 8, t)
        );
        if(frame >= 6510) {
          this.camera.position.set(-0.5, 0.5, 8.45);
          lookAt.x = -0.5;
          lookAt.y = 0.5;
          lookAt.z = 6;
        }
        this.camera.lookAt(lookAt);
        this.cameraLight.position.copy(this.camera.position);
      }
    }

    render(renderer) {
      renderer.setClearColor(0, 1);
      this.groundMirror.render();
      super.render(renderer);
    }
  }

  global.pyramids = pyramids;
})(this);
