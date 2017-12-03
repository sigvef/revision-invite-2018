(function(global) {
  class featurebg extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;
    }

    update(frame) {
      this.frame = frame;
    }

    render() {
      // This clears the canvas
      this.canvas.width += 0;

      this.ctx.save();
      this.ctx.scale(GU, GU);

      let t = (this.frame - FRAME_FOR_BEAN(3720)) / (
          FRAME_FOR_BEAN(3720 + 6) - FRAME_FOR_BEAN(3720));

      this.ctx.save();
      this.ctx.translate(
        easeIn(0, -16, t),
        easeIn(0, -9 / 3 / 2, t));
      this.ctx.fillStyle = '#82052c';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(16, 0);
      this.ctx.lineTo(16 + (9 / 3 / 2) * 16 / 9, 0);
      this.ctx.lineTo(16 / 3 / 2, 9);
      this.ctx.lineTo(0, 9);
      this.ctx.lineTo(0, 0);
      this.ctx.fill();
      this.ctx.restore();

      this.ctx.translate(
        easeIn(0, 16, t),
        0);
      this.ctx.fillStyle = '#500019';
      this.ctx.beginPath();
      this.ctx.moveTo(16, 9 / 3 / 2);
      this.ctx.lineTo(16, 9);
      this.ctx.lineTo(16 / 3 / 2, 9);
      this.ctx.lineTo(16, 9 / 3 / 2);
      this.ctx.fill();

      t = (this.frame - FRAME_FOR_BEAN(3672)) / (
          FRAME_FOR_BEAN(3672 + 6) - FRAME_FOR_BEAN(3672));

      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 1pt schmalibre';
      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = 'center';
      this.ctx.translate(easeIn(-4, 4.22, t), 4.5);
      const scaleT = (this.frame - FRAME_FOR_BEAN(3672 + 6)) /
        (FRAME_FOR_BEAN(3672 + 12) - FRAME_FOR_BEAN(3672 + 6));
      let scaleX = easeIn(1.5, 1, t * t);
      let scaleY = easeIn(0.5, 1, t * t * t);
      if(BEAN >= 3672 + 6) {
        scaleX *= easeOut(1.2, 1, scaleT);
        scaleY *= easeOut(1.2, 1, scaleT);
      }
      this.ctx.scale(scaleX, scaleY);
      this.ctx.fillText('JUST', 0, 0);

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }
  }

  global.featurebg = featurebg;
})(this);
