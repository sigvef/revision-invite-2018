(function(global) {
  class ccc extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.camera.near = 0.001;
      this.camera.updateProjectionMatrix();

      this.random = new Random(0x80deed); // eslint-disable-line

      this.whiteColor = 0xffffff;
      this.grayColor = 0x373c3f;
      this.greenColor = 0x77e15d;
      this.pinkColor = 0xff4982;

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 200;

      this.NUM_TENTACLES = 30;
      this.NUM_PARTICLES = 200;

      this.particleStartPos = [];
      let particleGeometry = new THREE.Geometry();
      for(let i = 0; i < this.NUM_PARTICLES; i++) {
        let color = new THREE.Color(this.random() > 0.5 ? this.pinkColor : this.greenColor);

        let px = this.random()*250 - 125;
        let py = this.random()*250 - 125;
        let pz = Math.min(50, this.random()*200 - 100);
        let particlePos = new THREE.Vector3(px, py, pz);
        particleGeometry.vertices.push(particlePos);
        this.particleStartPos.push(particlePos);
        particleGeometry.colors.push(color);
      }

      let particleTexture = new THREE.CanvasTexture(this.generateParticleSprite());
      let particleMaterial = new THREE.PointsMaterial({
        size: 20,
        map: particleTexture,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        transparent: true,
        opacity: 0.4,
        vertexColors: true
      });

      this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
      this.scene.add(this.particleSystem);

      this.group = new THREE.Group();
      for(let i = 0; i < this.NUM_TENTACLES; i++) {
        let geo = new THREE.Geometry();

        let tentacleInfo = {
          wave: this.random(),
          speed: this.random() * 1000 + 200,
          radius: 80
        };

        for(let j = 0; j < this.NUM_TENTACLES; j++) {
          const point = ((j / this.NUM_TENTACLES) * tentacleInfo.radius * 2) - tentacleInfo.radius;
          const vec = new THREE.Vector3(point, 0, 0);
          geo.vertices.push(vec);
        }

        let line = new THREE.MeshLine();
        line.setGeometry(geo);//, p => 1-p);

        let lineMaterial = new THREE.MeshLineMaterial({
          color: new THREE.Color((this.random() > 0.5 ? this.pinkColor : this.greenColor)),
          resolution: new THREE.Vector2(16*GU, 9*GU),
          lineWidth: 1,
        });

        let tentacle = new THREE.Mesh(line.geometry, lineMaterial);

        tentacle.wave = tentacleInfo.wave;
        tentacle.speed = tentacleInfo.speed;
        tentacle.radius = tentacleInfo.radius;

        tentacle.rotation.x = this.random() * Math.PI;
        tentacle.rotation.y = this.random() * Math.PI;
        tentacle.rotation.z = this.random() * Math.PI;
        this.group.add(tentacle);
      }

      this.scene.add(this.group);

      this.easings = {
        lerp,
        smoothstep,
        easeIn,
        easeOut,
        step: (a, b, t) => (t >= 1 ? b : a),
      };

      this.cameraPositionPath = this.path([{
        bean: 54 * 48,
        easing: 'step',
        value: {
          x: -0.68,
          y: 0.54,
          z: 10.01,
        },
      }, {
        bean: 54 * 48 + 47,
        easing: 'lerp',
        value: {
          x: 2.35,
          y: -2.44,
          z: 34.51,
        }
      }, {
        bean: 55 * 48,
        easing: 'step',
        value: {
          x: 3.2,
          y: 4.07,
          z: -4.56,
        }
      }, {
        bean: 55 * 48 + 47,
        easing: 'lerp',
        value: {
          x: 2.2796042561328207,
          y: 18.527845733821269,
          z: -22.391666065892532,
        }
      }, {
        bean: 56 * 48,
        easing: 'step',
        value: {
          x: 8.9796042561328207,
          y: 3.7027845733821269,
          z: 21.391666065892532,
        }
      }, {
        bean: 56 * 48 + 47,
        easing: 'lerp',
        value: {
          x: 14.34,
          y: 2.49,
          z: 30.91,
        }
      }, {
        bean: 57 * 48,
        easing: 'step',
        value: {
          x: 110.1516206921957,
          y: 12.8293145279889624,
          z: 10.197342814319596,
        }
      }, {
        bean: 57 * 48 + 47,
        easing: 'lerp',
        value: {
          x: 165.46020800462132,
          y: 24.425828352204901,
          z: 14.098919570353122,
        }
      }, {
        bean: 58 * 48,
        easing: 'step',
        value: {
          x: 26.501035175479608,
          y: 73.69544870521025,
          z: 29.47197116284984,
        }
      }, {
        bean: 58 * 48 + 47,
        easing: 'lerp',
        value: {
          x: 26.501035175479608,
          y: 63.69544870521025,
          z: 29.47197116284984,
        }
      }, {
        bean: 59 * 48,
        easing: 'step',
        value: {
          x: 20.501035175479608,
          y: 63.69544870521025,
          z: 39.47197116284984,
        }
      }, {
        bean: 59 * 48 + 47,
        easing: 'lerp',
        value: {
          x: 20.501035175479608,
          y: 43.69544870521025,
          z: 39.47197116284984,
        }
      }, {
        bean: 60 * 48,
        easing: 'step',
        value: {
          x: -20.501035175479608,
          y: 43.69544870521025,
          z: 39.47197116284984,
        }
      }, {
        bean: 60 * 48 + 23,
        easing: 'lerp',
        value: {
          x: -20.501035175479608,
          y: 23.69544870521025,
          z: 39.47197116284984,
        }
      }, {
        bean: 60 * 48 + 24,
        easing: 'step',
        value: {
          x: -20.501035175479608,
          y: 6.69544870521025,
          z: 29.47197116284984,
        }
      }, {
        bean: 60 * 48 + 47,
        easing: 'lerp',
        value: {
          x: -20.501035175479608,
          y: 3.69544870521025,
          z: 29.47197116284984,
        }
      }, {
        bean: 61 * 48,
        easing: 'step',
        value: {
          x: -20.501035175479608,
          y: 14.69544870521025,
          z: 8.47197116284984,
        }
      }, {
        bean: 61 * 48 + 26,
        easing: 'lerp',
        value: {
          x: -20.501035175479608,
          y: 4.69544870521025,
          z: 0.47197116284984,
        }
      }]);

      this.cameraQuaternionPath = this.path([{
        bean: 54 * 48,
        easing: 'step',
        value: {
          x: 0,
          y: 0,
          z: -0.3285825385939043,
          w: 0.9444752592477927,
        }
      }, {
        bean: 54 * 48 + 47,
        easing: 'lerp',
        value: {
          x: 0.6,
          y: 0,
          z: -0.3285825385939043,
          w: 0.9444752592477927,
        }
      }, {
        bean: 55 * 48,
        easing: 'step',
        value: {
          x: 0.010508284556547358,
          y: 0.2967808433088046,
          z: -0.010210040495897459,
          w: 0.7171344199437335,
        }
      }, {
        bean: 55 * 48 + 47,
        easing: 'lerp',
        value: {
          x: 0.010508284556547358,
          y: 0.4967808433088046,
          z: -0.010210040495897459,
          w: 0.7171344199437335,
        }
      }, {
        bean: 56 * 48,
        easing: 'step',
        value: {
          x: 0.240508284556547358,
          y: 0.5767808433088046,
          z: -0.010210040495897459,
          w: 0.7171344199437335,
        }
      }, {
        bean: 56 * 48 + 47,
        easing: 'lerp',
        value: {
          x: 0.400508284556547358,
          y: 0.6467808433088046,
          z: -0.010210040495897459,
          w: 0.7171344199437335,
        }
      }, {
        bean: 57 * 48,
        easing: 'step',
        value: {
          x: -0.03978915818515377,
          y: 0.6755398303524284,
          z: 0.04306063490160267,
          w: 0.7349888041461586,
        }
      }, {
        bean: 58 * 48,
        easing: 'step',
        value: {
          x: -0.4633656868350794,
          y: 0.5232045804656599,
          z: 0.35662867819782085,
          w: 0.6199719293084835,
        }
      }, {
        bean: 59 * 48,
        easing: 'step',
        value: {
          x: -0.3633656868350794,
          y: 0.1232045804656599,
          z: -0.15662867819782085,
          w: 1.6199719293084835,
        }
      }, {
        bean: 60 * 48,
        easing: 'step',
        value: {
          x: -0.4633656868350794,
          y: -0.5232045804656599,
          z: 0.35662867819782085,
          w: 0.6199719293084835,
        }
      }]);
    }

    update(frame) {
      super.update(frame);

      this.group.rotation.x = (frame*0.0001);
      this.group.rotation.y = (frame*0.0001);

      this.particleSystem.rotation.z = (frame*0.0001);

      for(let i = 0; i < this.NUM_TENTACLES; i++) {
        let tentacle = this.group.children[i];

        let positions = tentacle.geometry.attributes.position.array;

        for(let j = 0; j < positions.length; j+=3) {
          let ratio = 1 - ((tentacle.radius - Math.abs(positions[j])) / tentacle.radius);
          let y = 1;
          if(BEAN >= 2784) {
            y = Math.sin(frame * 100 / tentacle.speed + j*0.15) * 2 * ratio;
          } else {
            y = Math.sin(frame * 10 / tentacle.speed + j*0.15) * 2 * ratio;
          }
          positions[j+1] = y;
        }

        tentacle.geometry.attributes.position.needsUpdate = true;
      }

      if(BEAN > 2784) {
        this.particleSystem.rotation.x = (frame*0.0005);
      }

      if (!this.camera.isOverriddenByFlyControls) {
        this.camera.position.copy(this.getPoint(this.cameraPositionPath, frame));
        this.camera.quaternion.copy(this.getPoint(this.cameraQuaternionPath, frame));
      }
    }

    render(renderer) {
      renderer.setClearColor(this.grayColor, 1.0);
      super.render(renderer);
    }

    generateParticleSprite() {
      const canvas = document.createElement('canvas');
      const size = 16;
      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext('2d');
      const gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
      gradient.addColorStop(0.4, 'rgba(64,0,0,1)');
      gradient.addColorStop(1, 'rgba(0,0,0,1)');

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(size/2, size/2, size/2, 0, 2*Math.PI, false);
      context.fill();

      return canvas;
    }

    path(points) {
      for(let i = 0; i < points.length; i++) {
        const point = points[i];
        if(!point.value) {
          point.value = points[i - 1].value;
        }
        point.frame = FRAME_FOR_BEAN(point.bean);
      }
      return points;
    }

    getPoint(path, frame) {
      let from = path[0];
      let to = path[0];
      for(let i = 0; i < path.length; i++) {
        const current = path[i];
        if(current.frame <= frame) {
          from = current; 
          if(path[i + 1]) {
            to = path[i + 1];
          } else {
            return to.value;
          }
        } else {
          break;
        }
      }
      const t = (frame - from.frame) / (to.frame - from.frame);
      const easing = this.easings[to.easing];
      return {
        x: easing(from.value.x, to.value.x, t),
        y: easing(from.value.y, to.value.y, t),
        z: easing(from.value.z, to.value.z, t),
        w: easing(from.value.w, to.value.w, t),
      };
    }
  }

  global.ccc = ccc;
})(this);
