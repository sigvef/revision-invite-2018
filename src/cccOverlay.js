(function(global) {
  class cccOverlay extends NIN.THREENode {
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
      const frame = this.frame;

      // This clears the canvas
      this.canvas.width += 0;

      this.ctx.save();
      this.ctx.scale(GU, GU);

      if(frame > 7010) {
        const t = lerp(
          0,
          lerp(1, 0, (frame - 7241 + 10) / 20),
          (frame - 7010) / 20
        );

        // NO RIBBONS
        this.ctx.fillStyle = 'rgba(8, 10, 12, .6)';
        this.ctx.fillRect(easeIn(16, 9, t), 6, 16, 1.5);

        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = '0.7pt schmalibre-light';
        this.ctx.fillStyle = '#c2c2a0';

        this.ctx.fillText('NO PARTICLES', easeIn(17, 10, t), 6.5);
      } else {
        const t = lerp(
          0,
          lerp(1, 0, (frame - 6990) / 20),
          (frame - 6761) / 20
        );
        // NO GRAS || NO STARS
        this.ctx.fillStyle = 'rgba(8, 10, 12, .6)';
        this.ctx.fillRect(easeIn(-7, 0, t), 1.5, 7, 1.5);

        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = '0.7pt schmalibre-light';
        this.ctx.fillStyle = '#c2c2a0';

        this.ctx.fillText('  NO RIBBONS', easeIn(-6, 1, t), 2);
      }


      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.cccOverlay = cccOverlay;
})(this);
