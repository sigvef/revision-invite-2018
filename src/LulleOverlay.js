(function (global) {
  function timer(startBean, endBean, frame) {
    const startFrame = FRAME_FOR_BEAN(startBean);
    const endFrame = FRAME_FOR_BEAN(endBean);
    return (frame - startFrame) / (endFrame - startFrame);
  }

  class LulleOverlay extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });
      this.snareThrob = 0;
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.CanvasTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;
    }

    update(frame) {
      this.snareThrob *= 0.99;
      this.frame = frame;
      if (BEAT && BEAN % 24 == 12) {
        this.snareThrob = 1;
      }
    }

    render(renderer) {
      const frame = this.frame;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.globalAlpha = 0.90 + this.snareThrob * 0.1;

      this.ctx.save();
      this.ctx.scale(GU, GU);

      const t = timer(1873 - 12, 1873, frame);
      const t2 = timer(1969 - 12, 1969, frame);
      const leftOffset = easeIn(easeIn(-2, 0, t), -2, t2);

      const t3 = timer(1969 - 12, 1969, frame);
      const t4 = timer(2066 - 12, 2066, frame);
      const rightOffset = easeIn(easeIn(2, 0, t3), 2, t4);

      this.ctx.fillStyle = 'rgba(255,255,255,1.0)';
      this.ctx.fillRect(0 + leftOffset, 0, 1.8, 9);
      this.ctx.fillStyle = 'rgba(255,255,255,1.0)';
      this.ctx.fillRect(16 - 1.8 + rightOffset, 0, 1.8, 9);

      this.ctx.save();
      this.ctx.translate(1, 4.5);
      this.ctx.rotate(Math.PI / 2);
      this.ctx.font = '0.95pt schmalibre';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillStyle = '#373c3f';
      this.ctx.fillText('NO METABALLS', 0., -leftOffset);
      this.ctx.restore();

      this.ctx.save();
      this.ctx.translate(16 - 1, 4.5);
      this.ctx.rotate(-Math.PI / 2);
      this.ctx.font = '0.95pt schmalibre';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillStyle = '#373c3f';
      this.ctx.fillText('JUST REVISION', 0., rightOffset);
      this.ctx.restore();

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }
  }

  global.LulleOverlay = LulleOverlay;
})(this);
