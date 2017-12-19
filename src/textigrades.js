(function (global) {
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
      this.ctx.font = 'bold 0.8pt schmalibre';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';

      const x = 0;
      const y = -0.18;
      if (BEAN >= 84 * 48 + 4) {
        //Show nothing
      } else if (BEAN >= 3960 + 48 + 12 + 10) {
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('GERMANY', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('GERMANY', x, y);
      } else if (BEAN >= 3960 + 48 + 12 + 4) {
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('GERMA', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('GERMA', x, y);
      } else if (BEAN >= 3960 + 48 + 12) {
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('GER', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('GER', x, y);
      } else if (BEAN >= 3960 + 48 + 4) {
        this.ctx.font = 'bold 0.8pt schmalibre';
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('SAARBRÜCKEN', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('SAARBRÜCKEN', x, y);
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
      } else if (BEAN >= 3960 + 48) {
        this.ctx.font = 'bold 0.8pt schmalibre';
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('SAARBRÜCK', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('SAARBRÜCK', x, y);
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
      } else if (BEAN >= 3960 + 24 + 12 + 10) {
        this.ctx.font = 'bold 0.8pt schmalibre';
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('SAAR', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('SAAR', x, y);
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
      } else if (BEAN >= 3960 + 24 + 12 + 8) {
        this.ctx.font = 'bold 0.8pt schmalibre';
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('SAA', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('SAA', x, y);
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
      } else if (BEAN >= 3960 + 24 + 12 + 6) {
        this.ctx.font = 'bold 0.8pt schmalibre';
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('SA', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('SA', x, y);
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
      } else if (BEAN >= 3960 + 24 + 12 + 4) {
        this.ctx.font = 'bold 0.8pt schmalibre';
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('S', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('S', x, y);
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
      } else if (BEAN >= 3960 + 24 + 6 + 4) {
        this.ctx.font = 'bold 0.8pt schmalibre';
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('EASTER 2018', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('EASTER 2018', x, y);
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
      } else if (BEAN >= 3960 + 24 + 6) {
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('EASTER 201', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('EASTER 201', x, y);
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
      } else if (BEAN >= 3960 + 24) {
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('EASTER 20', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('EASTER 20', x, y);
      } else if (BEAN >= 3960 + 24 - 2) {
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('EASTER', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('EASTER', x, y);
      } else if (BEAN >= 3960 + 24 - 6) {
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('EAST', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('EAST', x, y);
      } else if (BEAN >= 3960 + 9) {
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('E-WERK', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('E-WERK', x, y);
      } else if (BEAN >= 3960) {
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText('E-', x + 0.1, y + 0.1);
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillText('E-', x, y);
      } else if (BEAN >= 3936) {
        this.ctx.textAlign = 'center';
        this.ctx.font = 'bold 0.6pt schmalibre';
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.scale(3, 3);
        this.ctx.translate((Math.random() - 0.5) * 0.2,
          (Math.random() - 0.5) * 0.2);
        this.ctx.fillText('REVISION', 0, -0.25);
      } else if (BEAN >= 3912) {
        this.ctx.textAlign = 'center';
        this.ctx.fillText('NO LIMIT', 0, -0.19);
      } else if (BEAN >= 3888) {
        const inT = lerp(0, 1, (frame - FRAME_FOR_BEAN(3888)) / (
          FRAME_FOR_BEAN(3888 + 3) - FRAME_FOR_BEAN(3888)));
        const outT = lerp(0, 1, (frame - FRAME_FOR_BEAN(3912 - 3)) / (FRAME_FOR_BEAN(3912) - FRAME_FOR_BEAN(3912 - 3)));
        this.ctx.textAlign = 'left';
        const word = 'NO FUZZ';
        this.ctx.fillText(
          word.slice(0, lerp(0, word.length, inT - outT)),
          -7,
          -.19);
      } else if (BEAN >= 3864) {
        const inT = lerp(0, 1, (frame - FRAME_FOR_BEAN(3864)) / (
          FRAME_FOR_BEAN(3864 + 3) - FRAME_FOR_BEAN(3864)));
        const outT = lerp(0, 1, (frame - FRAME_FOR_BEAN(3888 - 3)) / (FRAME_FOR_BEAN(3888) - FRAME_FOR_BEAN(3888 - 3)));
        this.ctx.textAlign = 'left';
        const word = 'NO THEME';
        this.ctx.fillText(
          word.slice(0, lerp(0, word.length, inT - outT)),
          -7,
          -0.19);
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
