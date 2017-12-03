(function(global) {
  class featuretex extends NIN.Node {
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
      this.texts = [
        '4K',
        '8K',
        '64K',
        'PC DEMO',
        'AMIGA AGA',
        'AMIGA ECS/OCS',
        'AMIGA DEMO',
        'AMIGA INTRO',
        'OLDSKOOL DEMO',
        'OLDSKOOL 4K INTRO',
        'OLDSKOOL GRAPHICS',
        'OLDSKOOL MUSIC',
        'STREAMING MUSIC',
        'EXECUTABLE MUSIC',
        'TRACKED MUSIC',
        'MODERN GRAPHICS',
        'PHOTO',
        'PAINTOVER',
        'ANIMATED GIF',
        '4K EXECUTABLE GRAPHICS',
        'OLDSCHOOL GRAPHICS',
        'GAME',
        'ANIMATION/VIDEO',
        'ASCII/ANSI',
        'MEDIA FACADE',
      ];
    }

    update(frame) {
      this.frame = frame;
    }

    render(renderer) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(GU / 3, GU / 2);

      this.ctx.fillStyle = 'white';
      this.ctx.font = 'bold 8pt schmalibre';
      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = 'center';
      const index = (BEAN - 3672) / 24 | 0;
      this.ctx.fillText(this.texts[index], 0, 2.3);

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }
  }

  global.featuretex = featuretex;
})(this);
