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

    warmup(renderer) {
      this.update(9896);
      this.render(renderer);
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
        this.ctx.fillText('ATARI', 0, 4);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 12) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation);
        this.ctx.translate(-12, 1);
        this.ctx.fillText('LIVE-CODING', 0, 0.4);
        this.ctx.restore();
      }

      if (BEAN >= 3816 + 15) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation - 0.0865);
        this.ctx.translate(-5.1, -13);
        this.ctx.fillText('BONFIRE', 0, 4);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 1) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation - 0.083);
        this.ctx.translate(-5.0, -17.0);
        this.ctx.fillText('DRINKS', 0, 4);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 7) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.translate(-3.2, 6.0);
        this.ctx.rotate(rotation-0.09);
        this.ctx.fillText('OLDSKOOL', -0.5, 4);
        this.ctx.restore();
      }

      if (BEAN >= 3816 + 0) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation - 0.02);
        this.ctx.translate(0, -6);
        this.ctx.fillText('AMIGA', 0, 4);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 10) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation - 0.02);
        this.ctx.translate(0, 1);
        this.ctx.fillText('CONCERTS', 0, 0.4);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 11) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation);
        this.ctx.translate(0, 1);
        this.ctx.fillText('MUSIC', 5, 7.0);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 5) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation);
        this.ctx.translate(5.9, -8.5);
        this.ctx.fillText('FOOD', 0, 0);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 3) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation);
        this.ctx.translate(5.2, 1);
        this.ctx.fillText('GRAPHICS', 0, 10.5);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 9) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation);
        this.ctx.translate(12, -6);
        this.ctx.fillText('C64', 0, 4);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 4) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.translate(11.8, -4.4);
        this.ctx.rotate(rotation + 0.02);
        this.ctx.fillText('SEMINARS', 0, 0.4);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 13) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.translate(19, 1.5);
        this.ctx.rotate(rotation+0.16);
        this.ctx.fillText('FRIENDSHIP', 0, 0);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 2) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.rotate(rotation + 0.18);
        this.ctx.translate(19, 9.8);
        this.ctx.fillText('LIVESTREAM', 0, 0);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 8) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.translate(24.8, -9);
        this.ctx.rotate(rotation + 0.14);
        this.ctx.fillText('PHOTOWALL', 0, 0.4);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 6) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.translate(21.8, -11.5);
        this.ctx.rotate(rotation+0.12);
        this.ctx.fillText('PC', 0, 0.4);
        this.ctx.restore();
      }
      if (BEAN >= 3816 + 14) {
        this.ctx.save();
        this.ctx.font = '1.1pt schmalibre';
        this.ctx.translate(30, 11.4);
        this.ctx.rotate(rotation + 0.32);
        this.ctx.fillText('WORKSHOP', 0, 0);
        this.ctx.restore();
      }

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    resize() {
      this.canvas.width = 2 * 16 * GU;
      this.canvas.height = 2 * 9 * GU;
    }
  }

  global.featuretex = featuretex;
})(this);
