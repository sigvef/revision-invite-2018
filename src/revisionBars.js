(function(global) {
  class revisionBars extends NIN.THREENode {
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

      this.textScript = [
        {
          letter: 'R',
          x: 0,
          height: 5,
          beanOffset: 0,
        },
        {
          letter: 'E',
          x: 1,
          height: 4.5,
          beanOffset: 8,
        },
        {
          letter: 'V',
          x: 2,
          height: 3,
          beanOffset: 24,
        },
        {
          letter: 'I',
          x: 3,
          height: 3.5,
          beanOffset: 32,
        },
        {
          letter: 'S',
          x: 4,
          height: 4,
          beanOffset: 40,
        },
        {
          letter: 'i',
          x: 5,
          height: 5,
          beanOffset: 62,
        },
        {
          letter: 'o',
          x: 6,
          height: 4.5,
          beanOffset: 64,
        },
        {
          letter: 'N',
          x: 7,
          height: 3,
          beanOffset: 72,
        },
      ];
    }

    update(frame) {
      super.update(frame);

      // This clears the canvas
      this.canvas.width += 0;

      this.ctx.save();
      this.ctx.scale(GU, GU);

      for (const letter of this.textScript.slice().reverse()) {
        const t = (frame - FRAME_FOR_BEAN(30 * 12 * 4 + letter.beanOffset)) / 40;

        this.ctx.save();
        this.ctx.translate(
          0,
          easeIn(
            9 - elasticOut(0, letter.height, 1.2, t),
            9,
            (frame - FRAME_FOR_BEAN(32 * 12 * 4)) / 40)
        );
        this.ctx.fillStyle = 'rgba(10, 100, 150, 255)';
        this.ctx.fillRect(
          letter.x - 0.1,
          0,
          0.1,
          letter.height + 1.1
        );
        this.ctx.beginPath();
        this.ctx.arc(
          letter.x,
          1.1,
          1.1,
          -Math.PI / 2,
          Math.PI / 2
        );
        this.ctx.fill();
        this.ctx.fillRect(
          letter.x,
          1,
          1.1,
          letter.height + 0.1
        );

        this.ctx.fillStyle = 'rgba(50, 200, 255, 255)';
        this.ctx.beginPath();
        this.ctx.arc(
          letter.x,
          1.1,
          1,
          -Math.PI / 2,
          Math.PI / 2
        );
        this.ctx.fill();
        this.ctx.fillRect(
          letter.x,
          1.1,
          1,
          letter.height
        );

        this.ctx.font = 'bold 1px brandontext';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(
          letter.letter,
          letter.x + 0.5,
          1.6
        );
        this.ctx.restore();
      }

      this.ctx.restore();
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    render() {
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.revisionBars = revisionBars;
})(this);
