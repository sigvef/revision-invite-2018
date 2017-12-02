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
        [1, 0],
        [2, 1],
        [3, 2],
        [4, 3],
        [5, 4],
        [6, 5],
        [7, 6],

        /* E */
        [9, 8],
        [10, 8],
        [11, 10],
        [12, 10],
        [13, 12],

        /* V */
        [15, 14],
        [15, 16],

        /* I */
        [18, 17],

        /* S */
        [20, 19],
        [21, 20],
        [22, 21],
        [23, 22],
        [24, 23],
        [25, 24],
        [26, 25],
        [27, 26],
        [28, 27],
        [29, 28],
        [30, 29],
        [31, 30],

        /* I */
        [32, 33],

        /* O */
        [35, 34],
        [36, 35],
        [37, 36],
        [38, 37],
        [39, 38],
        [40, 39],
        [41, 40],
        [34, 41],

        /* N */
        [43, 42],
        [44, 43],
        [45, 44],
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

      this.pyramidMeshes = [];
      const roughnessMap = Loader.loadTexture('res/bg.jpg');
      for (let i = 0; i < this.coords.length; i++) {
        const coords = this.coords[i];
        const pyramidMesh = new THREE.Mesh(
          new THREE.ConeGeometry(1, 1, 4),
          new THREE.MeshStandardMaterial({
            color: 0,
            emissive: 0xffffff,
            roughnessMap: roughnessMap,
            metalness: 0,
            depthTest: false,
            transparent: true,
            side: THREE.DoubleSide,
          })
        );
        pyramidMesh.position.set(
            coords.x / 10,
            0.5,
            coords.z / 10);
        this.scene.add(pyramidMesh);
        this.pyramidMeshes.push(pyramidMesh);
      }

      const directionalLight = new THREE.DirectionalLight();
      directionalLight.position.set(1, 1, 1);
      this.scene.add(directionalLight);

      this.lasers = [];
      for (const [from, to] of this.edges) {
        const coords = this.coords[from];
        const next = this.coords[to];
        const laserBeam = new global.Laser();
        this.scene.add(laserBeam.object3d);
        const object3d = laserBeam.object3d;
        object3d.position.x = coords.x / 10;
        object3d.position.y = 1;
        object3d.position.z = coords.z / 10;
        object3d.scale.x = Math.sqrt(Math.pow(next.z - coords.z, 2) + Math.pow(next.x - coords.x, 2)) / 10;
        const angle = -Math.atan2(next.z - coords.z, next.x - coords.x);
        object3d.rotation.y = angle;
        this.lasers.push(laserBeam);
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

      for (const index of this.coords.keys()) {
        this.pyramidMeshes[index].material.map = this.inputs.griddymid.getValue();
        this.pyramidMeshes[index].material.emissiveMap = this.inputs.griddymid.getValue();
        this.pyramidMeshes[index].material.needsUpdate = true;
      }

      for (const [index, laser] of this.lasers.entries()) {
        const [from, to] = this.edges[index];
        const coords = this.coords[from];
        const next = this.coords[to];
        const length = Math.sqrt(Math.pow(next.z - coords.z, 2) + Math.pow(next.x - coords.x, 2)) / 10;
        const startBEAN = 46 * 12 * 4 + index * 4;
        const localT = (frame - FRAME_FOR_BEAN(startBEAN)) / (FRAME_FOR_BEAN(startBEAN + 12) - FRAME_FOR_BEAN(startBEAN));
        laser.object3d.scale.x = lerp(0, length, localT);
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
