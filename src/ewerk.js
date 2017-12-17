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

      this.lowpolySkybox = new THREE.Mesh(
          new THREE.BoxGeometry(500, 500, 500),
          new THREE.MeshBasicMaterial({
            color: 0xadccff,
            side: THREE.BackSide,
          }));
      this.scene.add(this.lowpolySkybox);


      const maps = {
        'ewerk_Cylinder.002_Cylinder.003':
          Loader.loadTexture('res/ewerk_map.jpg'),
        'newground_Plane.001':
          Loader.loadTexture('res/ground_lightmap.png'),
        'tree_Cylinder':
          Loader.loadTexture('res/tree_lightmap.png'),
        'tree2_Cylinder.001':
          Loader.loadTexture('res/tree2_lightmap.png'),
        'tree3_Cylinder.002':
          Loader.loadTexture('res/tree3_lightmap.png'),
        'inside_Cube.002':
          Loader.loadTexture('res/inside_map.png'),
        'stage_Cube_Cube.000':
          Loader.loadTexture('res/stage_map.png'),
      };
      Loader.loadAjax('res/ewerk.obj', text => {
        const obj = objLoader.parse(text);
        obj.rotation.y += Math.PI;
        obj.scale.set(10, 10, 10);
        obj.traverse(mesh => {
          mesh.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            map: maps[mesh.name],
          });
        });
        this.ewerkModel.add(obj);
      });
      this.scene.add(this.ewerkModel);

      this.beamer = new THREE.Mesh(
        new THREE.BoxGeometry(0.01, 9, 16),
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
        }));
      this.scene.add(this.beamer);
      this.beamer.scale.set(0.185, 0.185, 0.185);
      this.beamer.position.x = -5.3;
      this.beamer.position.y = 1.10;
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

      this.globeContainer = new THREE.Object3D();
      //this.globeContainer.add(this.ps.particles);

      this.globe = new THREE.Mesh(
          new THREE.SphereBufferGeometry(200, 64, 64),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 1,
            metalness: 0,
            transparent: true,
          }));

      this.globeOutline = new THREE.Mesh(
          new THREE.SphereBufferGeometry(200, 64, 64),
          new THREE.MeshBasicMaterial({
            //color: 0x373c3f,
            color: 0xc2e4b7,
            transparent: true,
          }));
      this.scene.add(this.globeOutline);

      this.globeDetail = new THREE.Mesh(
          new THREE.SphereBufferGeometry(200.1, 64, 64),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
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
      //this.globeContainer.add(this.cloudGlobe);
      this.globeContainer.add(this.globeDetail);
      //this.globeContainer.add(this.cloudGlobeDetail);

      this.globeContainer.rotation.x = -Math.PI / 2 + .8;

      this.globeLight = new THREE.DirectionalLight();
      this.globeLight.position.set(1, 2., 1);
      this.globeLight.intensity = 0.75;
      this.globeLight.decay = 2;
      this.globeLight.color = new THREE.Color(255 / 255, 255 / 255, 255 / 255);
      this.scene.add(this.globeLight);
      this.scene.add(new THREE.AmbientLight(0xffffff, 0.2));

      this.scene.add(this.globeContainer);

      this.map = new THREE.Mesh(
        new THREE.PlaneGeometry(700, 700),
        new THREE.MeshStandardMaterial({
          color: 0x006600,
          roughness: 1,
          metalness: 0,
        })
      );
      this.map.rotation.x = -Math.PI/2;
      this.map.rotation.z = 0.11;
      this.map.position.y = -0.02;
      this.map.position.x = 15;
      this.map.position.z = 16;
      //this.scene.add(this.map);

      this.camera.near = 0.1;
      this.camera.updateProjectionMatrix();
      this.camera.position.z = 50;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));

      this.skybox = new THREE.Mesh(
          new THREE.BoxGeometry(2000, 2000, 2000),
          new THREE.MeshBasicMaterial({
            color: 0x99da85,
            side: THREE.BackSide,
          }));
      this.scene.add(this.skybox);

      this.revisionLogo = new THREE.Mesh(
        new THREE.PlaneGeometry(1920, 1080, 1, 1),
        new THREE.MeshBasicMaterial({
          map: Loader.loadTexture('res/end.png'),
          transparent: true,
        })
      );
      this.revisionLogo.scale.set(1.05, 1.05, 1.05);
      this.revisionLogo.rotation.x = -Math.PI / 2;
      this.revisionLogo.position.set(0, 350, 105);
      this.scene.add(this.revisionLogo);
    }

    beforeUpdate(frame) {
      this.inputs.beamer.enabled = BEAN > 200 && BEAN < 672;
      this.inputs.beamer2.enabled = BEAN > 3672 && BEAN < 4280;
    }

    update(frame) {
      super.update(frame);

      this.skybox.visible = frame < 250 || frame > 11308;
      this.lowpolySkybox.visible = frame >= 250 && frame <= 11308;

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
      this.globeDetail.visible = frame >= 248 && frame <= 11317;
      this.cloudGlobeDetail.visible = frame >= 248 && frame <= 11317;
      this.globe.visible = frame < 248 || frame > 11317;
      this.cloudGlobe.visible = frame < 248 || frame > 11317;
      this.revisionLogo.visible = frame > 11317;
      this.ewerkModel.visible = frame >= 248 && frame <= 11317;

      this.globe.material.opacity = 1;
      this.cloudGlobe.material.opacity = 1;
      this.revisionLogo.material.opacity = 0;

      const globeTextures = this.inputs.globeTextures.getValue();
      if(globeTextures) {
        this.globe.material.map = globeTextures.map;
        this.cloudGlobe.material.alphaMap = globeTextures.cloudMap;
        this.cloudGlobe.material.roughnessMap = globeTextures.cloudMap;
        this.globeDetail.material.map = globeTextures.mapDetail;
        this.cloudGlobeDetail.material.alphaMap = globeTextures.cloudMapDetail;
        this.cloudGlobeDetail.material.roughnessMap = globeTextures.cloudMapDetail;
        //this.skybox.material = globeTextures.skyboxMaterial;
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

      if(frame > frame2 && frame < frame12) {
        this.map.visible = true;
      } else {
        this.map.visible = false;
      }

      if (frame <= frame1) {
        const t = clamp(0, (frame - frame1 + 10) / 10, 1);
        /*
        if(this.skybox.material.materials) {
          for(let i = 0; i < this.skybox.material.materials.length; i++) {
            const material = this.skybox.material.materials[i];
            material.color = new THREE.Color(t, t, t);
          }
        }
        */

        this.camera.position.set(
          lerp(0, 0, t),
          lerp(1200, 900, t),
          lerp(300, 200, t)
        );

        this.globeContainer.visible = t > 0.00001;

        const scale = easeOut(0.00001, 1, t);
        this.globeContainer.scale.set(scale, scale, scale);

        this.globeContainer.rotation.x = -Math.PI / 2 + .8;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      } else if (frame <= frame2) {
        this.camera.position.set(
          lerp(0, 0, (frame - frame2 + 10) / 10),
          lerp(900, 390, (frame - frame2 + 10) / 10),
          lerp(200, 110, (frame - frame2 + 10) / 10)
        );

        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.globeContainer.rotation.x = -Math.PI / 2 + .8;
        this.globeContainer.rotation.x += lerp(0, .3, (frame - frame2 + 10) / 10);
        const scale = lerp(1, 1.7, (frame - frame2 + 10) / 10);
        this.globeContainer.scale.set(scale, scale, scale);

        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      } else if (frame <= frame3) {
        this.camera.position.set(
          lerp(0, 122.27, (frame - frame3 + 10) / 10),
          lerp(390, 91.84, (frame - frame3 + 10) / 10),
          lerp(110, 90.38, (frame - frame3 + 10) / 10)
        );
        const scale = easeIn(1.7, 2.2, (frame - frame3 + 40) / 40);
        this.globeContainer.scale.set(scale, scale, scale);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      } else if (frame <= frame4) {
        this.camera.position.set(
          lerp(
            lerp(122.27, 127, (frame - frame3) / (frame4 - frame3)),
            30,
            (frame - frame4 + 10) / 10
          ),
          lerp(
            lerp(91.84, 82, (frame - frame3) / (frame4 - frame3)),
            15,
            (frame - frame4 + 10) / 10
          ),
          lerp(
            lerp(90.38, 86, (frame - frame3) / (frame4 - frame3)),
            10,
            (frame - frame4 + 10) / 10
          )
        );
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      } else if( frame <= frame5) {
        this.camera.position.set(
          lerp(
            lerp(30, 30, (frame - frame4) / (frame5 - frame4)),
            16,
            (frame - frame5 + 10) / 10
          ),
          lerp(
            lerp(15, 14, (frame - frame4) / (frame5 - frame4)),
            5,
            (frame - frame5 + 10) / 10
          ),
          lerp(
            lerp(10, 9, (frame - frame4) / (frame5 - frame4)),
            1,
            (frame - frame5 + 10) / 10
          )
        );
        this.camera.lookAt(new THREE.Vector3(
          lerp(0, -4, (frame - frame5 + 10) / 10),
          lerp(0, -1.5, (frame -frame5 + 10) / 10),
          0
        ));
      } else if(frame <= frame6) {
        const t = (frame - 531) / (563 - 531);
        this.camera.position.set(
          lerp(
            lerp(16, 15, (frame - frame5) / (frame6 - frame5)),
            0,
            t
          ),
          lerp(
            lerp(5, 4, (frame - frame5) / (frame6 - frame5)),
            0.5,
            t) + easeOut(0, -3.5, t * 2) + lerp(0, 3.5, t),
          lerp(1, 1, t) + easeOut(0, 1.6, t) + easeIn(0, -1.6, t));
        this.camera.lookAt(
            new THREE.Vector3(
              lerp(-4, -5.3, t),
              lerp(-1.5, 1.1, t),
              lerp(0, 0.42, t)
              ));
      } else if (frame <= frame7) {
        const x = -3.2796042561328207;
        const y = 1.08649525980141;
        const z = 0.3240734065472578;

        this.camera.position.set(
          lerp(
            lerp(0, -0.5, (frame - frame6) / (frame7 - frame6)),
            x,
            (frame - frame7 + 10) / 9
          ),
          lerp(0.5, y, (frame - frame7 + 10) / 10),
          lerp(1, z, (frame - frame7 + 10) / 10));
        this.camera.lookAt(
            new THREE.Vector3(x - 2, y - .0, z + 0.01));
      } else if (frame <= frame9) {
        this.camera.position.set(
          lerp(
            easeIn(-3.2796042561328207, -1.0, (frame - frame8) / 10),
            0,
            (frame - frame8) / (frame9 - frame8)
          ),
          easeIn(1.08649525980141, 0.5, (frame - frame8) / 10),
          easeIn(0.3240734065472578, 1, (frame - frame8) / 10)
        );
        this.camera.lookAt(
            new THREE.Vector3(-5.2796042, 1.08649525, 0.334073));
      } else if (frame <= frame10) {
        const t = (frame - frame9) / 30;
        this.camera.position.set(
          lerp(
            0,
            lerp(15, 16, (frame - frame9) / (frame10 - frame9)),
            t
          ),
          easeIn(
            0.5,
            lerp(4, 5, (frame - frame9) / (frame10 - frame9)),
            t * 3 - 2
          ),
          lerp(1, 1, t) + easeIn(1.8, 0, t) + easeOut(-1.8, 0, t));
        this.camera.lookAt(
            new THREE.Vector3(
              lerp(-5.2796042, -4, t),
              lerp(1.08649525, -1.5, t),
              lerp(0.334073, 0, t)
              ));
      } else if (frame <= frame11) {
        this.camera.position.set(
          lerp(
            15,
            lerp(30, 32, (frame - frame10) / (frame11 - frame10)),
            (frame - frame10) / 10
          ),
          lerp(
            4,
            lerp(15, 19, (frame - frame10) / (frame11 - frame10)),
            (frame - frame10) / 10
          ),
          lerp(1, 10, (frame - frame10) / 10)
        );
        this.camera.lookAt(new THREE.Vector3(
          lerp(-4, 0, (frame - frame10) / 10),
          lerp(-1.5, 0, (frame - frame10) / 10),
          0
        ));
      } else if (frame <= frame12) {
        this.camera.position.set(
          lerp(32, 5, (frame - frame11) / 10),
          lerp(19, 150, (frame - frame11) / 10),
          lerp(10, 20, (frame - frame11) / 10)
        );
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      } else if (frame <= frame13) {
        const localT = (frame - frame12) / 10;
        this.camera.position.set(
          lerp(5, 0, localT),
          lerp(150, 400, localT),
          lerp(20, 100, localT)
        );
        const scale = easeIn(2.2, 1.7, (frame - frame12 + 10) / 10);
        this.globeContainer.scale.set(scale, scale, scale);
        this.globeContainer.rotation.y = 3.4 - frame / 1000;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      } else {
        const localT = (frame - frame13) / 10;
        this.camera.position.set(
          lerp(lerp(0, 0, localT), 0, localT / 60),
          lerp(lerp(400, 1200, localT), 2000, localT / 60),
          lerp(lerp(100, 200, localT), 200, localT / 60));
        const scale = easeIn(2.2, 1.7, (frame - frame13 + 40) / 40);
        this.globeContainer.scale.set(scale, scale, scale);
        this.globeContainer.rotation.y = 3.4 - frame / 1000;
        this.camera.lookAt(new THREE.Vector3(
          0,
          0,
          easeOut(0, 100, localT / 30)
        ));

        this.globe.material.opacity = easeIn(1, 0, (frame - 11350) / 150);
        this.cloudGlobe.material.opacity = easeIn(1, 0, (frame - 11350) / 150);
        this.globeOutline.material.opacity = easeIn(1, 0, (frame - 11350) / 150);
        this.revisionLogo.material.opacity = easeIn(0, 1, (frame - 11350) / 150);
      }

      this.globeOutline.position.copy(this.globe.position);
      this.globeOutline.position.y -= 500;
      this.globeOutline.position.z -= 110;
      this.globeOutline.visible = this.globeContainer.visible;
      const scale = this.globe.scale.x * 1.7;
      this.globeOutline.scale.set(scale, scale, scale);
    }

    render(renderer) {
      this.ps.render();
      super.render(renderer);
    }
  }

  global.ewerk = ewerk;
})(this);
