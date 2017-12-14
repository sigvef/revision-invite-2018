(function(global) {
  class cubes extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput(),
          debug: new NIN.TextureOutput()
        }
      });
      this.blinkThrob = 0;
      this.backThrob = 0;

      this.wallCanvas = document.createElement('canvas');
      this.wallCanvas.width = 48 / 3 * 2;
      this.wallCanvas.height = 27 / 3 * 2;
      this.wallCtx = this.wallCanvas.getContext('2d');
      this.wallTexture = new THREE.CanvasTexture(this.wallCanvas);
      this.wallTexture.minFilter = THREE.NearestFilter;
      this.wallTexture.magFilter = THREE.NearestFilter;

      this.blindLight = new THREE.DirectionalLight();
      this.blindLight.intensity = 1000;
      this.blindLight.position.set(0, 0, -1);
      this.scene.add(this.blindLight);

      this.ambientLight = new THREE.AmbientLight();
      this.ambientLight.intensity = 0.2;
      this.scene.add(this.ambientLight);

      this.directionalLight = new THREE.DirectionalLight();
      this.directionalLight.position.set(-1, 1, 1);
      this.directionalLight.intensity = 1.5;
      this.scene.add(this.directionalLight);

      this.bg = new THREE.Mesh(
          new THREE.BoxGeometry(16, 9, 1),
          new THREE.ShaderMaterial(SHADERS.discowall));
      this.scene.add(this.bg);
      this.bg.position.z = -100;
      const scale = 18;
      this.bg.scale.set(scale, scale, scale);

      this.cameraPreviousPosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakePosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakeVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAcceleration = new THREE.Vector3(0, 0, 0);
      this.cameraShakeRotation = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularAcceleration = new THREE.Vector3(0, 0, 0);

      this.cubes = [];
      this.cubeWidth = 16 / 4 * 4;
      this.cubeHeight = 9 / 2 * 4;
      const cubeGeometry = new THREE.BoxGeometry(this.cubeWidth,
          this.cubeHeight,
          2);
      for(let i = 0; i < 8; i++) {
        const mapClone = Loader.loadTexture('res/testo.png');
        const cube = new THREE.Mesh(
          cubeGeometry,
          new THREE.MeshStandardMaterial({
            map: mapClone,
            emissiveMap: mapClone,
            roughness: 1,
            metalness: 0,
          }));
        mapClone.repeat.set(1 / 4, 1 / 2);
        mapClone.offset.set(
            (i % 4) / 4,
            0.5 - (i / 4 | 0) / 2);
        this.cubes[i] = cube;
        this.scene.add(cube);
      }

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 100;
      this.camera.fov = 18;
      this.camera.updateProjectionMatrix();

      this.textCanvas = document.createElement('canvas');
      this.textCanvas.width = 16 * GU;
      this.textCanvas.height = 9 * GU;
      this.textCtx = this.textCanvas.getContext('2d');
      this.textTexture = new THREE.CanvasTexture(this.textCanvas);
      this.textTexture.minFilter = THREE.NearestFilter;
      this.textTexture.magFilter = THREE.NearestFilter;
    }

    update(frame) {
      const baseBean = 768;
      this.wallCtx.save();
      this.wallCtx.globalAlpha = 0.1;
      this.wallCtx.fillStyle = 'rgb(25, 30, 33)';
      this.wallCtx.fillRect(0, 0, this.wallCanvas.width, this.wallCanvas.height);

      this.wallCtx.globalAlpha = 1;
      this.backThrob *= 0.9;
      const start = 840 - 6;
      if(BEAT && BEAN >= start) {
        this.backThrob = 1;
        const size = 2;
        const offset = BEAN - start;
        for(let j = 0; j < 9; j++) {
          const y = j;
          const lower = y > this.wallCanvas.height / size / 2; 
          let x = offset;
          if(lower) {
            x = 16 - offset;
          }
          const color = lower ? 'rgb(255, 73, 130)' : '#77e15d';
          this.wallCtx.fillStyle = color;
          this.wallCtx.fillRect(x * size, y * size, size, size);
        }
      }
      this.wallCtx.restore();
      this.wallTexture.needsUpdate = true;
      this.bg.material.uniforms.walltexture.value = this.wallTexture;
      this.outputs.debug.value = this.wallTexture;

      this.textCtx.clearRect(0, 0, 16 * GU, 9 * GU);
      this.textCtx.fillStyle = 'white';
      const fontT = (frame - FRAME_FOR_BEAN(((BEAN / 12) | 0) * 12)) / (FRAME_FOR_BEAN(((BEAN / 12) | 0) * 12 + 12) - FRAME_FOR_BEAN(((BEAN / 12) | 0) * 12));
      this.textCtx.font = `${GU * lerp(1.9, 1.6, fontT)}px schmalibre`;
      this.textCtx.textAlign = 'center';
      this.textCtx.textBaseline = 'middle';
      if (BEAN >= baseBean + 24) {
        if (BEAN < baseBean + 24 + 12) {
          this.textCtx.fillText('No concerts', 8 * GU, 4.665 * GU);
        } else if (BEAN < baseBean + 48) {
          this.textCtx.fillText('No seminars', 8 * GU, 4.665 * GU);
        } else if (BEAN < baseBean + 48 + 12) {
          this.textCtx.fillText('No bonfire', 8 * GU, 4.665 * GU);
        } else if (BEAN < baseBean + 48 + 24) {
          this.textCtx.fillText('No live-stream', 8 * GU, 4.665 * GU);
        }
      }
      this.textTexture.needsUpdate = true;
      this.bg.material.uniforms.texttexture.value = this.textTexture;

      this.blindLight.intensity = 10 * this.backThrob;

      this.blinkThrob *= 0.8;
      if(BEAT) {
        switch(BEAN) {
        case baseBean:
        case baseBean + 9:
        case baseBean + 9 + 9:
        case baseBean + 24:
          this.cameraShakeAngularVelocity.x = (Math.random() - 0.5) * 0.05;
          this.cameraShakeAngularVelocity.y = (Math.random() - 0.5) * 0.05;
          this.cameraShakeAngularVelocity.z = (Math.random() - 0.5) * 0.05;
        case baseBean + 24 + 12:
        case baseBean + 24 + 12 +  6:
        case baseBean + 48:
        case baseBean + 48 + 6:
        case baseBean + 48 + 12:
        case baseBean + 48 + 12 + 3:
        case baseBean + 48 + 24 - 3:
          this.cameraShakeVelocity.x = (this.camera.position.x -
            this.cameraPreviousPosition.x) * 0.1;
          this.cameraShakeVelocity.y = (this.camera.position.y -
            this.cameraPreviousPosition.y) * 0.1;
          this.cameraShakeVelocity.z = (this.camera.position.z -
            this.cameraPreviousPosition.z) * 0.1;
          this.blinkThrob = 1;
        }
      }

      const cameraPosition = new THREE.Vector3(0, 0, 0);
      const cameraQuaternion = new THREE.Quaternion(0, 0, 0, 0);

      cameraPosition.z = 100;
      cameraPosition.x = 0;
      cameraPosition.y = 0;
      const scaleUpT = (frame - 2002) / (2180 - 2002);
      for(let i = 0; i < this.cubes.length; i++) {
        const cube = this.cubes[i];
        cube.position.x = (((i % 4) + 0.5) / this.cubes.length - 0.25) * 4 * this.cubeWidth * 2;
        cube.position.y = (0.5 - (i / 4 | 0)) * this.cubeHeight;
        cube.rotation.x = 0;
        cube.rotation.z = 0;
        //cube.rotation.y = Math.PI / 2 + (frame - 2002) * Math.PI * 2 / 60 / 60 *115 / 2;
        cube.position.z = 0;
        cube.position.y *= smoothstep(1, 1.3, scaleUpT);
        cube.position.x *= smoothstep(1, 1.6, scaleUpT);
        cube.scale.z = smoothstep(1, 8, scaleUpT);
        cube.scale.x = 1;
        cube.scale.y = 1;
        this.camera.fov = smoothstep(20.6, 45, scaleUpT);
        this.camera.updateProjectionMatrix();
      }

      this.frames = [
        2026,
        2049,
        2065,
        2076,
        2002,
        2008,
        2014,
        2020,
      ];
      for (const [index, cube] of this.cubes.entries()) {
        const localT = lerp(easeOut(0, 70, (frame - this.frames[index]) / 80), 200, frame - 2160);
        cube.position.y -= localT;
        cube.rotation.z = localT / 60;
      }

      /*
      const t = (frame - 2096 + 10) / 10;
      cameraPosition.x = easeIn(0, -30, t);
      cameraPosition.y = easeIn(0, 10, t);
      cameraPosition.z = easeIn(100, 25, t);
      if(frame >= 2096) {
        cameraPosition.x = -30;
        cameraPosition.y = 10;
        cameraPosition.z = 25;

        const t = (frame - 2109 + 10) / 10;
        cameraPosition.x = easeIn(-30, -10.5, t);
        cameraPosition.y = easeIn(10, 10.5, t);
        cameraPosition.z = easeIn(25, 25, t);
      }
      if(frame >= 2109) {
        cameraPosition.x = -10.5;
        cameraPosition.y = 10.5;
        cameraPosition.z = 25;

        const t = (frame - 2128 + 10) / 10;
        cameraPosition.x = easeIn(-10.5, 10.5, t);
        cameraPosition.y = easeIn(10.5, 10.5, t);
        cameraPosition.z = easeIn(25, 10, t);
      }
      if(frame >= 2128) {
        cameraPosition.x = 10.5;
        cameraPosition.y = 10.5;
        cameraPosition.z = 10;

        const t = (frame - 2143 + 10) / 10;
        cameraPosition.x = easeIn(10.5, 34, t);
        cameraPosition.y = easeIn(10.5, 13, t);
        cameraPosition.z = easeIn(10, 25, t);
      }
      if(frame >= 2143) {
        cameraPosition.x = 34;
        cameraPosition.y = 13;
        cameraPosition.z = 25;
      }
      if(frame >= 2159) {
        cameraPosition.x = -35;
        cameraPosition.y = -11;
        cameraPosition.z = 25;

        const t = (frame - 2169 + 7) / 7;
        cameraPosition.x = easeIn(-35, -12, t);
        cameraPosition.y = easeIn(-11, -11, t);
        cameraPosition.z = easeIn(25, 20, t);
      }
      if(frame >= 2169) {
        cameraPosition.x = -12;
        cameraPosition.y = -11;
        cameraPosition.z = 20;

        const t = (frame - 2186 + 10) / 10;
        cameraPosition.x = easeIn(-12, 0, t);
        cameraPosition.y = easeIn(-11, 0, t);
        cameraPosition.z = easeIn(20, 100, t);

        for(let i = 0; i < this.cubes.length; i++) {
          this.cubes[i].scale.x = easeIn(this.cubes[i].scale.x, 1, t);
          this.cubes[i].scale.y = easeIn(this.cubes[i].scale.y, 1, t);
        }
      }
      if(frame >= 2186) {
        cameraPosition.x = 0;
        cameraPosition.y = 0;
        cameraPosition.z = 100;
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
      this.camera.quaternion.copy(cameraQuaternion);
      this.camera.rotation.x += this.cameraShakeRotation.x;
      this.camera.rotation.y += this.cameraShakeRotation.y;
      this.camera.rotation.z += this.cameraShakeRotation.z;
      */
      this.camera.position.copy(cameraPosition);

      demo.nm.nodes.bloom.opacity = this.blinkThrob;
    }

    render(renderer) {
      renderer.setClearColor(new THREE.Color(
          55 / 255,
          60 / 255,
          63 / 255));
      super.render(renderer); 
    }
  }

  global.cubes = cubes;
})(this);
