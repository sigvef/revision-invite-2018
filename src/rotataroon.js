(function(global) {
  class rotataroon extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        },
        inputs: {
          background: new NIN.TextureInput(),
        }
      });

      this.throb = 0;
      this.lightThrob = 0;

      this.directionalLight = new THREE.DirectionalLight(1, 1, 1);
      this.scene.add(this.directionalLight);

      const lineMaterial = new THREE.ShaderMaterial(SHADERS.linycuba).clone();
      this.lineMaterial = lineMaterial;
      this.cube = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        lineMaterial);
      this.scene.add(this.cube);



      this.cube.rotation.x = Math.PI / 4 - 0.15;
      this.cube.rotation.y = Math.PI / 4 - 0.1;
      this.cube.rotation.z = -0.08;
      this.cube.position.z = 280;
      this.cube.position.x = 0.9;
      this.cube.position.y = 0.18;

      this.camera.fov = 1;
      this.camera.updateProjectionMatrix();
      this.camera.position.z = 516;

      this.bg = new THREE.Mesh(
          new THREE.BoxGeometry(16, 9, 1),
          new THREE.MeshBasicMaterial());
      this.scene.add(this.bg);

      this.bgOverdraw = new THREE.Mesh(
          new THREE.BoxGeometry(16, 9, 1),
          new THREE.MeshBasicMaterial());
      this.scene.add(this.bgOverdraw);
      this.bgOverdraw.position.z = 1;

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');

      this.bgOverdraw.material.map = new THREE.CanvasTexture(this.canvas);
      this.bgOverdraw.material.map.minFilter = THREE.LinearFilter;
      this.bgOverdraw.material.map.magFilter = THREE.LinearFilter;
      this.bgOverdraw.material.transparent = true;
      this.resize();
    }

    resize() {
      super.resize();
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    beforeUpdate(frame) {
      this.inputs.background.enabled = BEAN < 3864;
    }

    update(frame) {
      this.throb *= 0.95;
      this.lightThrob *= 0.95;
      if(BEAN < 3864) {
        this.bg.material.map = this.inputs.background.getValue();
        this.bg.material.needsUpdate = true;
        this.bg.visible = true;
        this.bgOverdraw.visible = true;
        this.cube.visible = false;
        this.camera.fov = 1;
        this.camera.updateProjectionMatrix();
        this.camera.position.z = 516;
      } else {
        this.cube.visible = true;
        this.bg.visible = false;
        this.bgOverdraw.visible = false;

        const t = lerp(0, 1, (this.frame - FRAME_FOR_BEAN(3864)) / (
            FRAME_FOR_BEAN(3864 + 24) - FRAME_FOR_BEAN(3864)));
        this.camera.fov = easeIn(1, 18, t);
        this.camera.updateProjectionMatrix();
        this.camera.position.z = easeOut(516, 300, Math.pow(t, 1.5));

        this.cube.rotation.x = Math.PI / 4 - 0.15 + Math.max(
            0, (frame - FRAME_FOR_BEAN(3864 + 9)) / 31);
        this.cube.rotation.y = Math.PI / 4 - 0.1;
        this.cube.rotation.z = -0.08 + Math.max(
            0, (frame - FRAME_FOR_BEAN(3864 + 9)) / 23);

        const t2 = lerp(0, 1, (this.frame - FRAME_FOR_BEAN(3864 + 9)) / (
            FRAME_FOR_BEAN(3864 + 24) - FRAME_FOR_BEAN(3864 + 9)));
        this.cube.rotation.x += easeOut(0, Math.PI, t2);
        this.cube.rotation.z += easeOut(0, Math.PI, t2);

      }

      if(BEAT && BEAN == 3864) {
        this.throb = 3;
      }

      if(BEAT) {
        switch((BEAN - 24) % (96 * 2)) {
        case 0:
        case 9:
        case 16:
        case 18:
        case 20:
        case 22:
        case 24:
        case 33:
        case 42:
        case 52:
        case 54:
        case 58:
        case 72:
        case 76:
        case 78:
        case 82:
        case 90:
        case 94:
        case 96:
        case 102:
        case 106:
        case 114:
        case 124:
        case 126:
        case 138:
        case 148:
        case 150:
        case 162:
        case 166:
        case 172:
        case 174:
        case 178:
        case 184:
        case 190:
          this.lightThrob = 1;
        }
      }

      this.cube.material.uniforms.lightAmount.value = this.lightThrob;

      demo.nm.nodes.bloom.opacity = 0.25 + this.throb;

      this.frame = frame;
    }

    render(renderer) {
      if(BEAN < 3864) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.scale(GU / 1920 * 16 * 3, GU / 1080 * 9 * 3);
        this.ctx.strokeStyle = 'rgb(255, 73, 130)';
        this.ctx.lineWidth = 15;
        this.ctx.lineCap = 'round';

        this.ctx.translate(-640, -360);

        const centerX = 1041;
        const centerY = 528;

        const t = (this.frame - FRAME_FOR_BEAN(3840 + 9)) / (
            FRAME_FOR_BEAN(3840 + 12 + 6) - FRAME_FOR_BEAN(3840 + 9));

        this.ctx.beginPath();
        if(t > 0.001) {

          this.ctx.moveTo(927, 444);
          this.ctx.lineTo(
              easeOut(927, 912, t),
              easeOut(444, 583, t));

          this.ctx.moveTo(912, 583);
          this.ctx.lineTo(
              easeOut(912, 1026, t),
              easeOut(584, 660, t));

          this.ctx.moveTo(1026, 660);
          this.ctx.lineTo(
              easeOut(1026, 1142, t),
              easeOut(660, 609, t));

          this.ctx.moveTo(1142, 609);
          this.ctx.lineTo(
              easeOut(1142, 1162, t),
              easeOut(609, 475, t));

          this.ctx.moveTo(1162, 475);
          this.ctx.lineTo(
              easeOut(1162, 1055, t),
              easeOut(475, 393, t));

          this.ctx.moveTo(1055, 393);
          this.ctx.lineTo(
              easeOut(1055, 927, t),
              easeOut(393, 444, t));
        }

        const t2 = (this.frame - FRAME_FOR_BEAN(3840 + 12 + 6)) / (
            FRAME_FOR_BEAN(3840 + 24) - FRAME_FOR_BEAN(3840 + 12 + 6));
        if(t2 > 0.001) {
          this.ctx.moveTo(927, 444);
          this.ctx.lineTo(
              easeOut(927, centerX, t2),
              easeOut(444, centerY, t2));

          this.ctx.moveTo(1026, 660);
          this.ctx.lineTo(
              easeOut(1026, centerX, t2),
              easeOut(660, centerY, t2));

          this.ctx.moveTo(1162, 475);
          this.ctx.lineTo(
              easeOut(1162, centerX, t2),
              easeOut(475, centerY, t2));
        }

        this.ctx.stroke();
        this.ctx.restore();
        this.bgOverdraw.material.map.needsUpdate = true;
      }
      super.render(renderer);
    }

  }

  global.rotataroon = rotataroon;
})(this);
