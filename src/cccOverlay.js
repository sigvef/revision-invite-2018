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

      if(frame > 7320) {
        const t = lerp(
          0,
          lerp(1, 0, (frame - 7532) / 20),
          (frame - 7397) / 20
        );
      } else {
        const t = easeOut(
          0,
          easeOut(1, 0, (frame - 7181) / 50),
          (frame - 7030) / 100
        );
      }
      if(frame > 7300) {
        const t = easeOut(
          0,
          easeOut(1, 0, (frame - 7512) / 100),
          (frame - 7377) / 50
        );
        // NO GRAS || NO STARS
        this.ctx.fillStyle = 'rgba(152, 90, 152, 0.9)';
        this.ctx.beginPath();
        this.ctx.moveTo(0, 9);
        this.ctx.lineTo(easeIn(0, 5.5, t), 9);
        this.ctx.lineTo(0, easeIn(9, 3.5, t));
        this.ctx.lineTo(0, 9);
        this.ctx.fill();

        this.ctx.save();
        this.ctx.translate(0, 9);
        this.ctx.rotate(Math.PI / 4);
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = 'bold 0.7pt schmalibre';
        this.ctx.fillStyle = 'white';
        this.ctx.globalCompositeOperation = 'xor';

        this.ctx.fillText('NO RIBBONS', 0, easeIn(0.8, -3.5, t));
        this.ctx.fillText('', 0, easeIn(2.0, -2.8, t));
        this.ctx.restore();
      } else {
        const t = lerp(
          0,
          lerp(1, 0, (frame - 7161) / 20),
          (frame - 7010) / 20
        );
        // NO GRAS || NO STARS
        this.ctx.fillStyle = 'rgba(152, 90, 152, 0.9)';
        this.ctx.beginPath();
        this.ctx.moveTo(0, 9);
        this.ctx.lineTo(easeIn(0, 5.5, t), 9);
        this.ctx.lineTo(0, easeIn(9, 3.5, t));
        this.ctx.lineTo(0, 9);
        this.ctx.fill();

        this.ctx.save();
        this.ctx.translate(0, 9);
        this.ctx.rotate(Math.PI / 4);
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.font = 'bold 0.7pt schmalibre';
        this.ctx.fillStyle = 'white';
        this.ctx.globalCompositeOperation = 'xor';

        this.ctx.fillText('THIS TIME', 0, easeIn(0.8, -3.5, t));
        this.ctx.restore();
      }


      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.cccOverlay = cccOverlay;
})(this);
