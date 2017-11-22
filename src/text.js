(function(global) {
  class text extends NIN.THREENode {
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

      this.letters = [
        {
          letter: 'R',
          bg: 'rgb(0, 224, 79)',
          script: [
            {
              bean: 0,
              x: 0,
              y: 0,
              width: 16,
              height: 9,
            },
            {
              bean: 9,
              x: 0,
              y: 0,
              width: 5.33,
              height: 9,
            },
            {
              bean: 24,
              x: 0,
              y: 0,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 48,
              x: 0,
              y: 0,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 57,
              x: 0,
              y: 0,
              width: 5.33,
              height: 3.33,
            },
            {
              bean: 70,
              x: 0,
              y: 0,
              width: 4,
              height: 3.33,
            },
            {
              bean: 79,
              x: 0,
              y: 0,
              width: 4,
              height: 4.5,
            },
            {
              bean: 94,
              x: 0,
              y: 0,
              width: 4,
              height: 4.5,
            }
          ],
        },
        {
          letter: 'E',
          bg: 'rgb(255, 73, 130)',
          script: [
            {
              bean: 0,
              x: 16,
              y: 0,
              width: 0,
              height: 9,
            },
            {
              bean: 9,
              x: 5.33,
              y: 0,
              width: 10.67,
              height: 9,
            },
            {
              bean: 24,
              x: 5.33,
              y: 4.5,
              width: 10.67,
              height: 4.5,
            },
            {
              bean: 33,
              x: 0,
              y: 4.5,
              width: 16,
              height: 4.5,
            },
            {
              bean: 48,
              x: 0,
              y: 4.5,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 57,
              x: 0,
              y: 3.33,
              width: 5.33,
              height: 1.17,
            },
            {
              bean: 70,
              x: 4,
              y: 3.33,
              width: 1.33,
              height: 1.17,
            },
            {
              bean: 79,
              x: 4,
              y: 0,
              width: 1.33,
              height: 4.5,
            },
            {
              bean: 94,
              x: 4,
              y: 0,
              width: 4,
              height: 4.5,
            }
          ],
        },
        {
          letter: 'V',
          bg: 'rgb(55, 60, 63)',
          script: [
            {
              bean: 9,
              x: 5.33,
              y: 0,
              width: 10.67,
              height: 0,
            },
            {
              bean: 24,
              x: 5.33,
              y: 0,
              width: 10.67,
              height: 4.5,
            },
            {
              bean: 33,
              x: 5.33,
              y: 0,
              width: 5.34,
              height: 4.5,
            },
            {
              bean: 79,
              x: 5.33,
              y: 0,
              width: 5.34,
              height: 4.5,
            },
            {
              bean: 94,
              x: 8,
              y: 0,
              width: 4,
              height: 4.5,
            }
          ],
        },
        {
          letter: 'I',
          bg: 'rgb(0, 224, 79)',
          script: [
            {
              bean: 24,
              x: 16,
              y: 0,
              width: 0,
              height: 4.5,
            },
            {
              bean: 33,
              x: 10.67,
              y: 0,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 57,
              x: 10.67,
              y: 0,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 70,
              x: 10.67,
              y: 4.5,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 79,
              x: 5.33,
              y: 4.5,
              width: 5.34,
              height: 4.5,
            },
            {
              bean: 94,
              x: 4,
              y: 4.5,
              width: 4,
              height: 4.5,
            },
          ],
        },
        {
          letter: 'S',
          bg: 'purple',
          script: [
            {
              bean: 33,
              x: 16,
              y: 4.5,
              width: 0,
              height: 4.5,
            },
            {
              bean: 48,
              x: 5.33,
              y: 4.5,
              width: 10.67,
              height: 4.5,
            },
            {
              bean: 57,
              x: 5.33,
              y: 4.5,
              width: 5.34,
              height: 4.5,
            },
            {
              bean: 70,
              x: 0,
              y: 4.5,
              width: 10.67,
              height: 4.5,
            },
            {
              bean: 79,
              x: 0,
              y: 4.5,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 94,
              x: 0,
              y: 4.5,
              width: 4,
              height: 4.5,
            },
          ],
        },
        {
          letter: 'I',
          bg: 'purple',
          script: [
            {
              bean: 57,
              x: 10.67,
              y: 0,
              width: 5.33,
              height: 0,
            },
            {
              bean: 70,
              x: 10.67,
              y: 0,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 79,
              x: 10.67,
              y: 0,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 94,
              x: 12,
              y: 0,
              width: 4,
              height: 4.5,
            }
          ],
        },
        {
          letter: 'O',
          bg: 'rgb(255, 73, 130)',
          script: [
            {
              bean: 70,
              x: 16,
              y: 4.5,
              width: 0,
              height: 4.5,
            },
            {
              bean: 79,
              x: 10.67,
              y: 4.5,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 94,
              x: 8,
              y: 4.5,
              width: 4,
              height: 4.5,
            }
          ],
        },
        {
          letter: 'N',
          bg: 'rgb(55, 60, 63)',
          script: [
            {
              bean: 79,
              x: 16,
              y: 4.5,
              width: 0,
              height: 4.5,
            },
            {
              bean: 94,
              x: 12,
              y: 4.5,
              width: 4,
              height: 4.5,
            }
          ],
        }
      ];
    }

    update(frame) {
      super.update(frame);

      const startBean = 70 * 12 * 4;

      // This clears the canvas
      this.canvas.width += 0;

      this.ctx.save();
      this.ctx.scale(GU, GU);

      for (const letter of this.letters) {
        let previous = letter.script[0];
        let target = letter.script[0];
        for (const scriptEntry of letter.script) {
          if (scriptEntry.bean + startBean > BEAN) {
            target = scriptEntry;
            break;
          }
          previous = scriptEntry;
        }
        const startFrame = FRAME_FOR_BEAN(startBean + previous.bean);
        const endFrame = FRAME_FOR_BEAN(startBean + target.bean);
        const t = (frame - startFrame) / (endFrame - startFrame);

        this.ctx.save();
        this.ctx.translate(
          lerp(previous.x, target.x, t),
          lerp(previous.y, target.y, t)
        );
        this.ctx.scale(
          lerp(previous.width, target.width, t),
          lerp(previous.height, target.height, t)
        );
        this.ctx.fillStyle = letter.bg;
        this.ctx.fillRect(
          0,
          0,
          1,
          1
        );
        this.ctx.font = 'bold 1px brandontext';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(
          letter.letter,
          0.5,
          0.85
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

  global.text = text;
})(this);
