(function(global) {
  class bowties extends NIN.Node {
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


    warmup(renderer) {
      this.update(9327);
      this.render(renderer);
    }

    render() {

      this.ctx.fillStyle = 'rgb(255, 73, 130)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = 'white';
      this.ctx.lineWidth = 0.05;
      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.beginPath();
      for(let i = 0; i < 20; i++) {
        for(let j = 0; j < 10; j++) {
          const x = i + (j % 2) * 0.5;
          const y = j;
          const r = 0.25 + Math.max(0, (i % 2) * 0.25 - (j % 2 == 0) * 0.25);
          this.ctx.save();
          this.ctx.translate(x, y);
          let angle = (this.frame / 10) % (Math.PI * 2);
          angle = (angle + (i ^ j) / 2) % (Math.PI * 2);
          if(angle > Math.PI) {
            angle = Math.PI * 2 - angle;
            this.ctx.rotate(Math.PI / 2);
          }
          this.ctx.moveTo(0, 0);
          this.ctx.lineTo(r * Math.cos(-angle / 2),
                          r * Math.sin(-angle / 2));
          this.ctx.arc(0, 0, r,
               - angle / 2,
               + angle / 2);
          this.ctx.lineTo(0, 0);
          this.ctx.lineTo(r * Math.cos(Math.PI - angle / 2),
                          r * Math.sin(Math.PI - angle / 2));
          this.ctx.arc(0, 0, r, Math.PI -angle / 2, Math.PI + angle / 2);
          this.ctx.lineTo(0, 0);
          this.ctx.restore();
        }
      }
      this.ctx.fill();

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.bowties = bowties;
})(this);
