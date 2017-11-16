(function(global) {
  class patterns extends NIN.Node {
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

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {
      this.ctx.fillStyle = 'rgb(255, 73, 130)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.fillStyle = '#00e04f';
      let amount = Math.sin(this.frame * Math.PI * 2 / 60 / 60 * 115 / 2);
      let sign = Math.sign(amount);
      amount = Math.pow(amount, 8);
      amount *= sign;
      for(let j = 0; j < 20; j++) {
        for(let i = 0; i < 17; i++) {
          this.ctx.lineTo(j % 2 ? i : 16 - i,
              -2 +
              j + (i % 2)
              + amount / 2 * (j % 2 ? 1 : -1)
              );
        }
      }
      this.ctx.lineTo(0, 20);
      this.ctx.fill();

      this.ctx.globalCompositeOperation = 'destination-in';
      this.ctx.beginPath();
      this.ctx.arc(4, 4, 3.5, 0, Math.PI * 2);
      this.ctx.moveTo(12 + 1.5, 5);
      this.ctx.arc(12, 5, 1.5, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.lineWidth = 0.1;
      this.ctx.strokeStyle = '#85062e';
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.stroke();

      this.ctx.fillStyle = 'rgb(255, 73, 130)';
      this.ctx.globalCompositeOperation = 'destination-over';
      this.ctx.fillRect(0, 0, 16 * GU, 9 * GU);

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.patterns = patterns;
})(this);
