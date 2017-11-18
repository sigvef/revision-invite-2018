(function(global) {
  class diamondillium extends NIN.THREENode {
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
      demo.nm.nodes.bloom.opacity = 0.1;
      this.ctx.save();
      this.ctx.fillStyle = 'rgb(55, 60 ,63)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      const zoomer = easeIn(1, 1.6, (this.frame - 375) / (625 - 375));
      this.ctx.scale(zoomer, zoomer);
      this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
      this.ctx.scale(GU * 2, GU * 2);
      this.ctx.fillStyle = 'rgb(255, 73, 130)';
      this.ctx.strokeStyle = 'rgb(55, 60 ,63)';
      this.ctx.scale(0.75, 1);
      const inverseSqrt2 = 1 / Math.sqrt(2);
      let scale = 2 * Math.sin(Math.PI * 2 * this.frame / 60 / 60 * 115 / 2) -
        Math.cos(Math.PI * 2 * this.frame / 60 / 60 * 115 / 2);
      scale = 2;
      this.ctx.lineWidth = 0.1;
      for(let i = 0; i < 10 * 2; i++) {
        for(let j = 0; j < 6; j++) {
          this.ctx.save();
          this.ctx.translate(i, j);
          this.ctx.rotate(Math.PI / 4);
          const size = 0.5 + inverseSqrt2 + 0.5 * inverseSqrt2 * scale;
          this.ctx.fillRect(-size / 2, -size / 2, size, size);
          this.ctx.strokeRect(-size / 2, -size / 2, size, size);
          this.ctx.restore();
        }
      }
      this.ctx.fillStyle = 'rgb(55, 60 ,63)';
      this.ctx.strokeStyle = 'white';
      this.ctx.fillRect(1, 0.75, 8 / 0.75 - 2, 4.5 - 1.5);
      this.ctx.strokeRect(1, 0.75, 8 / 0.75 - 2, 4.5 - 1.5);
      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.diamondillium = diamondillium;
})(this);
