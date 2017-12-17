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

      // NO RIBBONS
      this.ctx.fillStyle = 'rgba(8, 10, 12, .2)';
      this.ctx.fillRect(9, 7.5, 16, 1.5);

      this.ctx.textAlign = 'right';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = '0.7pt schmalibre-light';
      this.ctx.fillStyle = '#c2c2a0';

      this.ctx.fillText('NO RIBBONS  ', 15.4, 8);

      // NO GRAS || NO STARS
      this.ctx.fillStyle = 'rgba(8, 10, 12, .2)';
      this.ctx.fillRect(0, 0, 7.5, 1.5);

      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';
      this.ctx.font = '0.7pt schmalibre-light';
      this.ctx.fillStyle = '#c2c2a0';

      this.ctx.fillText('   NO GRAS', 1, 0.5);


      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.cccOverlay = cccOverlay;
})(this);
