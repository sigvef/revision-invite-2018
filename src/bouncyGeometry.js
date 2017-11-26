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

      this.scene = new THREE.Scene();
      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      });
      this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

      // CYLINDER
      this.cylinder = new THREE.Mesh(
        new THREE.CylinderGeometry(16, 16, 80, 32, 1, true),  // TODO: update openended value. rotate. tweak size. tweak transparency.
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
      const beamRandom = new Random(666);
      this.beamMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
      this.beamGeometry = new THREE.BoxGeometry(.05, .05, 20);
      this.numBeams = 777;
      this.randomBeamNumbers = [];
      this.beams = [];
      for (let i = 0; i < this.numBeams; i++) {
        const beamMesh = new THREE.Mesh(this.beamGeometry, this.beamMaterial);
        this.randomBeamNumbers.push(beamRandom());
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
