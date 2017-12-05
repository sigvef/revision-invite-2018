(function(global) {
  class ewerk extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput(),
        },
        inputs: {
          globeTextures: new NIN.Input(),
          beamer: new NIN.TextureInput(),
          beamer2: new NIN.TextureInput(),
        }
      });

      const objLoader = new THREE.OBJLoader();
      this.ewerkModel = new THREE.Object3D();
      this.ewerkModel.rotation.y = Math.PI;
      Loader.loadAjax('res/ewerk.obj', text => {
        const obj = objLoader.parse(text);
        obj.traverse(mesh => {
          mesh.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 1,
            metalness: 0,
            side: THREE.DoubleSide,
          });
          mesh.castShadow = true;
        });
        this.ewerkModel.add(obj);
      });
      this.scene.add(this.ewerkModel);

      Loader.loadAjax('res/REVISIONSTAGE.obj', text => {
        const obj = objLoader.parse(text);
        obj.scale.set(0.06, 0.06, 0.06);
        obj.rotation.y = -Math.PI / 2;
        obj.position.x = 3;
        obj.position.y = 0.05;
        obj.position.z = -0.3;
        obj.traverse(mesh => {
          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(55 / 255, 60 / 255, 63 / 255),
            roughness: 1,
            metalness: 0,
            side: THREE.DoubleSide,
          });
        });
        this.ewerkModel.add(obj);
      });

      this.beamer = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 9, 16),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
        }));
      this.scene.add(this.beamer);
      this.beamer.scale.set(0.115, 0.115, 0.115);
      this.beamer.position.x = -3.0;
      this.beamer.position.y = 0.75;
      this.beamer.position.z = 0.32;

      this.ps = new ParticleSystem({
        color: new THREE.Color(1, 1, 1),
      });
      const lowerRadius = 205;
      const upperRadius = 400;
      for(let i = 0; i < 10000; i++) {
        const radius = lowerRadius + Math.random() * (upperRadius - lowerRadius);
        const angle = Math.random() * Math.PI * 2;
        const angle2 = Math.random() * Math.PI * 2;
        this.ps.spawn({
          x: Math.cos(angle) * Math.sin(angle2) * radius,
          y: Math.sin(angle) * Math.sin(angle2) * radius,
          z: Math.cos(angle2) * radius,
        }, {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01,
        }, (2 + Math.random() * 2) * 0.005);
      }
      this.ps.update();

      this.cube = new THREE.Mesh(
        new THREE.BoxGeometry(10, 5, 20),
        new THREE.MeshStandardMaterial({color: 0xff0000})
      );
      this.cube.rotation.y = Math.PI / 2;
      this.cube.position.y = 2.5;
      //this.scene.add(this.cube);

      this.globeContainer = new THREE.Object3D();
      this.globeContainer.add(this.ps.particles);

      this.globe = new THREE.Mesh(
          new THREE.SphereBufferGeometry(200, 64, 64),
          new THREE.MeshStandardMaterial({
            roughness: 1,
            metalness: 0,
          }));

      this.globeDetail = new THREE.Mesh(
          new THREE.SphereBufferGeometry(200.1, 64, 64),
          new THREE.MeshStandardMaterial({
            roughness: 1,
            metalness: 0,
          }));

      this.cloudGlobe = new THREE.Mesh(
          new THREE.SphereGeometry(201, 40, 40),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 1,
            metalness: 0,
            transparent: true,
          }));

      this.cloudGlobeDetail = new THREE.Mesh(
          new THREE.SphereGeometry(201.1, 40, 40),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 1,
            metalness: 0,
            transparent: true,
          }));

      this.globeContainer.add(this.globe);
      this.globeContainer.add(this.cloudGlobe);
      this.globeContainer.add(this.globeDetail);
      this.globeContainer.add(this.cloudGlobeDetail);

      this.globeContainer.rotation.x = -Math.PI / 2 + .8;

      this.globeLight = new THREE.DirectionalLight();
      this.globeLight.position.set(0.9, 1, 1.3);
      this.globeLight.intensity = 0.9;
      this.globeLight.color = new THREE.Color(255 / 255, 250 / 255, 244 / 255);
      this.scene.add(this.globeLight);
      this.scene.add(new THREE.AmbientLight(0xffffff, 0.075));

      this.spotLight = new THREE.SpotLight(0xffffff);
      this.spotLight.castShadow = true;
      this.spotLight.lookAt(new THREE.Vector3(0, 0, 0));
      this.scene.add(this.spotLight);
      this.spotLight.shadow.mapSize.width = 512 * 8;
      this.spotLight.shadow.mapSize.height = 512 * 8;
      this.spotLight.shadow.camera.near = 5;
      this.spotLight.shadow.camera.far = 30;
      this.spotLight.position.x = 20;
      this.spotLight.position.y = 90;
      this.spotLight.position.z = 10;

      const width = 16 * 0.1;
      const height = 9 * 0.1;
      const rectLight = new THREE.RectAreaLight( 0xffffff, undefined,  width, height );
      rectLight.intensity = 0.5;
      rectLight.position.x = -3;
      rectLight.position.y = 0.75;
      rectLight.position.z = 0.32;
      rectLight.rotation.y = Math.PI / 2;
      //this.scene.add(rectLight);

      this.scene.add(this.globeContainer);

      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(0, 10);
      shape.lineTo(1, 5);
      shape.lineTo(0, 0);
      this.roof = new THREE.Mesh(
        new THREE.ExtrudeGeometry(shape, {
          amount: 20,
          bevelSize: 1,
          bevelSegments: 1,
          bevelEnabled: false,
          steps: 1,
        }),
        new THREE.MeshStandardMaterial({color: 0xff0000})
      );
      this.roof.rotation.z = Math.PI/2;
      this.roof.rotation.y = Math.PI / 2;
      //this.scene.add(this.cube);
      this.roof.position.set(-10, 5, -5);
      //this.scene.add(this.roof);
      this.map = new THREE.Mesh(
        new THREE.PlaneGeometry(700, 700),
        new THREE.MeshStandardMaterial({
          map: Loader.loadTexture('res/map_saarbrucken.gif'),
          roughness: 1,
          metalness: 0,
        })
      );
      this.map.receiveShadow = true;
      this.map.rotation.x = -Math.PI/2;
      this.map.rotation.z = 0.11;
      this.map.position.y = -0.02;
      this.map.position.x = 15;
      this.map.position.z = 16;
      this.scene.add(this.map);

      this.camera.near = 0.1;
      this.camera.updateProjectionMatrix();
      this.camera.position.z = 50;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));

      this.skybox = new THREE.Mesh(
          new THREE.BoxGeometry(2000, 2000, 2000),
          new THREE.MeshBasicMaterial({
            color: 0,
          }));
      this.scene.add(this.skybox);
    }

    beforeUpdate(frame) {
      this.inputs.beamer.enabled = BEAN <  672;
      this.inputs.beamer2.enabled = BEAN >  3672;
    }

    update(frame) {
      super.update(frame);
      this.ps.update();
      if(frame < 366) {
        this.scene.add(this.globeLight);
      } else {
        this.scene.remove(this.globeLight);
      }
      if(BEAN > 1000) {
        this.beamer.material.map = this.inputs.beamer2.getValue();
      } else {
        this.beamer.material.map = this.inputs.beamer.getValue();
      }
      this.beamer.material.needsUpdate = true;
      demo.nm.nodes.bloom.opacity = 0;
      this.globeContainer.rotation.y = 5 -frame / 1000;
      this.globeDetail.visible = frame >= 248;
      this.cloudGlobeDetail.visible = frame >= 248;
      this.cloudGlobe.visible = frame < 248;
      const globeTextures = this.inputs.globeTextures.getValue();
      if(globeTextures) {
        this.globe.material.map = globeTextures.map;
        this.cloudGlobe.material.alphaMap = globeTextures.cloudMap;
        this.cloudGlobe.material.roughnessMap = globeTextures.cloudMap;
        this.globeDetail.material.map = globeTextures.mapDetail;
        this.cloudGlobeDetail.material.alphaMap = globeTextures.cloudMapDetail;
        this.cloudGlobeDetail.material.roughnessMap = globeTextures.cloudMapDetail;
        this.skybox.material = globeTextures.skyboxMaterial;
      }
      const frame1 = FRAME_FOR_BEAN(1 * 12 * 4);
      const frame2 = FRAME_FOR_BEAN(2 * 12 * 4);
      const frame3 = FRAME_FOR_BEAN(3 * 12 * 4);
      const frame4 = FRAME_FOR_BEAN(3 * 12 * 4 + 24);
      const frame5 = FRAME_FOR_BEAN(4 * 12 * 4);
      const frame6 = FRAME_FOR_BEAN(4 * 12 * 4 + 24);
      const frame7 = FRAME_FOR_BEAN(4 * 12 * 4 + 24 + 24);
      const frame8 = FRAME_FOR_BEAN(88 * 12 * 4 + 24);
      const frame9 = FRAME_FOR_BEAN(89 * 12 * 4);
      const frame10 = FRAME_FOR_BEAN(89 * 12 * 4 + 24);
      const frame11 = FRAME_FOR_BEAN(90 * 12 * 4);
      const frame12 = FRAME_FOR_BEAN(90 * 12 * 4 + 9);
      const frame13 = FRAME_FOR_BEAN(90 * 12 * 4 + 9 + 9);

      this.cloudGlobe.rotation.y -= 0.0002;
      this.cloudGlobeDetail.rotation.y -= 0.0002;
      this.ps.particles.rotation.y += 0.0005;

      if(frame > frame2 && frame < frame13) {
        this.map.visible = true;
      } else {
        this.map.visible = false;
      }

      if (frame <= frame1) {
        const t = clamp(0, (frame - frame1 + 10) / 10, 1);
        if(this.skybox.material.materials) {
          for(let i = 0; i < this.skybox.material.materials.length; i++) {
            const material = this.skybox.material.materials[i];
            material.color = new THREE.Color(t, t, t);
          }
        }

        this.camera.position.set(
          lerp(0, 0, t),
          lerp(1200, 900, t),
          lerp(300, 200, t)
        );

        this.globeContainer.visible = t > 0.00001;

        const scale = easeOut(0.00001, 1, t);
        this.globeContainer.scale.set(scale, scale, scale);

        this.roof.visible = false;
        this.cube.visible = false;
        this.globeContainer.rotation.x = -Math.PI / 2 + .8;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      } else if (frame <= frame2) {
        this.camera.position.set(
          lerp(0, 0, (frame - frame2 + 10) / 10),
          lerp(900, 400, (frame - frame2 + 10) / 10),
          lerp(200, 100, (frame - frame2 + 10) / 10)
        );

        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.globeContainer.rotation.x = -Math.PI / 2 + .8;
        this.globeContainer.rotation.x += lerp(0, .3, (frame - frame2 + 10) / 10);
        const scale = lerp(1, 1.7, (frame - frame2 + 10) / 10);
        this.globeContainer.scale.set(scale, scale, scale);

        this.roof.visible = false;
        this.cube.visible = false;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      } else if (frame <= frame3) {
        this.camera.position.set(
          lerp(0, 5, (frame - frame3 + 10) / 10),
          lerp(400, 150, (frame - frame3 + 10) / 10),
          lerp(100, 20, (frame - frame3 + 10) / 10)
        );
        const scale = easeIn(1.7, 2.2, (frame - frame3 + 40) / 40);
        this.globeContainer.scale.set(scale, scale, scale);
        this.roof.visible = false;
        this.cube.visible = false;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      } else if (frame <= frame4) {
        this.camera.position.set(
          lerp(5, 30, (frame - frame4 + 10) / 10),
          lerp(150, 15, (frame - frame4 + 10) / 10),
          lerp(20, 10, (frame - frame4 + 10) / 10)
        );
        this.roof.visible = true;
        this.cube.visible = true;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      } else if( frame <= frame5) {
        this.camera.position.set(
          lerp(30, 15, (frame - frame5 + 10) / 10),
          lerp(15, 4, (frame - frame5 + 10) / 10),
          lerp(10, 1, (frame - frame5 + 10) / 10)
        );
        this.roof.visible = true;
        this.cube.visible = true;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      } else if( frame <= frame6) {
        const t = (frame - 531) / (563 - 531);
        this.camera.position.set(
          lerp(15, 0, t),
          lerp(4, 0.5, t) + easeOut(0, -3.5, t * 2) + lerp(0, 3.5, t),
          lerp(1, 1, t) + easeOut(0, 1.6, t) + easeIn(0, -1.6, t));
        this.camera.lookAt(
            new THREE.Vector3(
              lerp(-4, -1.75 - 2, t),
              lerp(-1.5, 0.75, t),
              lerp(0, 0.32, t)
              ));
      } else if (frame <= frame8 - 20) {
        const x = -1.75;
        const y = 0.75;
        const z = 0.32;
        this.camera.position.set(
          lerp(0, x, (frame - frame7 + 10) / 10),
          lerp(0.5, y, (frame - frame7 + 10) / 10),
          lerp(1, z, (frame - frame7 + 10) / 10));
        this.camera.lookAt(
            new THREE.Vector3(x - 2, y, z));
      } else if (frame <= frame9) {
        const x = -1.75;
        const y = 0.75;
        const z = 0.32;
        const t = (frame - frame8 + 10) / 10;
        this.camera.position.set(
          easeIn(x, 0, t * t * t),
          easeIn(y, 0.5, t * t * t),
          easeIn(z, 1, t * t * t));
        this.camera.lookAt(
            new THREE.Vector3(x - 2, y, z));
      } else if (frame <= frame9) {
        this.camera.position.set(
          lerp(0, 15, (frame - frame8 + 10) / 10),
          lerp(0.5, 5, (frame - frame8 + 10) / 10),
          lerp(1, 1, (frame - frame8 + 10) / 10));
        this.camera.lookAt(new THREE.Vector3(
          lerp(-3.75, 0, (frame - frame8 + 10) / 10),
          lerp(0.75, 0, (frame - frame8 + 10) / 10),
          lerp(0.32, 0, (frame - frame8 + 10) / 10)
        ));
      } else if (frame <= frame10) {
        this.camera.position.set(
          lerp(15, 30, (frame - frame10 + 10) / 10),
          lerp(5, 15, (frame - frame10 + 10) / 10),
          lerp(1, 10, (frame - frame10 + 10) / 10)
        );
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      } else if (frame <= frame11) {
        this.roof.visible = false;
        this.cube.visible = false;
        this.camera.position.set(
          lerp(30, 5, (frame - frame11 + 10) / 10),
          lerp(15, 150, (frame - frame11 + 10) / 10),
          lerp(10, 20, (frame - frame11 + 10) / 10)
        );
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      } else {
        const localT = (frame - frame13 + 10) / 10;
        this.camera.position.set(
          lerp(lerp(5, 0, localT), -5, localT / 60),
          lerp(lerp(150, 400, localT), 800, localT / 60),
          lerp(lerp(20, 10, localT), 8, localT / 60)
        );
        const scale = easeIn(2.2, 1.7, (frame - frame13 + 40) / 40);
        this.globeContainer.scale.set(scale, scale, scale);
        this.globeContainer.rotation.y = 3.4 - frame / 1000;
        this.roof.visible = false;
        this.cube.visible = false;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      }
    }

    render(renderer) {
      this.ps.render();
      renderer.shadowMap.enabled = true;
      super.render(renderer);
    }
  }

  global.ewerk = ewerk;
})(this);
