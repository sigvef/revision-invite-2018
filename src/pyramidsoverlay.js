(function(global) {

  function timer(startBean, endBean, frame) {
    const startFrame = FRAME_FOR_BEAN(startBean);
    const endFrame = FRAME_FOR_BEAN(endBean);
    return (frame - startFrame) / (endFrame - startFrame);
  }

  class pyramidsoverlay extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.CanvasTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;
    }

    update(frame) {
      this.frame = frame;
    }

    render(renderer) {
      const frame = this.frame;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.fillStyle = 'rgb(8, 10, 12)';
      this.ctx.fillRect(9, 9 / 3 * 2, 16, 1.5);
      this.ctx.textAlign = 'right';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = '0.7pt schmalibre-light';
      this.ctx.fillStyle = '#88c2a0';
      this.ctx.globalAlpha = 0.4;
      this.ctx.fillText('NO GREETINGS', 15.4, 6.5);

      this.ctx.globalAlpha = 1;
      const t = timer(2208 + 12, 2208 + 24, frame);
      const t2 = timer(2208 + 48 + 12, 2208 + 48 + 24, frame);
      this.ctx.clearRect(9, 0, easeIn(7, 0, t) + easeIn(0, 7, t2), 9);

      this.ctx.fillStyle = 'rgb(8, 10, 12)';
      this.ctx.fillRect(0, 2.5, 7, 1.5);
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = '0.7pt schmalibre-light';
      this.ctx.fillStyle = '#88c2a0';
      this.ctx.globalAlpha = 0.4;
      this.ctx.fillText('NO SEMINARS', 0.6, 3);

      const t3 = timer(2208 + 96 + 12, 2208 + 96 + 24, frame);
      const t4 = timer(2208 + 96 + 48 + 12, 2208 + 96 + 48 + 24, frame);
      this.ctx.clearRect(easeIn(0, 7, t3) - easeIn(0, 7, t4), 0, 16, 5);


      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }
  }

  global.pyramidsoverlay = pyramidsoverlay;
})(this);
