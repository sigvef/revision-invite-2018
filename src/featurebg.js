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

      const fudge = 0.01;
      this.ctx.fillStyle = '#82052c';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(16, 0);
      this.ctx.lineTo(16, 9 / 3 / 2 + fudge);
      this.ctx.lineTo(16 / 3 / 2 + fudge, 9);
      this.ctx.lineTo(0, 9);
      this.ctx.lineTo(0, 0);
      this.ctx.fill();

      this.ctx.fillStyle = '#500019';
      this.ctx.beginPath();
      this.ctx.moveTo(16, 9 / 3 / 2);
      this.ctx.lineTo(16, 9);
      this.ctx.lineTo(16 / 3 / 2, 9);
      this.ctx.lineTo(16, 9 / 3 / 2);
      this.ctx.fill();

      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 1pt schmalibre';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText('JUST', 2.7, 4.5);

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
