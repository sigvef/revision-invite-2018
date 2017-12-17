(function(global) {
  class revisionBars extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput(),
          cameraValues: new NIN.Output(),
        }
      });

      this.throb = 0;

      this.cameraX = 0;
      this.cameraY = 0;
      this.cameraR = 0;
      this.cameraDX = 0;
      this.cameraDY = 0;
      this.cameraDR = 0;
      this.cameraDDX = 0;
      this.cameraDDY = 0;
      this.cameraDDR = 0;
      this.cameraPreviousX = 0;
      this.cameraPreviousY = 0;

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;
      this.outputs.cameraValues.value = {
        cameraX: 0,
        cameraY: 0,
        cameraZoom: 0,
        cameraRotate: 0,
      };

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
          beanOffset: 9,
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
          beanOffset: 33,
        },
        {
          letter: 'S',
          x: 4,
          height: 4,
          beanOffset: 42,
        },
        {
          letter: 'I',
          x: 5,
          height: 5,
          beanOffset: 62,
        },
        {
          letter: 'O',
          x: 6,
          height: 4.5,
          beanOffset: 62,
        },
        {
          letter: 'N',
          x: 7,
          height: 3,
          beanOffset: 74,
        },
      ];

      for(let i = 0; i < this.textScript.length; i++) {
        const el = this.textScript[i];
        el.x -= 8;
      }

      this.easings = {
        lerp,
        smoothstep,
        easeIn,
        easeOut,
        step: (a, b, t) => (t >= 1 ? b : a),
      };

      this.cameraXPath = this.path([
        {bean: 1440, easing: 'step', value: 6.5},

        {bean: 1440 + 9 - 3, easing: 'step', value: 6.5},
        {bean: 1440 + 9, easing: 'easeIn', value: 5.5},

        {bean: 1440 + 24 - 3, easing: 'step', value: 5.5},
        {bean: 1440 + 24, easing: 'easeIn', value: 4.5},

        {bean: 1440 + 24 + 9 - 3, easing: 'step', value: 4.5},
        {bean: 1440 + 24 + 9, easing: 'easeIn', value: 3.5},

        {bean: 1440 + 24 + 18 - 3, easing: 'step', value: 3.5},
        {bean: 1440 + 24 + 18, easing: 'easeIn', value: 2.5},

        {bean: 1440 + 48 + 12 - 3, easing: 'step', value: 2.5},
        {bean: 1440 + 48 + 12, easing: 'easeIn', value: 1.5},

        {bean: 1440 + 48 + 24 + 24, easing: 'easeOut', value: 0},
      ]);
      this.cameraYPath = this.path([
        {bean: 1440, easing: 'step', value: 3.5},

        {bean: 1440 + 9 - 3, easing: 'step', value: 3.5},
        {bean: 1440 + 9, easing: 'easeIn', value: 2.5},

        {bean: 1440 + 24 - 3, easing: 'step', value: 2.5},
        {bean: 1440 + 24, easing: 'easeIn', value: 1.5},

        {bean: 1440 + 24 + 9 - 3, easing: 'step', value: 1.5},
        {bean: 1440 + 24 + 9, easing: 'easeIn', value: 0.5},

        {bean: 1440 + 24 + 18 - 3, easing: 'step', value: 0.5},
        {bean: 1440 + 24 + 18, easing: 'easeIn', value: -0.5},

        {bean: 1440 + 48 + 12 - 3, easing: 'step', value: -0.5},
        {bean: 1440 + 48 + 12, easing: 'easeIn', value: -1.5},

        {bean: 1440 + 48 + 24 + 24, easing: 'easeOut', value: 0},
      ]);
      this.cameraZoomPath = this.path([
        {bean: 1440 + 48 + 12, easing: 'step', value: 3},
        {bean: 1440 + 48 + 24 + 24, easing: 'easeOut', value: 1},
      ]);
      this.cameraRotatePath = this.path([
        {bean: 1440, easing: 'step', value: -0.1},

        {bean: 1440 + 9 - 3, easing: 'step', value: -0.1},
        {bean: 1440 + 9, easing: 'easeIn', value: 0.1},

        {bean: 1440 + 24 - 3, easing: 'step', value: 0.1},
        {bean: 1440 + 24, easing: 'easeIn', value: -0.1},

        {bean: 1440 + 24 + 9 - 3, easing: 'step', value: -0.1},
        {bean: 1440 + 24 + 9, easing: 'easeIn', value: 0.1},

        {bean: 1440 + 24 + 18 - 3, easing: 'step', value: 0.1},
        {bean: 1440 + 24 + 18, easing: 'easeIn', value: -0.1},

        {bean: 1440 + 48 + 12 - 3, easing: 'step', value: -0.1},
        {bean: 1440 + 48 + 12, easing: 'easeIn', value: 0.1},

        {bean: 1440 + 48 + 24 + 24, easing: 'easeOut', value: 0},
      ]);
      
    }

    path(points) {
      for(let i = 0; i < points.length; i++) {
        const point = points[i];
        point.frame = FRAME_FOR_BEAN(point.bean);
      }
      return points;
    }

    getPoint(path, frame) {
      let from = path[0];
      let to = path[0];
      for(let i = 0; i < path.length; i++) {
        const current = path[i];
        if(current.frame <= frame) {
          from = current; 
          if(path[i + 1]) {
            to = path[i + 1];
          } else {
            return to.value;
          }
        } else {
          break;
        }
      }
      return this.easings[to.easing](
        from.value,
        to.value,
        (frame - from.frame) / (to.frame - from.frame));
    }

    update(frame) {
      super.update(frame);
      this.frame = frame;

      this.throb *= .85;
      if(BEAT && BEAN <= 1536) {
        switch(BEAN % 96) {
        case 0:
        case 9:
        case 24:
        case 24 + 9:
        case 24 + 18:
        case 48 + 12:
        case 48 + 24:
          this.throb = 1;
          this.cameraDX = (this.outputs.cameraValues.value.cameraX -
            this.cameraPreviousX) * 0.5;
          this.cameraDY = (this.outputs.cameraValues.value.cameraY -
            this.cameraPreviousY) * 0.5;
        }
      }

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

      const cameraX = this.getPoint(this.cameraXPath, frame);
      const cameraY = this.getPoint(this.cameraYPath, frame);
      const cameraZoom = this.getPoint(this.cameraZoomPath, frame);
      const cameraRotate = this.getPoint(this.cameraRotatePath, frame);
      this.cameraPreviousX = this.outputs.cameraValues.value.cameraX;
      this.cameraPreviousY = this.outputs.cameraValues.value.cameraY;
      this.outputs.cameraValues.value.cameraX = cameraX + this.cameraX;
      this.outputs.cameraValues.value.cameraY = cameraY + this.cameraY;
      this.outputs.cameraValues.value.cameraZoom = cameraZoom;
      this.outputs.cameraValues.value.cameraRotate = cameraRotate + this.cameraR;
    }

    render() {
      const frame = this.frame;
      // This clears the canvas
      this.canvas.width += 0;

      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.translate(8, 4.5);

      const scale = this.outputs.cameraValues.value.cameraZoom;
      this.ctx.scale(scale, scale);
      this.ctx.rotate(this.outputs.cameraValues.value.cameraRotate);
      this.ctx.translate(this.outputs.cameraValues.value.cameraX,
        this.outputs.cameraValues.value.cameraY);

      let i = 0;
      for (const letter of this.textScript.slice().reverse()) {
        const t = (frame - FRAME_FOR_BEAN(30 * 12 * 4 + letter.beanOffset) + 5) / 10;
        i++;

        this.ctx.save();
        this.ctx.translate(
          0,
          easeIn(
            10 - elasticOut(0, 1.5 + i * 1, 1.2, t), 10,
            (frame - FRAME_FOR_BEAN(32 * 12 * 4)) / 20) - 4.5
        );
        this.ctx.fillStyle = 'rgba(119, 225, 93, 255)';
        this.ctx.fillStyle = 'rgb(255, 73, 130)';
        this.ctx.fillStyle = 'rgb(152, 209, 155)';
        this.ctx.beginPath();
        this.ctx.moveTo(letter.x, 0);
        this.ctx.lineTo(letter.x + 1, -1);
        this.ctx.lineTo(letter.x + 1, 11);
        this.ctx.lineTo(letter.x, 11);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgb(152, 209, 155)';
        this.ctx.moveTo(letter.x + 1, 1);
        this.ctx.lineTo(letter.x, 2);
        this.ctx.lineTo(letter.x, 10);
        this.ctx.lineTo(letter.x + 1, 10);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.moveTo(letter.x + 0.85, -0.85);
        this.ctx.lineTo(letter.x + 1, -1);
        this.ctx.lineTo(letter.x + 1, 10);
        this.ctx.lineTo(letter.x + 0.85, 10);
        this.ctx.fill();

        this.ctx.font = '0.6pt schmalibre';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = 'white';
        this.ctx.lineWidth = 0.2;
        this.ctx.translate(letter.x + 0.45, 0.35);
        this.ctx.fillStyle = 'rgba(119, 225, 93, 255)';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(letter.letter, 0, 0);
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

  global.revisionBars = revisionBars;
})(this);
