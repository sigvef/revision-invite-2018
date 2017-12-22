(function (global) {
  class featuretex extends NIN.Node {
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
      this.texts = [
        'PARTY',
        'VISITORS',
        'MUSIC',
        'DEMOS',
        'AND',
        'MORE',
      ];
    }

    update(frame) {
      this.frame = frame;
    }

    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(GU / 3, GU / 2);

      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 8pt schmalibre';
      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = 'center';
      const index = (BEAN - 3672) / 24 | 0;
      if (this.texts[index]) {
        this.ctx.fillText(this.texts[index], 0, 2.3);
      }

      const rotation = -0.43;
      if (BEAN >= 3816) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation);
        this.ctx.translate(-12, -6);
        this.ctx.fillText('PC', 0, 4);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 6) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation);
        this.ctx.translate(0, -6);
        this.ctx.fillText('AMIGA', 0, 4);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 18) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation);
        this.ctx.translate(12, -6);
        this.ctx.fillText('C64', 0, 4);
        this.ctx.restore();
      }
      if (BEAN >= 3816) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation);
        this.ctx.translate(-12, 1);
        this.ctx.fillText('ATARI', 0, 0.4);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 9) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation);
        this.ctx.translate(0, 1);
        this.ctx.fillText('CONCERTS', 0, 0.4);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 18) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation);
        this.ctx.translate(12, 1);
        this.ctx.fillText('SEMINARS', 0, 0.4);
        this.ctx.restore();
      }

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }
  }

  global.featuretex = featuretex;
})(this);
