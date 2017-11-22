(function(global) {
  class trainoverlay extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.output = Loader.loadTexture('res/train-overlay.png');
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.output = new THREE.CanvasTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;

      this.justText = [{
        letter: 'J',
        offset: 0,
      }, {
        letter: 'U',
        offset: 0.62,
      }, {
        letter: 'S',
        offset: 1.35,
      }, {
        letter: 'T',
        offset: 2.05,
      }, {
        letter: '.',
        offset: 2.55,
      }];

      this.revisionText = [{
        letter: 'R',
        offset: 0,
      }, {
        letter: 'E',
        offset: 0.78,
      }, {
        letter: 'V',
        offset: 1.45,
      }, {
        letter: 'I',
        offset: 2.14,
      }, {
        letter: 'S',
        offset: 2.48,
      }, {
        letter: 'I',
        offset: 3.18,
      }, {
        letter: 'O',
        offset: 3.5,
      }, {
        letter: 'N',
        offset: 4.2,
      }, {
        letter: '.',
        offset: 4.8,
      }];

      for(let letterObject of [...this.revisionText, ...this.justText]) {
        letterObject.throb = 0;
      }
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    update(frame) {
      this.frame = frame;

      for(let letterObject of this.justText) {
        letterObject.throb *= 0.95;
      }
      for(let letterObject of this.revisionText) {
        letterObject.throb *= 0.95;
      }

      if(BEAT) {
        const index = BEAN % 48 - 24;
        if(this.justText[index]) {
          this.justText[index].throb = 1; 
        }
        if(this.revisionText[index]) {
          this.revisionText[index].throb = 1; 
        }
      }
    }

    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.fillStyle = 'rgb(55, 60, 63)';
      this.ctx.scale(GU, GU);

      const amount = easeOut(0, 1, (this.frame - FRAME_FOR_BEAN(2016)) / (FRAME_FOR_BEAN(2028) - FRAME_FOR_BEAN(2016)));

      this.ctx.beginPath();
      const ratio = (16 / 3) / 9;
      const farX = 16 / 3 + 2 * 16 / 3 / 3;
      const topY = 9 - farX / ratio;
      let offset = -farX * (1 - amount);
      offset = smoothstep(offset, 16 - farX,
          (this.frame - FRAME_FOR_BEAN(2184)) / (FRAME_FOR_BEAN(2208) - FRAME_FOR_BEAN(2184)));

      this.ctx.moveTo(0 + offset, topY);
      this.ctx.lineTo(farX + offset, 9);
      this.ctx.lineTo(-10 + offset, 9);
      this.ctx.lineTo(-10 + offset, topY);
      this.ctx.lineTo(0 + offset, topY);

      const offset2 = -16 * (1 - amount);
      this.ctx.moveTo(160 + offset2, 0);
      this.ctx.lineTo(160 + offset2, 9);
      this.ctx.lineTo(16 + offset2, 9);
      this.ctx.lineTo(2 * 16 / 3 + offset2, 0);
      this.ctx.lineTo(160 + offset2, 0);

      this.ctx.fill();

      this.ctx.fillStyle = '#00e04f';
      this.ctx.font = 'bold 0.6pt Arial';
      for(let letterObject of this.justText) {
        this.ctx.globalAlpha = letterObject.throb;
        this.ctx.fillText(letterObject.letter, offset + 0.8 + letterObject.offset, 7.);
      }
      for(let letterObject of this.revisionText) {
        this.ctx.globalAlpha = letterObject.throb;
        this.ctx.fillText(letterObject.letter, offset + 0.8 + letterObject.offset, 8.1);
      }
      this.ctx.restore();

      this.outputs.render.setValue(this.output);
      this.output.needsUpdate = true;
    }
  }

  global.trainoverlay = trainoverlay;
})(this);
