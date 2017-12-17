(function (global) {
  class bouncyGeometry extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      /*
      Author: Iver
      */

      this.stabThrob = 0;
      this.throb = 0;

      // MISC
      this.random = new global.Random(666);

      // SCENE
      this.scene = new THREE.Scene();
      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      });

      // CAMERA
      this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
      this.cameraPreviousPosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakePosition = new THREE.Vector3(0, 0, 0);
      this.cameraShakeVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAcceleration = new THREE.Vector3(0, 0, 0);
      this.cameraShakeRotation = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularVelocity = new THREE.Vector3(0, 0, 0);
      this.cameraShakeAngularAcceleration = new THREE.Vector3(0, 0, 0);

      // TEXT
      this.textCanvas = document.createElement('canvas');
      this.textCtx = this.textCanvas.getContext('2d');
      this.textTexture = new THREE.Texture(this.textCanvas);
      this.textTexture.minFilter = THREE.LinearFilter;
      this.textTexture.magFilter = THREE.LinearFilter;
      this.textPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(16, 9),
        new THREE.MeshBasicMaterial({
          map: this.textTexture,
          transparent: true
        })
      );
      this.scene.add(this.textPlane);

      // REVISION LOGO
      this.revisionLogoSegments = [
        [],
        [[0, 360]],
        [[-158, -101]],
        [[48, 87], [161, 177], [-71, -27]],
        [[31, 122], [137, 166], [-95, 18]],
        [[0, 360]],
        [[62,73], [91, 115], [173, -126], [-99, -72], [-46, -34], [-17, 1]],
        [[0, 360]],
        [[2, 61], [-135, -127]]
      ];

      // HEXAGONS
      const whiteColor = 0xffffff;
      const grayColor = 0x373c3f;
      const greenColor = 0x77e15d;
      const pinkColor = 0xff4982;
      this.colors = {
        0: new THREE.MeshBasicMaterial({ color: grayColor }),
        1: new THREE.MeshBasicMaterial({ color: whiteColor }),
        2: new THREE.MeshBasicMaterial({ color: greenColor }),
        3: new THREE.MeshBasicMaterial({ color: pinkColor }),
      };
      this.numHexagonsX = 15;
      this.numHexagonsY = this.revisionLogoSegments.length;

      // LIGHT
      this.directionalLight = new THREE.DirectionalLight();
      this.directionalLight.position.set(1, 1, 1);
      this.directionalLight.color = new THREE.Color(0xff4982);
      this.directionalLight.decay = 2;
      this.scene.add(this.directionalLight);

      // BALL
      this.ballGeometry = new THREE.SphereGeometry(1, 8, 8);
      this.ballTexture = Loader.loadTexture('res/checkers_color.png');
      this.ballTexture.minFilter = THREE.LinearFilter;
      this.ballTexture.magFilter = THREE.LinearFilter;
      this.ballMaterial = new THREE.MeshStandardMaterial({
        shading: THREE.FlatShading,
        metalness: 1,
        roughness: 0.5,
        map: this.ballTexture,
        emissive: 0xffffff,
        emissiveMap: this.ballTexture,
        emissiveIntensity: 0.2,
      });
      this.ball = new THREE.Mesh(this.ballGeometry, this.ballMaterial);
      this.scene.add(this.ball);

      // BEAMS
      this.beamMaterial = new THREE.MeshBasicMaterial({
        color: 0xcccccc,
        roughness: 1,
        metalness: 0,
        emissive: 0xffffff,
        emissiveIntensity: 1,
      });
      this.beamGeometry = new THREE.BoxGeometry(.05, .05, 20);
      this.numBeams = 777;
      this.randomBeamNumbers = [];
      this.beams = [];
      for (let i = 0; i < this.numBeams; i++) {
        const beamMesh = new THREE.Mesh(this.beamGeometry, this.beamMaterial);
        this.randomBeamNumbers.push(this.random());
        this.beams.push(beamMesh);
        this.scene.add(beamMesh);
      }
      this.beamThicknessScalers = [1, 1, 1, 1, 1, 1];
      // TODO: turn into an object with direct property access, for performance reasons
      this.chordStabBeans = [
        0, 4, 10, 22, 24, 28, 34, 40, 42, 44, 46,
        48, 52, 58, 72, 76, 82, 96, 100, 106, 118,
        120, 124, 130, 136, 138, 130, 142, 144,
        148, 154, 168, 172, 178,

        192, 4 + 192, 10 + 192, 22 + 192, 24 + 192, 28 + 192, 34 + 192, 40 + 192, 42 + 192, 44 + 192, 46 + 192,
        48 + 192, 52 + 192, 58 + 192, 72 + 192, 76 + 192, 82 + 192, 96 + 192, 100 + 192, 106 + 192, 118 + 192,
        120 + 192, 124 + 192, 130 + 192, 136 + 192, 138 + 192, 130 + 192, 142 + 192,
        148 + 192, 154 + 192, 168 + 192, 172 + 192, 178 + 192,
      ];  // + 2976
      this.updateChordStabBeans = function() {
        for (let i = 0; i < this.beamThicknessScalers.length; i++) {
          this.beamThicknessScalers[i] = Math.max(0.8, this.beamThicknessScalers[i] * 0.95);
        }
        const idx = this.chordStabBeans.indexOf(BEAN - 2976);
        if (idx !== -1) {
          let scalerIdx = idx % this.beamThicknessScalers.length;
          this.beamThicknessScalers[scalerIdx] = 4;
        }
      };

      // TODO: turn into an object with direct property access, for performance reasons
      this.leadBeans = [
        3072, 3082, 3090, 3094, 3096, 3102, 3106, 3112, 3114, 3118, 3120, 3130, 3138, 3142, 3144, 3150, 3154, 3168,
        3178, 3186, 3190, 3192, 3198, 3202, 3210, 3214, 3216, 3226, 3234, 3238, 3240, 3244, 3246, 3250, 3264, 3274,
        3282, 3286, 3288, 3294, 3298, 3306, 3310,
      ];

      // PARTICLES
      this.generateParticleSprite = function() {
        const canvas = document.createElement( 'canvas' );
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';

        // https://programmingthomas.wordpress.com/2012/05/16/drawing-stars-with-html5-canvas/
        function star(ctx, x, y, r, p, m) {
          ctx.save();
          ctx.beginPath();
          ctx.translate(x, y);
          ctx.moveTo(0, 0 - r);
          for (let i = 0; i < p; i++) {
            ctx.rotate(Math.PI / p);
            ctx.lineTo(0, 0 - (r * m));
            ctx.rotate(Math.PI / p);
            ctx.lineTo(0, 0 - r);
          }
          ctx.fill();
          ctx.restore();
        }

        star(ctx, 8, 8, 7, 5, 0.5);

        return canvas;
      };
      this.ps = new global.ParticleSystem({
        color: new THREE.Color(0xffffff),
        amount: 3000,
        decayFactor: 0.98,
        gravity: 0,
        generateSprite: this.generateParticleSprite
      });
      this.ps.particles.position.x = 0;
      this.ps.particles.position.y = 0;
      this.ps.particles.position.z = 0;
      this.ps.particles.visible = true;
      this.scene.add(this.ps.particles);
    }

    setBeamsVisibility(visible) {
      for (let i = 0; i < this.beams.length; i++) {
        const beam = this.beams[i];
        beam.visible = visible;
      }
    }

    update(frame) {
      demo.nm.nodes.bloom.opacity = 0;

      this.stabThrob *= 0.95;
      this.throb *= 0.95;

      if(BEAT && BEAN % 12 === 0) {
        this.throb = 1;
      }

      this.beamMaterial.emissiveIntensity = this.throb;

      if(BEAT) {
        switch(BEAN % 24) {
        case 0:
        case 4:
        case 10:
        case 22:
          this.stabThrob = 1;
        }
      }

      this.updateChordStabBeans(frame);
      this.updateBall(frame);
      this.updateBeams(frame);
      if (BEAN < 2976) {
        this.scene.remove(this.textPlane);
        this.camera.fov = 45;
        this.camera.updateProjectionMatrix();
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 6;
        this.camera.lookAt(this.ball.position);
        this.ps.particles.visible = true;
        this.scene.add(this.ps.particles);
      } else if (BEAN >= 2976 && BEAN < 3024) {
        return this.updatePart1(frame);
      } else if (BEAN >= 3024 && BEAN < 3072) {
        return this.updatePart2(frame);
      } else if (BEAN >= 3072 && BEAN < 3120) {
        return this.updatePart3(frame);
      } else if (BEAN >= 3120 && BEAN < 3168) {
        return this.updatePart4(frame);
      } else if (BEAN >= 3168 && BEAN < 3312) {
        return this.updatePart5(frame);
      } else if (BEAN >= 3312) {
        return this.updateLastTextPart(frame);
      }

      this.ps.update();
    }

    updateBall(frame) {
      if (BEAN < 2976) {
        const startFrame = FRAME_FOR_BEAN(2960);
        const endFrame = FRAME_FOR_BEAN(2975);
        let progress = (frame - startFrame) / (endFrame - startFrame);
        progress = Math.min(progress, 1);

        if (progress > 0) {
          this.scene.add(this.ball);

          const desiredScale = 1.1;
          const velocityFactor = 0.86;

          if (!this.ballIntroScale) {
            this.ballIntroScale = 0;
          }
          if (!this.ballIntroScaleDelta) {
            this.ballIntroScaleDelta = 0;
          }
          const ballScaleDiff = this.ballIntroScale - desiredScale;
          this.ballIntroScaleDelta += -0.089 * ballScaleDiff;  // force
          this.ballIntroScaleDelta *= velocityFactor;  // friction
          this.ballIntroScale += this.ballIntroScaleDelta;

          this.ball.position.x = 0;
          this.ball.position.y = 0;
          this.ball.position.z = 0;
          this.ball.rotation.x = frame / 40;
          this.ball.rotation.y = frame / 45;
          let scaleFactor = lerp(this.ballIntroScale, progress, progress);
          this.ball.scale.x = scaleFactor;
          this.ball.scale.y = scaleFactor;
          this.ball.scale.z = scaleFactor;
          for(let i = 0; i < 2; i++) {
            const radius = 1;
            const angle = Math.random() * Math.PI * 2;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
          }
        } else {
          this.ballIntroScale = 0;
          this.scene.remove(this.ball);
        }
      } else if (BEAN >= 2976 && BEAN < 3024) {
        this.scene.add(this.ball);
        this.ball.position.x = 0;
        this.ball.position.y = 0;
        this.ball.position.z = 0;
        this.ball.rotation.x = frame / 40;
        this.ball.rotation.y = frame / 45;
        const scale = 1 + this.stabThrob * 0.3;
        this.ball.scale.x = scale;
        this.ball.scale.y = scale;
        this.ball.scale.z = scale;
        this.ball.material.emissiveIntensity = 0.2 + this.stabThrob * 1;

      } else if (BEAN >= 3024 && BEAN < 3072) {
        this.scene.add(this.ball);
        const startFrame = FRAME_FOR_BEAN(3024);
        const endFrame = FRAME_FOR_BEAN(3072);
        const progress = (frame - startFrame) / (endFrame - startFrame);
        this.ball.position.x = 0;
        this.ball.position.y = 0;
        this.ball.position.z = lerp(60, -60, progress);
        this.ball.rotation.x = frame / 40;
        this.ball.rotation.y = frame / 45;
        const scale = 1 + this.stabThrob * 0.3;
        this.ball.scale.x = scale;
        this.ball.scale.y = scale;
        this.ball.scale.z = scale;
        this.ball.material.emissiveIntensity = 0.2 + this.stabThrob * .5;

      } else if (BEAN >= 3072 && BEAN < 3120) {
        this.scene.add(this.ball);

        const startFrame = FRAME_FOR_BEAN(3072);
        const endFrame = FRAME_FOR_BEAN(3120);
        const progress = (frame - startFrame) / (endFrame - startFrame);

        this.ball.position.x = 0;
        this.ball.position.y = 0;
        this.ball.position.z = lerp(-70, -79, progress);
        this.ball.rotation.x = lerp(2, 0, progress);
        this.ball.rotation.y = lerp(2, 0, progress);

        const scale = 1;
        this.ball.scale.x = scale;
        this.ball.scale.y = scale;
        this.ball.scale.z = scale;

      } else if (BEAN >= 3120 && BEAN < 3312) {
        this.scene.add(this.ball);

        const startFrame = FRAME_FOR_BEAN(3120);
        const endFrame = FRAME_FOR_BEAN(3168);
        const progress = (frame - startFrame) / (endFrame - startFrame);

        this.ball.position.x = 0;
        this.ball.position.y = 0;
        this.ball.position.z = -79 + 5 * progress;
        this.ball.rotation.x = lerp(0, 2, progress);
        this.ball.rotation.y = lerp(0, 2, progress);

        const scale = 1 + this.stabThrob * 0.3;
        this.ball.scale.x = scale;
        this.ball.scale.y = scale;
        this.ball.scale.z = scale;
        this.ball.material.emissiveIntensity = 0.2 + this.stabThrob * .5;

      } else if (BEAN >= 3312) {
        this.scene.remove(this.ball);
      }
    }

    updateBeams(frame) {
      if (BEAN < 2976) {
        const startFrame = FRAME_FOR_BEAN(2960);
        const endFrame = FRAME_FOR_BEAN(2976);
        const progress = Math.pow((frame - startFrame) / (endFrame - startFrame), 0.5);
        const zThreshold = lerp(-180, 10, progress);
        for (let i = 0; i < this.beams.length; i++) {
          const beam = this.beams[i];
          beam.visible = true;
          const angle = this.randomBeamNumbers[i] * 2 * Math.PI;
          beam.position.x = 8 * Math.cos(angle);
          beam.position.y = 8 * Math.sin(angle);
          beam.position.z = -180 + (1.66 * frame + i) % 190;
          if (beam.position.z > zThreshold || BEAN < 2960) {
            beam.visible = false;
          }
          beam.scale.z = 1;
          beam.scale.x = beam.scale.y = this.beamThicknessScalers[i % this.beamThicknessScalers.length];
        }
      } else if (BEAN >= 2976 && BEAN < 3024) {
        for (let i = 0; i < this.beams.length; i++) {
          const beam = this.beams[i];
          beam.visible = true;
          const angle = this.randomBeamNumbers[i] * 2 * Math.PI;
          beam.position.x = 8 * Math.cos(angle);
          beam.position.y = 8 * Math.sin(angle);
          beam.position.z = -180 + (1.66 * frame + i) % 190;
          beam.scale.z = 1;
          beam.scale.x = beam.scale.y = this.beamThicknessScalers[i % this.beamThicknessScalers.length];
        }

      } else if (BEAN >= 3024 && BEAN < 3072) {
        const startFrame = FRAME_FOR_BEAN(3024);
        const endFrame = FRAME_FOR_BEAN(3072);
        const progress = (frame - startFrame) / (endFrame - startFrame);

        const beamScale = 0.3 * progress * progress;

        for (let i = 0; i < this.beams.length; i++) {
          const beam = this.beams[i];
          const angle = this.randomBeamNumbers[i] * 2 * Math.PI;
          beam.position.x = 8 * Math.cos(angle);
          beam.position.y = 8 * Math.sin(angle);
          beam.scale.z = 0.02 + beamScale * 5;
          beam.position.z = (-190 / 2 +  (1 * frame + i) % 190) + 20 * beam.scale.z / 2;
          beam.scale.x = beam.scale.y = this.beamThicknessScalers[i % this.beamThicknessScalers.length];
        }

      } else if (BEAN >= 3072 && BEAN < 3120) {
        // BEAMS
        for (let i = 0; i < this.beams.length; i++) {
          const beam = this.beams[i];
          const angle = this.randomBeamNumbers[i] * 2 * Math.PI;
          beam.position.x = 8 * Math.cos(angle);
          beam.position.y = 8 * Math.sin(angle);
          beam.position.z = -190 + (0.09 * frame + i) % 190;
          beam.scale.z = 1;
          beam.scale.x = beam.scale.y = this.beamThicknessScalers[i % this.beamThicknessScalers.length];
        }
      } else if (BEAN >= 3120 && BEAN < 3312) {
        for (let i = 0; i < this.beams.length; i++) {
          const beam = this.beams[i];
          const angle = this.randomBeamNumbers[i] * 2 * Math.PI;
          beam.position.x = 8 * Math.cos(angle);
          beam.position.y = 8 * Math.sin(angle);
          beam.position.z = -190 + (0.09 * frame + i) % 190;
          beam.scale.z = 1;
          beam.scale.x = beam.scale.y = this.beamThicknessScalers[i % this.beamThicknessScalers.length];
        }
      } else if (BEAN >= 3312) {
        this.scene.remove(this.beams);
      }
    }

    // 11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111
    updatePart1(frame) {
      this.scene.remove(this.textPlane);
      this.ps.particles.visible = false;

      this.ps.decayFactor = 0.98;

      const startFrame = FRAME_FOR_BEAN(2976);
      const endFrame = FRAME_FOR_BEAN(3024);
      const progress = (frame - startFrame) / (endFrame - startFrame);

      // CAMERA
      this.camera.fov = 45;
      this.camera.updateProjectionMatrix();
      this.camera.position.x = lerp(0, 0.8, progress);
      this.camera.position.y = 0;
      this.camera.position.z = 6;
      this.camera.lookAt(this.ball.position);
    }

    // 22222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222
    updatePart2(frame) {
      this.scene.add(this.textPlane);
      this.textPlane.position.z = -80;
      this.ps.particles.visible = true;
      this.setBeamsVisibility(true);

      this.drawHexagons(frame);

      this.ps.decayFactor = 0.98;

      const startFrame = FRAME_FOR_BEAN(3024);
      const endFrame = FRAME_FOR_BEAN(3072);
      const progress = (frame - startFrame) / (endFrame - startFrame);

      // CAMERA
      const cameraMovement = Math.pow(progress + 0.1, 3);
      this.camera.fov = 45;
      this.camera.updateProjectionMatrix();
      this.camera.position.x = 6;
      this.camera.position.y = 0;
      this.camera.position.z = 12  - 32 * cameraMovement;
      this.camera.lookAt(this.ball.position);

      // PARTICLES
      for(let i = 0; i < 2; i++) {
        const angle = this.random() * Math.PI * 2;
        const angle2 = this.random() * Math.PI;
        const radius = 0.8 * Math.random();
        const velocityAngle = this.random() * Math.PI * 2;
        const velocityAngle2 = this.random() * Math.PI * 2;
        const velocityRadius = 0.05 * Math.random();
        this.ps.spawn(
          {
            x: this.ball.position.x + Math.sin(angle) * radius,
            y: this.ball.position.y + Math.cos(angle) * radius,
            z: this.ball.position.z + 1 + Math.sin(angle2) * radius + 2 * (1 - progress),
          },
          {
            x: Math.sin(velocityAngle2) * velocityRadius,
            y: Math.sin(velocityAngle) * velocityRadius,
            z: (Math.random() - 0.5) * 0.1,
          },
          0.02
        );
      }
    }

    // 33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333
    updatePart3(frame) {
      this.scene.add(this.textPlane);
      this.textPlane.position.z = -80;
      this.ps.particles.visible = true;
      this.setBeamsVisibility(true);

      this.ps.decayFactor = 0.98;

      this.drawHexagons(frame);

      const startFrame = FRAME_FOR_BEAN(3072);
      const endFrame = FRAME_FOR_BEAN(3120);
      const progress = (frame - startFrame) / (endFrame - startFrame);

      this.camera.fov = 45;
      this.camera.updateProjectionMatrix();
      this.camera.position.x = 6 * Math.cos(frame / 85 - 1.5);
      this.camera.position.y = 6 * Math.sin(frame / 85 - 0.5);
      this.camera.position.z = -70;

      // PARTICLES
      for(let i = 0; i < 10; i++) {
        const angle = this.random() * Math.PI * 2;
        const angle2 = this.random() * Math.PI;
        const radius = 0.8;
        const velocityAngle = this.random() * Math.PI * 2;
        const velocityAngle2 = this.random() * Math.PI * 2;
        const velocityRadius = 0.01;
        this.ps.spawn(
          {
            x: this.ball.position.x + Math.sin(angle) * radius,
            y: this.ball.position.y + Math.cos(angle) * radius,
            z: this.ball.position.z + Math.sin(angle2) * radius + 2 * (1 - progress),
          },
          {
            x: Math.sin(velocityAngle2) * velocityRadius,
            y: Math.sin(velocityAngle) * velocityRadius,
            z: 0,
          },
          0.012
        );
      }

      this.camera.lookAt(new THREE.Vector3(0, 0, -80));
    }

    // 44444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444444
    updatePart4(frame) {
      this.scene.add(this.textPlane);
      this.textPlane.position.z = -80;

      this.drawHexagons(frame);

      const startFrame = FRAME_FOR_BEAN(3120);
      const endFrame = FRAME_FOR_BEAN(3168);
      const progress = (frame - startFrame) / (endFrame - startFrame);

      this.ps.decayFactor = 0.99999;

      const impactBeans = [3120, 3130, 3144, 3154];

      // TODO

      if (impactBeans.indexOf(BEAN) !== -1) {
        this.cameraShakeAngularVelocity.x = (this.random() - 0.5) * 0.03;
        this.cameraShakeAngularVelocity.y = (this.random() - 0.5) * 0.03;
        this.cameraShakeAngularVelocity.z = (this.random() - 0.5) * 0.03;
      }

      this.camera.lookAt(new THREE.Vector3(0, 0, lerp(-80, -90, progress)));

      this.cameraShakeAcceleration.x = -this.cameraShakePosition.x * 0.07;
      this.cameraShakeAcceleration.y = -this.cameraShakePosition.y * 0.07;
      this.cameraShakeAcceleration.z = -this.cameraShakePosition.z * 0.07;
      this.cameraShakeAngularAcceleration.x = -this.cameraShakeRotation.x * 0.07;
      this.cameraShakeAngularAcceleration.y = -this.cameraShakeRotation.y * 0.07;
      this.cameraShakeAngularAcceleration.z = -this.cameraShakeRotation.z * 0.07;
      this.cameraShakeVelocity.add(this.cameraShakeAcceleration);
      this.cameraShakeAngularVelocity.add(this.cameraShakeAngularAcceleration);
      this.cameraShakeVelocity.multiplyScalar(0.9);
      this.cameraShakeAngularVelocity.multiplyScalar(0.9);
      this.cameraShakePosition.add(this.cameraShakeVelocity);
      this.cameraShakeRotation.add(this.cameraShakeAngularVelocity);

      this.camera.fov = 45;
      this.camera.updateProjectionMatrix();
      this.camera.position.x = 6 * Math.cos(frame / 85 - 2);
      this.camera.position.y = 6 * Math.sin(frame / 85 - lerp(1, 2, progress));
      this.camera.position.z = -70;

      this.cameraPreviousPosition.copy(this.camera.position);
      this.camera.position.add(this.cameraShakePosition);
      this.camera.rotation.x += this.cameraShakeRotation.x;
      this.camera.rotation.y += this.cameraShakeRotation.y;
      this.camera.rotation.z += this.cameraShakeRotation.z;
    }

    drawHexagons(frame) {
      // TODO: move to render loop, for performance reasons
      this.textCtx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);

      this.textCtx.fillStyle = '#ff4982';  // le pink
      this.textCtx.strokeStyle = '#ff4982';  // le pink

      const hexToRectStartFrame = FRAME_FOR_BEAN(3182);  // TODO: needs tweaking
      const hexToRectEndFrame = FRAME_FOR_BEAN(3186);  // TODO: needs tweaking
      const hexToRectProgress = (frame - hexToRectStartFrame) / (hexToRectEndFrame - hexToRectStartFrame);

      const hexagonGridOffsetX = 1.66 * GU;
      const hexagonGridOffsetY = 1.2 * GU;
      const hexagonRadiuses = [
        lerp(1, 0.5, hexToRectProgress),
        1,
        1,
        lerp(1, 0.5, hexToRectProgress),
        1,
        1,
      ];
      const cylinderRadius = 0.2 * GU;
      const padding = 0.1 * GU;
      const distanceBetweenHexagonCores = 1.6 * cylinderRadius + padding;
      const gridXDistance = distanceBetweenHexagonCores;
      const gridYDistance = Math.sin(Math.PI / 3) * distanceBetweenHexagonCores;

      if (BEAN < 3216) {
        const offsetRemovalStartFrame = FRAME_FOR_BEAN(3190);  // TODO: needs tweaking
        const offsetRemovalEndFrame = FRAME_FOR_BEAN(3196);  // TODO: needs tweaking
        const offsetRemovalProgress = (frame - offsetRemovalStartFrame) / (offsetRemovalEndFrame - offsetRemovalStartFrame);
        const offsetFactor = lerp(1, 0, offsetRemovalProgress);

        for (let y = 0; y < this.numHexagonsY; y++) {
          for (let x = 0; x < this.numHexagonsX; x++) {
            const offset = y % 2 === 1 ? offsetFactor * gridXDistance / 2 : 0;

            const actualX = hexagonGridOffsetX + x * gridXDistance + offset;
            const actualY = hexagonGridOffsetY + y * gridYDistance;
            this.textCtx.beginPath();
            this.textCtx.moveTo(
              actualX,
              actualY + cylinderRadius * hexagonRadiuses[0]
            );
            for (let i = 1; i < 6; i++) {
              const angle = Math.PI / 2 + Math.PI * i / 3;
              this.textCtx.lineTo(
                actualX + cylinderRadius * hexagonRadiuses[i] * Math.cos(angle),
                actualY + cylinderRadius * hexagonRadiuses[i] * Math.sin(angle)
              );
            }
            this.textCtx.closePath();
            this.textCtx.fill();
          }
        }
      } else if (BEAN >= 3216) {
        const angleAnimationStartFrame = FRAME_FOR_BEAN(3216);
        const angleAnimationEndFrame = FRAME_FOR_BEAN(3296);
        const angleAnimationProgress = lerp(
          0, 1, (frame - angleAnimationStartFrame) / (angleAnimationEndFrame - angleAnimationStartFrame)
        );

        const hexagonAngleTopLeft = Math.PI / 2 + Math.PI * 2 / 3;
        const hexagonAngleTopRight = Math.PI / 2 + Math.PI * 4 / 3;

        const circleCenterX = hexagonGridOffsetX + this.numHexagonsX * gridXDistance;
        const circleCenterY = hexagonGridOffsetY + this.numHexagonsY * gridYDistance;

        this.textCtx.lineWidth = cylinderRadius;
        for (let y = 0; y < this.numHexagonsY; y++) {
          let yMid = hexagonGridOffsetY + y * gridYDistance;
          const circleRadius = circleCenterY - yMid;

          this.textCtx.save();
          for (let x = 0; x < this.numHexagonsX; x++) {
            let xStart = hexagonGridOffsetX + x * gridXDistance + cylinderRadius * hexagonRadiuses[2] * Math.cos(hexagonAngleTopLeft) + angleAnimationProgress * 9 * GU;
            let xEnd = hexagonGridOffsetX + x * gridXDistance + cylinderRadius * hexagonRadiuses[4] * Math.cos(hexagonAngleTopRight) + angleAnimationProgress * 9 * GU;
            let yStart = yMid;
            let yEnd = yMid;

            if (xEnd > circleCenterX) {
              const overshoot = (xEnd - circleCenterX) / GU;
              const phiEnd = overshoot - Math.PI / 2;
              xEnd = circleCenterX + circleRadius * Math.cos(phiEnd);
              yEnd = circleCenterY + circleRadius * Math.sin(phiEnd);

              if (xStart > circleCenterX) {
                const overshoot = (xStart - circleCenterX) / GU;
                const phiStart = overshoot - Math.PI / 2;

                xStart = circleCenterX + circleRadius * Math.cos(phiStart);
                yStart = circleCenterY + circleRadius * Math.sin(phiStart);
              }
            }

            this.textCtx.beginPath();
            this.textCtx.moveTo(xStart, yStart);
            this.textCtx.lineTo(xEnd, yEnd);
            this.textCtx.stroke();
          }
          this.textCtx.restore();
        }
      }

      this.textTexture.needsUpdate = true;
    }

    // 55555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555
    updatePart5(frame) {
      this.scene.remove(this.ball);

      this.scene.add(this.textPlane);
      this.textPlane.position.z = -80;
      this.ps.particles.visible = false;

      this.drawHexagons(frame);

      const cameraFovStartFrame = FRAME_FOR_BEAN(3298);
      const cameraFovEndFrame = FRAME_FOR_BEAN(3306);
      const cameraFov = lerp(
        45, .1, (frame - cameraFovStartFrame) / (cameraFovEndFrame - cameraFovStartFrame)
      );

      this.camera.fov = cameraFov;
      this.camera.updateProjectionMatrix();
      this.camera.position.x = 0;
      this.camera.position.y = 0;
      this.camera.position.z = -70.6;
      this.camera.lookAt(new THREE.Vector3(0, 0, -80));
    }

    // ttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt
    updateLastTextPart(frame) {
      this.scene.add(this.textPlane);
      this.ps.particles.visible = false;

      this.textPlane.position.z = 0;

      const white = 'white';
      const black = '#373C3F';
      let text = '';
      let fontScaler = 1;
      let foregroundColor = white;
      let shakeAmount = 0;
      let throbFactor = 1;
      if (BEAN >= 3312 && BEAN < 3316) {
        text = 'AT';
        fontScaler = 1.6;
        const startFrame = FRAME_FOR_BEAN(3312);
        const endFrame = FRAME_FOR_BEAN(3316);
        const progress = (frame - startFrame) / (endFrame - startFrame);
        throbFactor = easeOut(2, 1, progress);
        fontScaler *= throbFactor;
      } else if (BEAN >= 3316 && BEAN < 3322) {
        text = 'AT EASTER';
        fontScaler = 1.5;

      } else if (BEAN >= 3322 && BEAN < 3336) {
        foregroundColor = black;
        text = 'AT EASTER 2018';
        const startFrame = FRAME_FOR_BEAN(3322);
        const endFrame = FRAME_FOR_BEAN(3332);
        const progress = (frame - startFrame) / (endFrame - startFrame);
        throbFactor = lerp(2, 0, progress);
        shakeAmount = 5 * throbFactor;
        fontScaler = 1.4;
      } else if (BEAN >= 3336 && BEAN < 3340) {
        text = 'THINGS';
        fontScaler = 1.5;
      } else if (BEAN >= 3340 && BEAN < 3346) {
        foregroundColor = white;
        text = 'THINGS WILL BE';
        fontScaler = 1.4;
      } else if (BEAN >= 3346) {
        foregroundColor = black;
        text = 'DIFFERENT';
        fontScaler = 2.2;
        const startFrame = FRAME_FOR_BEAN(3346);
        const endFrame = FRAME_FOR_BEAN(3357);
        const progress = (frame - startFrame) / (endFrame - startFrame);
        throbFactor = lerp(2, 0, progress);
        shakeAmount = 8 * throbFactor;
      }
      const backgroundColor = foregroundColor === white ? black: white;

      // TEXT
      this.textCanvas.width = this.textCanvas.width;
      this.textCtx.fillStyle = backgroundColor;
      this.textCtx.fillRect(0, 0, this.textCanvas.width, this.textCanvas.height);
      this.textCtx.font = `bold ${GU * fontScaler}px schmalibre`;
      this.textCtx.textAlign = 'center';
      this.textCtx.textBaseline = 'middle';
      this.textCtx.fillStyle = foregroundColor;
      this.textCtx.fillText(
        text,
        GU * 8 + (0.5 - this.random()) * shakeAmount,
        GU * 4.665 + (0.5 - this.random()) * shakeAmount
      );

      this.textTexture.needsUpdate = true;

      this.camera.fov = 45;
      this.camera.updateProjectionMatrix();
      this.camera.position.x = 0;
      this.camera.position.y = 0;
      this.camera.position.z = 9;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    render(renderer) {
      renderer.setClearColor(new THREE.Color(0x373C3F));
      this.ps.render();
      renderer.render(this.scene, this.camera, this.renderTarget, true);
      this.outputs.render.setValue(this.renderTarget.texture);
    }

    resize() {
      this.renderTarget.setSize(16 * GU, 9 * GU);
      this.textCanvas.width = 16 * GU;
      this.textCanvas.height = 9 * GU;
    }
  }

  global.bouncyGeometry = bouncyGeometry;
})(this);
