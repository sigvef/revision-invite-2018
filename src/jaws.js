(function(global) {

  class jaws extends NIN.Node {
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

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    update(frame) {
      super.update(frame);
      this.frame = frame;
    }

    render() {
      this.ctx.fillStyle = 'rgb(55, 60, 63)';
      this.ctx.strokeStyle = 'rgb(55, 60, 63)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.translate(8, 4.5);
      const t = smoothstep(0, 1, (this.frame - FRAME_FOR_BEAN(68 * 12 * 4) + 20) / 20);
      const angle = lerp(0, Math.PI, t);
      this.ctx.rotate(angle);
      const scale = 1 + (t * (1 - t)) * 8;
      this.ctx.scale(scale, scale);
      this.ctx.translate(-8, -3 - (1 - t) * 1.5);

      this.ctx.lineWidth = 0.2;

      const timings = {
        0: FRAME_FOR_BEAN(66 * 12 * 4),
        2: FRAME_FOR_BEAN(66 * 12 * 4 + 9),
        4: FRAME_FOR_BEAN(66 * 12 * 4 + 24),
        6: FRAME_FOR_BEAN(66 * 12 * 4 + 34),
        8: FRAME_FOR_BEAN(67 * 12 * 4),
        10: FRAME_FOR_BEAN(67 * 12 * 4 + 10),
        12: FRAME_FOR_BEAN(67 * 12 * 4 + 24),
        14: FRAME_FOR_BEAN(67 * 12 * 4 + 35),

        16: FRAME_FOR_BEAN(66 * 12 * 4 + 48 * 2),
        18: FRAME_FOR_BEAN(66 * 12 * 4 + 9 + 48 * 2),
        20: FRAME_FOR_BEAN(66 * 12 * 4 + 24 + 48 * 2),
        22: FRAME_FOR_BEAN(66 * 12 * 4 + 34 + 48 * 2),
        24: FRAME_FOR_BEAN(67 * 12 * 4 + 48 * 2),
        26: FRAME_FOR_BEAN(67 * 12 * 4 + 10 + 48 * 2),
        28: FRAME_FOR_BEAN(67 * 12 * 4 + 24 + 48 * 2),
        30: FRAME_FOR_BEAN(67 * 12 * 4 + 35 + 48 * 2),
      };

      for(let i = 0; i < 32; i+=2) {
        if(i % 4 != 0) {
          this.ctx.fillStyle = 'rgb(255, 73, 130)';
        } else {
          this.ctx.fillStyle = 'rgb(0, 224, 79)';
        }
        const t = easeOut(1, 0, (this.frame - timings[i]) / 15);
        this.ctx.save();
        this.ctx.translate(-(this.frame - 8270) / 30, (this.frame - 8270) / 100 + 6 * t +  i / 4 * t);
        this.ctx.beginPath();
        this.ctx.moveTo(i, 9);
        this.ctx.lineTo(i + 2, 9 - (5 + i / 4));
        this.ctx.lineTo(i + 4, 9);
        this.ctx.lineTo(i, 9);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.restore();
      }
      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.jaws = jaws;
})(this);
