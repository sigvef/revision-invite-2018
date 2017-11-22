(function(global) {

  const paths = {
    boxes: {
      R: new Path2D('M279,318l-7,200L427,633,544,533l25-138L460,271Z'),
      V: new Path2D('M656,326L780,580l55-3,53-287-60-32Z'),
      E: new Path2D('M610,395L535,607l75,116,88-39,45-231Z'),
      I: new Path2D('M901,398L827,662l50,55,116-16,29-307Z'),
      S: new Path2D('M1031,531L994,745l67,77,98-12,81-161L1136,490Z'),
      i: new Path2D('M1164,437l109,251,74-31L1226,401Z'),
      O: new Path2D('M1267,395l27,102,60,7,42-139-53-38Z'),
      N: new Path2D('M1420,313l-79,271,26,49,162,60,153-89-74-311Z'),
    },
    letters: {
      R: new Path2D('M511,503l-96-64s25.311-15.395,26-39c0.722-24.719-15.743-36.4-29-41-18.876-6.552-42.207,2.351-46,4s-33,13-33,13l68,167,28-10-30-71,81,53ZM369,391l16,35s33.737-9.524,23-32C397.959,372.982,369,391,369,391Z'),
      E: new Path2D('M620,451L593,636l73,12,4-27-46-8,9-57,28,4,4-25-29-4,7-49,49,8,4-27Z'),
      V: new Path2D('M716,349l73,175,34-3,14-208-30,3-7,164L744,343Z'),
      I: new Path2D('M914,438l-2,24,24,2L918,636l-23-1-2,20,24,7,47-2,2-20-24-2,19-172,24,2,2-24Z'),
      S: new Path2D('M1163,581s-42.68-45.023-88-17c-35.77,22.122-24.29,78.642,16,105,38.86,25.419,39.91,52.234,23,64-23.47,14.322-55-6-55-6l-5,30s52.25,25.169,80,1c30.19-26.292,25.58-74.069-10-99-31.51-22.082-50.87-42.78-37-67,16.65-29.063,57,6,57,6Z'),
      i: new Path2D('M1224,511l64,142,22-10-64-142Zm-9-64a14,14,0,1,1-14,14A14,14,0,0,1,1215,447Z'),
      O: new Path2D('M1304,415c-1.1,14.374,1.48,42.05,25,43,21.18,0.856,32.69-19.565,34-37,1.49-19.873-6.93-39.362-25-40C1318.38,380.308,1305.31,397.9,1304,415Zm20,4c-0.69,6.98-.42,15.017,7,16,7.84,1.039,12.59-7.13,13-14,0.36-5.973-1.38-13.119-9-14C1328.44,406.242,1324.81,410.77,1324,419Z'),
      N: new Path2D('M1433,366l-62,223,33,9,42-147,62,180,28,7,70-227-34-10-50,163-62-191Z'),
      two: new Path2D('M368,789l13,13s26.925-33.839,45-20c14.169,10.849,1.092,33.632-6,44-6.923,10.121-55,65-55,65v23l88,1V896H384s43.868-45.682,54-62c5.6-9.014,27.1-45.544,2-66-18.457-15.042-44.049-2.86-51,2C382.289,774.692,368,789,368,789Z'),
      zero: new Path2D('M469,867c-0.363,22.425,16.543,48.437,40,49,23.01,0.552,48.2-24.3,35-57s-24.429-34.479-41-34C484.936,825.522,469.3,848.545,469,867Zm13,4c0.731,13.746,16.82,31.968,31,30s27.911-17.29,18-40c-8.563-19.622-18.417-24.28-29.627-21.775C484.635,842.965,481.348,858.732,482,871Z'),
      one: new Path2D('M546,772l1,10,26-4,2,144h15l-3-161-21,1Z'),
      eight: new Path2D('M653,761c-15.514.874-28.973,11.913-28,31s19,31,19,31-20.122,22.843-16,53,18.942,48.348,41,45,38.989-38.4,35-60c-4.5-24.388-29-43-29-43s16.172-16.412,13-33C684.65,767.479,670.434,760.018,653,761Zm-15,31c0.4,7.809,7.749,22.272,19,20a21.942,21.942,0,0,0,17-25c-1.946-11.5-11.915-14.857-21-14C643.878,773.86,637.457,781.449,638,792Zm4,79c1.154,15.458,11.969,36.016,24,35s28.2-22.469,25-43c-2.851-18.286-13.236-31.151-28-29S640.642,852.8,642,871Z'),
    }
  };

  const animations = {
    letterEntry: {
      R: {
        y: 1000,
        t: FRAME_FOR_BEAN(1860 - 96),
      },
      E: {
        y: -1000,
        t: FRAME_FOR_BEAN(1862 - 96),
      },
      V: {
        y: 1000,
        t: FRAME_FOR_BEAN(1864 - 96),
      },
      I: {
        y: -1000,
        t: FRAME_FOR_BEAN(1866 - 96),
      },
      S: {
        y: 1000,
        t: FRAME_FOR_BEAN(1868 - 96),
      },
      i: {
        y: -1000,
        t: FRAME_FOR_BEAN(1870 - 96),
      },
      O: {
        y: 1000,
        t: FRAME_FOR_BEAN(1871 - 96),
      },
      N: {
        y: -1000,
        t: FRAME_FOR_BEAN(1872 - 96),
      },
    },
    letters: {
      R: {
        x: 370,
        y: 100,
        scale: .55,
        rotation: 0.34,
        anchor: {
          x: 511 - 115,
          y: 503 - 60,
        }
      },
      E: {
        x: 210,
        y: 0,
        scale: .515,
        rotation: -0.16,
        anchor: {
          x: 620 + 15,
          y: 451 + 93,
        }
      },
      V: {
        x: 130,
        y: 125,
        scale: .49,
        rotation: 0.16,
        anchor: {
          x: 716 + 75,
          y: 349 + 70,
        }
      },
      I: {
        x: 50,
        y: 0,
        scale: .45,
        rotation: -.09,
        anchor: {
          x: 914 + 26,
          y: 438 + 110,
        }
      },
      S: {
        x: -50,
        y: -112,
        scale: .48,
        rotation: -0.08,
        anchor: {
          x: 1163 - 60,
          y: 581 + 80,
        }
      },
      i: {
        x: -140,
        y: 5,
        scale: .45,
        rotation: .424,
        anchor: {
          x: 1224 + 25,
          y: 511 + 30,
        }
      },
      O: {
        x: -160,
        y: 130,
        scale: 1.3,
        rotation: -.1,
        anchor: {
          x: 1304 + 30,
          y: 415 + 5,
        }
      },
      N: {
        x: -220,
        y: 50,
        scale: .43,
        rotation: -.271,
        anchor: {
          x: 1433 + 60,
          y: 366 + 130,
        }
      },
    }
  };

  class logotransition extends NIN.Node {
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
      demo.nm.nodes.bloom.opacity = 0.1;
    }

    render() {
      const t = (this.frame - 4695 + 10) / 10;
      const r = smoothstep(55, 255, t);
      const g = smoothstep(60, 73, t);
      const b = smoothstep(63, 130, t);
      this.ctx.fillStyle = `rgb(${r|0}, ${g|0}, ${b|0})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);
      const scale = 16 / 1920;
      this.ctx.scale(scale, scale);

      const cameraZoomScale = 1.5;
      this.ctx.translate(1920 / 2, 1080 / 2);
      if(this.frame >= FRAME_FOR_BEAN(1775) && this.frame < FRAME_FOR_BEAN(1785)) {
        this.ctx.rotate(-0.1);
        this.ctx.scale(cameraZoomScale, cameraZoomScale);
        this.ctx.translate(-100, 10);
      }
      if(this.frame >= FRAME_FOR_BEAN(1785) && this.frame < FRAME_FOR_BEAN(1800)) {
        this.ctx.rotate(0.1);
        this.ctx.scale(0.9, 0.9);
        this.ctx.translate(-20, 0);
      }
      this.ctx.translate(-1920 / 2, -1080 / 2);

      {
        const shake = easeIn(0, 10, t / 2 + 1);
        const angle = Math.random() * Math.PI * 2;
        const x = shake * Math.cos(angle);
        const y = shake * Math.sin(angle);
        this.ctx.translate(x, y);
      }

      this.ctx.fillStyle = '#00e04f';

      for(let item of ['boxes', 'letters']) {
        for(let letter of 'REVISiON') {
          this.ctx.save();
          const animation = animations.letters[letter];
          const letterEntry = animations.letterEntry[letter];
          let y = easeIn(letterEntry.y, animation.y, (this.frame - letterEntry.t + 20) / 20);
          const x = smoothstep(animation.x, 0, t);
          y = smoothstep(y, 0, t);
          const rotation = smoothstep(animation.rotation, 0, t);
          const scale = smoothstep(animation.scale, 1, t);
          this.ctx.translate(animation.anchor.x, animation.anchor.y);
          this.ctx.translate(x, y);
          this.ctx.rotate(rotation);
          this.ctx.scale(scale, scale);
          this.ctx.translate(-animation.anchor.x, -animation.anchor.y);
          if(item === 'boxes') {
            const r = 55;
            const g = 60;
            const b = 63;
            const a = smoothstep(0, 0.5, t);
            this.ctx.fillStyle = `rgba(0, 0, 0, ${a})`;
            const shadowOffset = 8 / scale;
            this.ctx.translate(shadowOffset, shadowOffset * 9 / 16);
            this.ctx.fill(paths.boxes[letter]);
            this.ctx.translate(-shadowOffset, -shadowOffset * 9 / 16);
            this.ctx.fillStyle = `rgb(${r | 0}, ${g | 0}, ${b | 0})`;
            this.ctx.fill(paths.boxes[letter]);
          } else if(item === 'letters') {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            const shadowOffset = 8 / scale;
            this.ctx.translate(shadowOffset, shadowOffset * 9 / 16);
            this.ctx.fill(paths.letters[letter], 'evenodd');
            const r = smoothstep(255, 255, t);
            const g = smoothstep(255, 255, t);
            const b = smoothstep(255, 255, t);
            this.ctx.translate(-shadowOffset, -shadowOffset * 9 / 16);
            this.ctx.fillStyle = `rgb(${r|0}, ${g|0}, ${b|0})`;
            this.ctx.fill(paths.letters[letter], 'evenodd');
          }

          this.ctx.restore();
        }
      }
      this.ctx.save();
      this.ctx.fillStyle = 'white';
      this.ctx.strokeStyle = 'rgb(255, 73, 130)';
      this.ctx.globalAlpha = smoothstep(0, 1, t);
      this.ctx.fill((paths.letters.two), 'evenodd');
      this.ctx.stroke((paths.letters.two));
      this.ctx.fill((paths.letters.zero), 'evenodd');
      this.ctx.stroke((paths.letters.zero));
      this.ctx.fill((paths.letters.one), 'evenodd');
      this.ctx.stroke((paths.letters.one));
      this.ctx.fill((paths.letters.eight), 'evenodd');
      this.ctx.stroke((paths.letters.eight));
      this.ctx.restore();

      this.ctx.restore();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.logotransition = logotransition;
})(this);
