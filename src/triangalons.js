(function(global) {
  class triangalons extends NIN.Node {
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
      super.update(frame);
      this.frame = frame;
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {

      this.ctx.fillStyle = '#0f933e';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.fillStyle = '#00e04f';
      this.ctx.scale(GU, GU);
      const side = 1;
      const radius = Math.sqrt(3) / 6 * side;
      const height = Math.sqrt(3) / 2 * side;
      const topToCenter = height - radius;
      this.ctx.lineWidth = 0.05;
      this.ctx.strokeStyle = 'rgb(55, 60, 63)';
      for(let i = 0; i < 18; i++) {
        for(let j = 0; j < 12; j++) {
          this.ctx.save();
          this.ctx.translate(i + (j % 2) / 2, j * height);
          const innerRotation = Math.PI * 2 * this.frame / 60 / 60 * 115 + i - j / 4;
          const rotation =  2 * (innerRotation +
            1 * Math.sin(innerRotation)) / 4;
          this.ctx.rotate(rotation);
          const scale = 0.75 + 0.25 * Math.sin(rotation);
          this.ctx.scale(scale, scale);
          this.ctx.beginPath();
          this.ctx.moveTo(-side / 2, -radius);
          this.ctx.lineTo(side / 2, -radius);
          this.ctx.lineTo(0, topToCenter);
          this.ctx.lineTo(-side /2, -radius);
          /* a little extra line for the stroke edge to look good*/
          this.ctx.lineTo(side / 2, -radius);
          this.ctx.fill();
          this.ctx.stroke();
          this.ctx.restore();
        }
      }

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.triangalons = triangalons;
})(this);
