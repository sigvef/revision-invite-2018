(function(global) {
  class pyramids extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.camera.near = 0.1;

      this.cameraLight = new THREE.PointLight(0xffffff, 1, 100);
      this.scene.add(this.cameraLight);

      this.groundMirror = new THREE.Mirror(demo.renderer, this.camera, {
        clipBias: 0.003,
        textureWidth: 16 * GU,
        textureHeight: 16 * GU,
        color: 'rgb(55, 60, 63)',
      });
      const planeGeo = new THREE.PlaneBufferGeometry(50, 50);
      const mirrorMesh = new THREE.Mesh(planeGeo, this.groundMirror.material);
      mirrorMesh.add(this.groundMirror);
      mirrorMesh.rotateX(-Math.PI / 2);
      this.scene.add(mirrorMesh);

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
          bean: 8,
        },
        {
          x: 1.5,
          z: 5,
          radius: 1,
          height: 1,
          color: new THREE.Color('#00e04f'),
          bean: 24,
        }
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
    }

    update(frame) {
      super.update(frame);

      const startBEAN = 46 * 12 * 4;
      const t = (frame - FRAME_FOR_BEAN(startBEAN)) / (FRAME_FOR_BEAN(54 * 12 * 4) - FRAME_FOR_BEAN(startBEAN));

      for (const [index, pyramid] of this.pyramids.entries()) {
        if (BEAN >= startBEAN + pyramid.bean) {
          const localT = (frame - FRAME_FOR_BEAN(startBEAN + pyramid.bean)) / 120;
          const scale = elasticOut(0.0001, 1, 1.0, localT);
          this.pyramidMeshes[index].scale.set(scale, scale, scale);
          this.pyramidMeshes[index].position.y = elasticOut(0, .5, 1.0, localT);
        } else {
          this.pyramidMeshes[index].scale.set(0, 0, 0);
        }
      }

      this.camera.position.set(
        0,
        lerp(2, 1, t),
        lerp(-2, 2, t)
      );
      this.camera.lookAt(new THREE.Vector3(0, 0, lerp(2, 6, t)));
      this.cameraLight.position.copy(this.camera.position);
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
