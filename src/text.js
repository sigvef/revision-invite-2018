(function(global) {
  class text extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.cameraX = 0;
      this.cameraY = 0;
      this.cameraR = 0;
      this.cameraDX = 0;
      this.cameraDY = 0;
      this.cameraDR = 0;
      this.cameraDDX = 0;
      this.cameraDDY = 0;
      this.cameraDDR = 0;

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;
      this.testo = document.createElement('img');
      Loader.load('res/testo.png', this.testo, () => {});

      this.greybg = document.createElement('img');
      Loader.load('res/greybg.png', this.greybg, () => {});

      const green = '#00e04f';
      const pink = 'rgb(255, 73, 130)';
      this.letters = [
        {
          letter: 'R',
          bg: green,
          rotateSpeed: 1.1,
          leaveOffset: 48 * 15 + 5,
          throbAt: 0,
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
              bean: 42,
              x: 0,
              y: 0,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 60,
              x: 0,
              y: 0,
              width: 5.33,
              height: 3.33,
            },
            {
              bean: 72,
              x: 0,
              y: 0,
              width: 4,
              height: 3.33,
            },
            {
              bean: 81 + 6,
              x: 0,
              y: 0,
              width: 4,
              height: 4.5,
            }
          ],
        },
        {
          letter: 'E',
          bg: pink,
          rotateSpeed: 0.8,
          leaveOffset: 48 * 15 + 10,
          throbAt: 9,
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
              bean: 42,
              x: 0,
              y: 4.5,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 60,
              x: 0,
              y: 3.33,
              width: 5.33,
              height: 1.17,
            },
            {
              bean: 72,
              x: 4,
              y: 3.33,
              width: 1.33,
              height: 1.17,
            },
            {
              bean: 81 + 6,
              x: 4,
              y: 0,
              width: 4,
              height: 4.5,
            }
          ],
        },
        {
          letter: 'V',
          bg: green,
          rotateSpeed: 1.2,
          leaveOffset: 48 * 15 + 0,
          throbAt: 24,
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
              bean: 72,
              x: 5.33,
              y: 0,
              width: 5.34,
              height: 4.5,
            },
            {
              bean: 81 + 6,
              x: 8,
              y: 0,
              width: 4,
              height: 4.5,
            }
          ],
        },
        {
          letter: 'I',
          bg: pink,
          rotateSpeed: 0.9,
          leaveOffset: 48 * 15 + 9,
          throbAt: 48 + 12,
          script: [
            {
              bean: 42,
              x: 10.67,
              y: 0,
              width: 5.33,
              height: 0,
            },
            {
              bean: 60,
              x: 10.67,
              y: 0,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 72,
              x: 10.67,
              y: 0,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 81 + 6,
              x: 12,
              y: 0,
              width: 4,
              height: 4.5,
            }
          ],
        },
        {
          letter: 'S',
          bg: pink,
          rotateSpeed: 1.7,
          leaveOffset: 48 * 15 + 10,
          throbAt: 24 + 18,
          script: [
            {
              bean: 33,
              x: 16,
              y: 4.5,
              width: 0,
              height: 4.5,
            },
            {
              bean: 42,
              x: 5.33,
              y: 4.5,
              width: 5.34,
              height: 4.5,
            },
            {
              bean: 60,
              x: 5.33,
              y: 4.5,
              width: 5.34,
              height: 4.5,
            },
            {
              bean: 72,
              x: 0,
              y: 4.5,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 81 + 6,
              x: 0,
              y: 4.5,
              width: 4,
              height: 4.5,
            },
          ],
        },
        {
          letter: 'I',
          bg: green, 
          rotateSpeed: 0.1,
          leaveOffset: 48 * 15 + 24,
          throbAt: 24 + 9,
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
              bean: 42,
              x: 10.67,
              y: 0,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 60,
              x: 10.67,
              y: 4.5,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 72,
              x: 5.33,
              y: 4.5,
              width: 5.34,
              height: 4.5,
            },
            {
              bean: 81 + 6,
              x: 4,
              y: 4.5,
              width: 4,
              height: 4.5,
            },
          ],
        },
        {
          letter: 'O',
          bg: pink,
          rotateSpeed: 0.3,
          leaveOffset: 48 * 15 + 16,
          throbAt: 48 + 24,
          script: [
            {
              bean: 60,
              x: 16,
              y: 4.5,
              width: 0,
              height: 4.5,
            },
            {
              bean: 72,
              x: 10.67,
              y: 4.5,
              width: 5.33,
              height: 4.5,
            },
            {
              bean: 81 + 6,
              x: 8,
              y: 4.5,
              width: 4,
              height: 4.5,
            }
          ],
        },
        {
          letter: 'N',
          bg: green,
          rotateSpeed: 1.1,
          leaveOffset: 48 * 15 + 5,
          throbAt: 48 + 24,
          script: [
            {
              bean: 72,
              x: 16,
              y: 4.5,
              width: 0,
              height: 4.5,
            },
            {
              bean: 81 + 6,
              x: 12,
              y: 4.5,
              width: 4,
              height: 4.5,
            }
          ],
        }
      ];

      for(let letter of this.letters) {
        letter.throb = 0;
      }
    }

    update(frame) {
      this.frame = frame;
      if(frame == 1752) {
        for(let letter of this.letters) {
          letter.throb = 0;
        }
      }
      for(let letter of this.letters) {
        letter.throb *= 0.999;
      }

      this.throb *= .95;
      if(BEAT && frame < 2002) {
        switch(BEAN % 96) {
        case 0:
        case 9:
        case 24:
        case 24 + 9:
        case 24 + 18:
        case 48 + 12:
        case 48 + 24:
          this.throb = 1;
          this.cameraDX = (Math.random() - 0.5) * 1.0;
          this.cameraDY = (Math.random() - 0.5) * 1.0;
          this.cameraDR = (Math.random() - 0.5) * 0.1;
        }
      }

      demo.nm.nodes.bloom.opacity = this.throb * 0.25;

      this.cameraDDX = -this.cameraX * 0.1;
      this.cameraDDY = -this.cameraY * 0.1;
      this.cameraDDR = -this.cameraR * 0.1;
      this.cameraDX += this.cameraDDX;
      this.cameraDY += this.cameraDDY;
      this.cameraDR += this.cameraDDR;
      this.cameraDX *= 0.75;
      this.cameraDY *= 0.75;
      this.cameraDR *= 0.75;
      this.cameraX += this.cameraDX;
      this.cameraY += this.cameraDY;
      this.cameraR += this.cameraDR;
    }

    render() {
      const startBean = 14 * 12 * 4;
      const frame = this.frame;
      this.canvas.width += 0;
      if(frame < 2002) {
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      } else if(frame < 2253) {
        this.ctx.drawImage(this.greybg, 0, 0);
      }

      this.ctx.save();
      this.ctx.scale(GU, GU);

      this.ctx.translate(8, 4.5);
      this.ctx.rotate(this.cameraR);
      this.ctx.translate(-8, -4.5);
      this.ctx.translate(this.cameraX, this.cameraY);

      let letterIndex = -1;
      for (const letter of this.letters) {
        letterIndex++;
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

        if (BEAN < 16 * 12 * 4) {
          this.ctx.save();
          const juicyT = Math.pow(easeOut(0, 1, t), 0.5) * 0.9 + lerp(0, 1, t) * 0.1;
          this.ctx.translate(
            lerp(previous.x, target.x, juicyT),
            lerp(previous.y, target.y, juicyT)
          );
          this.ctx.scale(
            lerp(previous.width, target.width, juicyT),
            lerp(previous.height, target.height, juicyT)
          );
        } else {
          const startFrame = FRAME_FOR_BEAN(16 * 12 * 4) + letter.leaveOffset;
          const endFrame = FRAME_FOR_BEAN(16 * 12 * 4 + 12) + letter.leaveOffset;
          const t = (frame - startFrame) / (endFrame - startFrame);
          this.ctx.save();
          this.ctx.translate(
            easeIn(previous.x, previous.x, t),
            easeIn(previous.y, previous.y + 12, t)
          );
          this.ctx.scale(4, 4.5);
          this.ctx.translate(.5, .5);
          this.ctx.rotate(easeIn(0, 1, t * letter.rotateSpeed));
          this.ctx.translate(-.5, -.5);
        }
        this.ctx.fillStyle = letter.bg;
        /*
        this.ctx.fillRect(
          0,
          0,
          1,
          1
        );
        */
        this.ctx.font = 'bold 0.5pt arial';
        this.ctx.textAlign = 'center';
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.lineWidth = .05;
        /*
        this.ctx.strokeText(
          letter.letter,
          0.5,
          0.75
        );
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(
          letter.letter,
          0.5,
          0.75
        );
        */
        const scale = 1 / 640 * 4;
        this.ctx.scale(scale, scale);
        if(BEAT && BEAN - startBean == letter.throbAt) {
          letter.throb = 1; 
        }
        this.ctx.globalAlpha = 0.2 + 0.8 * letter.throb;
        this.ctx.globalAlpha = 1;
        if(frame >= 1940) {
          this.ctx.globalAlpha = 1;
        }
        this.ctx.drawImage(this.testo,
            (letterIndex % 4) * 1920 / 4,
            (letterIndex / 4 | 0) * 1080 / 2,
            1920 / 4, 1080 / 2,
            0, 0, 1920 / 12, 1920 / 12);
        this.ctx.restore();
      }

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }
  }

  global.text = text;
})(this);
