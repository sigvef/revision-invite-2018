(function(global) {
  class featurebg extends NIN.Node {
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

      this.lines = [];
      for(let i = 0; i < 100; i++) {
        const width = 0.05 * Math.random();
        const height = 1 + Math.random();
        this.lines.push({
          width,
          height,
          x: Math.random() * (16 - width),
          y: Math.random() * 13 - 2,
          dy: (1 + Math.random()) * 0.8,
        });
      }
    }

    update(frame) {
      this.frame = frame;
    }

    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.translate(16 / 2, 9 / 2);

      let t = (this.frame - FRAME_FOR_BEAN(3720 - 6)) / (
          FRAME_FOR_BEAN(3720) - FRAME_FOR_BEAN(3720 - 6));

      if(t < 0.9999) {
        this.ctx.save();
        this.ctx.translate(
          easeIn(0, -16, t),
          easeIn(0, -9 / 3 / 2, t));
        this.ctx.fillStyle = '#82052c';
        const fudge = 0.05;
        this.ctx.translate(8, 4.5);
        this.ctx.scale(2, 2);
        this.ctx.beginPath();
        this.ctx.moveTo(-8 + 0, -4.5 + 0);
        this.ctx.lineTo(-8 + 16, -4.5 + 0);
        this.ctx.lineTo(-8 + 16 + (9 / 3 / 2) * 16 / 9, -4.5 + fudge);
        this.ctx.lineTo(-8 + 16 / 3 / 2, -4.5 + 9 + fudge);
        this.ctx.lineTo(-8 + 0, -4.5 + 9 + fudge);
        this.ctx.lineTo(-8 + 0, -4.5 + 0);
        this.ctx.fill();
        this.ctx.restore();

        this.ctx.translate(
          easeIn(0, 16, t),
          0);
        this.ctx.fillStyle = '#500019';
        if(BEAN > 3750) {
          this.ctx.fillStyle = 'rgb(55, 60, 63)';
        }
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.translate(8, 4.5);
        this.ctx.scale(2, 2);
        this.ctx.moveTo(-8 + 16, -4.5 + 9 / 3 / 2);
        this.ctx.lineTo(-8 + 16, -4.5 + 9);
        this.ctx.lineTo(-8 + 16 / 3 / 2, -4.5 + 9);
        this.ctx.lineTo(-8 + 16, -4.5 + 9 / 3 / 2);
        this.ctx.fill();
        this.ctx.restore();
      }

      t = (this.frame - FRAME_FOR_BEAN(3672)) / (
          FRAME_FOR_BEAN(3672 + 6) - FRAME_FOR_BEAN(3672));

      if(BEAN < 3720) {
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
        if(BEAN < 3750) {
          this.ctx.fillText('JUST', 0, 0);
        }
      }
      this.ctx.restore();


      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.translate(16 / 2, 9 / 2);
      if(BEAN >= 3768 - 6) {
        t = (this.frame - FRAME_FOR_BEAN(3768 - 6)) / (
          FRAME_FOR_BEAN(3768) - FRAME_FOR_BEAN(3768 - 6));
        this.ctx.fillStyle = '#ff4982';
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillRect(-16, easeIn(-18, -9, t), 16 + 8, 9 * 2);
        this.ctx.fillRect(8, easeIn(9, -9, t), 16 + 8, 18);

        this.ctx.fillStyle = 'white';
        this.ctx.fillStyle = '#77e15d';
        this.ctx.fillStyle = '#ff4982';
        if(BEAN >= 3768) {
          for(let i = 0; i < this.lines.length; i++) {
            const line = this.lines[i];
            this.ctx.fillRect(line.x, line.y, line.width * 2, line.height);
            line.y = line.y - line.dy;
            if(line.y + 2 < 0) {
              line.y += 9 + line.height;
              line.x = Math.random() * (16 - line.width);
            }
          }
        }
      }

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    resize() {
      this.canvas.width = 16 * GU * 2;
      this.canvas.height = 9 * GU* 2;
    }
  }

  global.featurebg = featurebg;
})(this);
