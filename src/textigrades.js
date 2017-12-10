(function(global) {
  class textigrades extends NIN.Node {
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
      const frame = this.frame;
      this.ctx.clearRect(
        0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.translate(8, 4.5);
      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 1pt schmalibre';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';

      if(BEAN >= 84 * 48 + 4) {
        // Show nothing
      } else if(BEAN >= 3960 + 24 + 9) {
        this.ctx.textAlign = 'center';
        const x = -8 + 2 * 16 / 3;
        const y = -0.1;
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('TRE', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('TRE', x, y);
      } else if(BEAN >= 3960 + 24 + 6) {
        this.ctx.textAlign = 'center';
        const x = -8 + 2 * 16 / 3;
        const y = -0.1;
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('TO', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('TO', x, y);
      } else if(BEAN >= 3960 + 24) {
        this.ctx.textAlign = 'center';
        const x = -8 + 2 * 16 / 3;
        const y = -0.1;
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('EN', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('EN', x, y);
      } else if(BEAN >= 3960 + 24 - 2) {
        this.ctx.textAlign = 'center';
        const x = -8 + 2 * 16 / 3;
        const y = -0.1;
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('PER', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('PER', x, y);
      } else if(BEAN >= 3960 + 24 - 6) {
        this.ctx.textAlign = 'center';
        const x = -8 + 2 * 16 / 3;
        const y = -0.1;
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('KIS', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('KIS', x, y);
      } else if(BEAN >= 3960 + 9 + 9) {
        this.ctx.textAlign = 'center';
        const x = -8 + 2 * 16 / 3;
        const y = -0.1;
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('SUP', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('SUP', x, y);
      } else if(BEAN >= 3960 + 9) {
        this.ctx.textAlign = 'center';
        const x = -8 + 2 * 16 / 3;
        const y = -0.1;
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('SUP', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('SUP', x, y);
      } else if(BEAN >= 3960) {
        this.ctx.textAlign = 'center';
        const x = -8 + 2 * 16 / 3;
        const y = -0.1;
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('HELLO', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('HELLO', x, y);
      } else if(BEAN >= 3936) {
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.scale(3, 3);
        this.ctx.translate((Math.random() - 0.5) * 0.3,
                           (Math.random() - 0.5) * 0.3);
        this.ctx.fillText('MORDI', 0, -0.1);
      } else if(BEAN >= 3912) {
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SUP', 0, 0);
      } else if(BEAN >= 3888) {
        const inT = lerp(0, 1, (frame - FRAME_FOR_BEAN(3888)) / (
          FRAME_FOR_BEAN(3888 + 3) - FRAME_FOR_BEAN(3888)));
        const outT = lerp(0, 1, (frame - FRAME_FOR_BEAN(3912 - 3)) / ( FRAME_FOR_BEAN(3912) - FRAME_FOR_BEAN(3912 - 3)));
        this.ctx.textAlign = 'left';
        const word = 'SKJERA';
        this.ctx.fillText(
          word.slice(0, lerp(0, word.length, inT - outT)),
          -7,
          0);
      } else if(BEAN >= 3864) {
        const inT = lerp(0, 1, (frame - FRAME_FOR_BEAN(3864)) / (
          FRAME_FOR_BEAN(3864 + 3) - FRAME_FOR_BEAN(3864)));
        const outT = lerp(0, 1, (frame - FRAME_FOR_BEAN(3888 - 3)) / ( FRAME_FOR_BEAN(3888) - FRAME_FOR_BEAN(3888 - 3)));
        this.ctx.textAlign = 'left';
        const word = 'YOLO';
        this.ctx.fillText(
          word.slice(0, lerp(0, word.length, inT - outT)),
            -7,
            0);
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

  global.textigrades = textigrades;
})(this);
