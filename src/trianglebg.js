(function(global) {
  class trianglebg extends NIN.Node {
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

      this.lines = [];
      const radius = 0.5;
      let totalLength = 0;
      for(let i = 0; i < 5; i++) {
        const angle = Math.PI * 2 * i / 3;
        const angleNext = Math.PI * 2 * (i + 1) / 3;
        const x = radius * Math.sin(angle);
        const y = radius * Math.cos(angle);
        const xNext = radius * Math.sin(angleNext);
        const yNext = radius * Math.cos(angleNext);
        const dx = xNext - x;
        const dy = yNext - y;
        const length = Math.sqrt(dx * dx + dy * dy);
        totalLength += length;
        this.lines.push({
          from: {x, y},
          to: {x: xNext, y: yNext},
          length,
        });
      }
      this.lines.totalLength = totalLength;
    }

    warmup(renderer) {
      this.update(4766);
      this.render(renderer);
    }

    update(frame) {
      this.frame = frame;
    }

    resize() {
      this.canvas.width = 8 * GU; 
      this.canvas.height = 8 * GU; 
    }

    drawTriangle(x, y, amount) {
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.strokeStyle = 'rgb(255, 73, 130)';
      this.ctx.lineWidth = 0.05;

      this.ctx.beginPath();
      let lengthLeft = this.lines.totalLength * amount;
      for(let i = 0; i < this.lines.length; i++) {
        if(lengthLeft <= 0) {
          break;
        }
        const line = this.lines[i];
        const t = lengthLeft / line.length;
        if(i == 0) {
          this.ctx.moveTo(line.from.x, line.from.y);
        }
        this.ctx.lineTo(lerp(line.from.x, line.to.x, t),
                        lerp(line.from.y, line.to.y, t));
        lengthLeft -= line.length;
      }

      this.ctx.stroke();
      this.ctx.restore();
    }

    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU / 2 * 8, GU / 2 * 8);
      this.ctx.translate(1, 1);

      this.ctx.fillStyle = 'rgb(25, 25, 25)';
      this.ctx.fillRect(-1, -1, 2, 2);

      const amount = smoothstep(0, 1, (this.frame - FRAME_FOR_BEAN(1824)) / (
            FRAME_FOR_BEAN(1824 + 48) - FRAME_FOR_BEAN(1824)));
      this.drawTriangle(0, 0, amount);
      var offset = easeOut(0, 0.35, (this.frame - FRAME_FOR_BEAN(1848 + 48)) / (
              FRAME_FOR_BEAN(1848 + 48 + 6) - FRAME_FOR_BEAN(1848 + 48)));
      this.drawTriangle(0, offset, amount);
      offset = easeOut(0, 0.35, (this.frame - FRAME_FOR_BEAN(1848 + 48 + 48)) / (
              FRAME_FOR_BEAN(1848 + 48 + 48 + 6) - FRAME_FOR_BEAN(1848 + 48 + 48)));
      this.drawTriangle(0, offset/2, amount);

      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.trianglebg = trianglebg;
})(this);
