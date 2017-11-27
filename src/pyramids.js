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
        }
      });

      this.cachedButterflyContent = undefined;

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
      this.scene.add(mirrorMesh);

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
      this.scene.add(this.mirrorOverlayMesh);

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
      for (const pyramid of this.pyramids) {
        const pyramidMesh = new THREE.Mesh(
          new THREE.ConeGeometry(pyramid.radius, pyramid.height, 4),
          new THREE.MeshStandardMaterial({color: pyramid.color})
        );
        pyramidMesh.position.set(pyramid.x, pyramid.height / 2, pyramid.z);
        this.scene.add(pyramidMesh);
        this.pyramidMeshes.push(pyramidMesh);
      }

      this.lasers = [];
      for (const pyramid of this.pyramids) {
        const laserBeam = new global.Laser();
        this.scene.add(laserBeam.object3d);
        const object3d = laserBeam.object3d;
        object3d.position.x = pyramid.x;
        object3d.position.y = 11;
        object3d.position.z = pyramid.z;
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

      const newButterflyContent = this.inputs.butterflyContent.getValue();
      if(this.cachedButterflyContent != newButterflyContent) {
        this.scene.remove(this.cachedButterflyContent);
        this.scene.add(newButterflyContent);
        this.cachedButterflyContent = newButterflyContent;
      }

      const startBEAN = 46 * 12 * 4;
      const t = (frame - FRAME_FOR_BEAN(startBEAN)) / (FRAME_FOR_BEAN(54 * 12 * 4) - FRAME_FOR_BEAN(startBEAN));

      for (const [index, pyramid] of this.pyramids.entries()) {
        if (BEAN >= startBEAN + pyramid.bean) {
          const localT = (frame - FRAME_FOR_BEAN(startBEAN + pyramid.bean)) / 120;
          const scale = elasticOut(0.0001, 1, 1.0, localT);
          this.pyramidMeshes[index].scale.set(scale, scale, scale);
          this.pyramidMeshes[index].position.y = elasticOut(
            0,
            pyramid.height / 2,
            1.0,
            localT
          );

          const size = lerp(lerp(0, 1, localT * 2),
                            0,
                            localT * 2 - 1);
          this.rings[index].scale.set(size, size, size);
          this.rings[index].position.y = lerp(0, pyramid.height, localT * 2- .9);

          this.lasers[index].object3d.scale.x = lerp(0, 10, localT - 1);
          this.lasers[index].object3d.position.y = lerp(
            pyramid.height,
            pyramid.height + 10,
            localT - 1
          );
        } else {
          this.pyramidMeshes[index].scale.set(0, 0, 0);
          this.rings[index].scale.set(0, 0, 0);
          this.lasers[index].object3d.scale.x = 0;
          this.lasers[index].object3d.position.y = 0;
        }
      }

      if (!this.camera.isOverriddenByFlyControls) {
        this.camera.position.set(
          lerp(0.5, 0, t),
          lerp(2, 0.5, t),
          lerp(-2, 4, t)
        );
        const lookAt = new THREE.Vector3(
          lerp(0, -1.5, t),
          easeIn(0, 1, t),
          lerp(2, 8, t)
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
      const clearColor = new THREE.Color(55 / 255, 60 / 255, 63 / 255);
      renderer.setClearColor(clearColor, 1);
      this.groundMirror.render();
      super.render(renderer);
    }
  }

  global.pyramids = pyramids;
})(this);
