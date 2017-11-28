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

      this.random = new Random(666);

      this.scene = new THREE.Scene();
      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      });
      this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

      // BALL
      this.ballGeometry = new THREE.SphereGeometry(1, 32, 32);
      this.ballMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
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
        new THREE.CylinderGeometry(16, 16, 80, 32, 1, true),
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

      this.camera.position.z = 100;
    }

    update(frame) {
      this.torus.rotation.x = Math.sin(frame / 40);
      this.torus.rotation.y = Math.cos(frame / 40);

      this.cylinder.rotation.x = Math.PI / 2;

      for (let i = 0; i < this.beams.length; i++) {
        const beam = this.beams[i];
        const angle = this.randomBeamNumbers[i] * 2 * Math.PI;
        beam.position.x = 8 * Math.cos(angle);
        beam.position.y = 8 * Math.sin(angle);
        beam.position.z = 180 + (-1.66 * frame + i) % 190;
      }

      this.ball.position.x += this.ball.userData.dx;
      this.ball.position.y += this.ball.userData.dy;
      this.ball.position.z += this.ball.userData.dz;

      this.camera.position.x = 2 * Math.sin(frame / 55);
      this.camera.position.y = 2 * Math.cos(frame / 55);
    }

    render(renderer) {
      renderer.render(this.scene, this.camera, this.renderTarget, true);
      this.outputs.render.setValue(this.renderTarget.texture);
    }

    resize() {
      this.renderTarget.setSize(16 * GU, 9 * GU);
    }
  }

  global.bouncyGeometry = bouncyGeometry;
})(this);
