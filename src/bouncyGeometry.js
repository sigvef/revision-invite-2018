(function (global) {
  class bouncyGeometry extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      /*
      Author: Iver
      */

      // MISC
      this.random = new Random(666);

      // SCENE, CAMERA
      this.scene = new THREE.Scene();
      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      });
      this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

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
        })
      );
      this.scene.add(this.textPlane);

      // BALL
      this.ballGeometry = new THREE.SphereGeometry(1, 8, 8);
      this.ballTexture = Loader.loadTexture('res/checkers.png');
      this.ballTexture.minFilter = THREE.LinearFilter;
      this.ballTexture.magFilter = THREE.LinearFilter;
      this.ballMaterial = new THREE.MeshBasicMaterial(
        {map: this.ballTexture}
      );
      this.ball = new THREE.Mesh(this.ballGeometry, this.ballMaterial);
      const ballSpeedFactor = 1;
      this.ball.userData = {
        dx: ballSpeedFactor * this.random(),
        dy: ballSpeedFactor * this.random(),
        dz: ballSpeedFactor * this.random()
      };
      this.scene.add(this.ball);

      // CYLINDER
      this.cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(16, 16, 180, 32, 1, true),
        new THREE.MeshBasicMaterial(
          {
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.3
          }
        )
      );
      this.scene.add(this.cylinder);

      // BEAMS
      this.beamMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
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

      // TORUS
      this.torus = new THREE.Mesh(
        new THREE.TorusGeometry(10, 3, 16, 100),
        new THREE.MeshBasicMaterial({color: 0xffffff})
      );
      //this.scene.add(this.torus);

      // CENTER FRACTURE
      // TODO

      // PARTICLES
      this.ps = new ParticleSystem({
        color: new THREE.Color(0xffffff),
        amount: 3000,
        decayFactor: 0.98
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
      demo.nm.nodes.bloom.opacity = 0.99;
      if (BEAN >= 2976 && BEAN < 3024) {
        return this.updatePart1(frame);
      } else if (BEAN >= 3024 && BEAN < 3072) {
        return this.updatePart2(frame);
      } else if (BEAN >= 3072 && BEAN < 3120) {
        // TODO
      } else if (BEAN >= 3120 && BEAN < 3312) {
        return this.updatePart4(frame);
      } else if (BEAN >= 3312) {
        demo.nm.nodes.bloom.opacity = 0.35;
        return this.updateLastTextPart(frame);
      }
    }

    updatePart1(frame) {
      this.scene.remove(this.textPlane);
      this.scene.remove(this.cylinder);
      this.scene.add(this.ball);
      this.ps.particles.visible = false;

      const startFrame = FRAME_FOR_BEAN(2976);
      const endFrame = FRAME_FOR_BEAN(3072);
      const progress = (frame - startFrame) / (endFrame - startFrame);

      // BALL
      this.ball.position.x = 0;
      this.ball.position.y = 0;
      this.ball.position.z = 0;
      this.ball.rotation.x = frame / 40;
      this.ball.rotation.y = frame / 45;

      // BEAMS
      for (let i = 0; i < this.beams.length; i++) {
        const beam = this.beams[i];
        const angle = this.randomBeamNumbers[i] * 2 * Math.PI;
        beam.position.x = 8 * Math.cos(angle);
        beam.position.y = 8 * Math.sin(angle);
        beam.position.z = -180 + (1.66 * frame + i) % 190;
        beam.scale.z = 1;
      }

      // CAMERA
      this.camera.position.x = 0;
      this.camera.position.y = 0;
      this.camera.position.z = 6;
      this.camera.lookAt(this.ball.position);
    }

    updatePart2(frame) {
      this.scene.remove(this.textPlane);
      this.scene.remove(this.cylinder);
      this.scene.add(this.ball);
      this.ps.particles.visible = true;
      this.setBeamsVisibility(true);

      const startFrame = FRAME_FOR_BEAN(3024);
      const endFrame = FRAME_FOR_BEAN(3072);
      const progress = (frame - startFrame) / (endFrame - startFrame);

      // BALL
      this.ball.position.x = 0;
      this.ball.position.y = 0;
      this.ball.position.z = lerp(60, -60, progress);
      this.ball.rotation.x = frame / 40;
      this.ball.rotation.y = frame / 45;

      // CAMERA
      const cameraRotationBefore = this.camera.rotation.y;
      this.camera.position.x = 6;
      this.camera.position.y = 0;
      this.camera.position.z = 0;
      this.camera.lookAt(this.ball.position);
      let cameraRotationDelta = Math.abs(this.camera.rotation.y - cameraRotationBefore) || 0.2;

      // BEAMS
      for (let i = 0; i < this.beams.length; i++) {
        const beam = this.beams[i];
        const angle = this.randomBeamNumbers[i] * 2 * Math.PI;
        beam.position.x = 8 * Math.cos(angle);
        beam.position.y = 8 * Math.sin(angle);
        beam.scale.z = cameraRotationDelta * 5;
        beam.position.z = (-190 / 2 + i % 190) + 20 * beam.scale.z / 2;
      }

      // PARTICLES
      for(let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        const angle2 = Math.random() * Math.PI;
        const radius = 0.8;
        const velocityAngle = Math.random() * Math.PI * 2;
        const velocityAngle2 = Math.random() * Math.PI * 2;
        const velocityRadius = 0.03;
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
      this.ps.update();
    }

    updatePart4(frame) {
      // TODO

      // TORUS
      this.torus.rotation.x = Math.sin(frame / 40);
      this.torus.rotation.y = Math.cos(frame / 40);

      // CYLINDER
      this.cylinder.rotation.x = Math.PI / 2;

      // BALL
      this.ball.position.x += this.ball.userData.dx;
      this.ball.position.y += this.ball.userData.dy;
      this.ball.position.z += this.ball.userData.dz;

      // CAMERA
      this.camera.position.x = 2 * Math.sin(frame / 55);
      this.camera.position.y = 2 * Math.cos(frame / 55);
    }

    updateLastTextPart(frame) {
      this.scene.add(this.textPlane);
      this.scene.remove(this.cylinder);
      this.scene.remove(this.ball);
      this.ps.particles.visible = false;

      // TODO: Feel free to replace this with anything. I was just bored by the sample text and wrote something.
      const text1 = "Under a smoking sun";
      const text2 = "There is just Revision";

      let currentText = null;
      if (BEAN >= 3312 && BEAN < 3336) {
        currentText = text1;
      } else {
        currentText = text2;
      }

      let foregroundColor = 'white';
      if (BEAN >= 3312 && BEAN < 3316) {
        foregroundColor = 'black';
      } else if (BEAN >= 3316 && BEAN < 3322) {
        foregroundColor = 'white';
      } else if (BEAN >= 3322 && BEAN < 3336) {
        foregroundColor = 'black';
      } else if (BEAN >= 3336 && BEAN < 3340) {
        foregroundColor = 'white';
      } else if (BEAN >= 3340 && BEAN < 3346) {
        foregroundColor = 'black';
      } else if (BEAN >= 3346) {
        foregroundColor = 'white';
      }
      const backgroundColor = foregroundColor === 'white' ? 'black': 'white';

      // TEXT
      this.textCanvas.width = this.textCanvas.width;
      this.textCtx.fillStyle = backgroundColor;
      this.textCtx.fillRect(0, 0, this.textCanvas.width, this.textCanvas.height);
      this.textCtx.font = '50px Monospace';  // TODO: Tweak font
      this.textCtx.textAlign = 'center';
      this.textCtx.fillStyle = foregroundColor;
      this.textCtx.fillText(currentText, GU * 8, GU * 4.5);

      this.textTexture.needsUpdate = true;

      this.camera.position.x = 0;
      this.camera.position.y = 0;
      this.camera.position.z = 9;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    render(renderer) {
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
