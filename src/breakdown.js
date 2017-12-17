(function(global) {
  class breakdown extends NIN.Node {
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
      this.spikeDirection = -1;
      this.spikeAmount = 0;

      this.textThrob = 0;

      this.cameraX = 0;
      this.cameraY = 0;
      this.cameraR = 0;
      this.cameraDX = 0;
      this.cameraDY = 0;
      this.cameraDR = 0;
      this.cameraDDX = 0;
      this.cameraDDY = 0;
      this.cameraDDR = 0;
    }

    update(frame) {
      this.frame = frame;

      this.spikeAmount *= 0.75;

      this.textThrob *= 0.92;

      if(BEAT) {
        switch(BEAN) {
        case 3360:
        case 3360 + 9:
        case 3408:
        case 3408 + 9:
        case 3408 + 9 + 9:
        case 3456:
        case 3456 + 9:
        case 3498:
        case 3522:
        case 3546:
        case 3570:
          this.textThrob = 1;
          this.cameraDX = (Math.random() - 0.5) * 1.0;
          this.cameraDY = (Math.random() - 0.5) * 1.0;
          this.cameraDR = (Math.random() - 0.5) * 0.1;
        }
      }

      this.cameraDDX = -this.cameraX * 0.95;
      this.cameraDDY = -this.cameraY * 0.95;
      this.cameraDDR = -this.cameraR * 0.95;
      this.cameraDX += this.cameraDDX;
      this.cameraDY += this.cameraDDY;
      this.cameraDR += this.cameraDDR;
      this.cameraDX *= 0.7;
      this.cameraDY *= 0.7;
      this.cameraDR *= 0.7;
      this.cameraX += this.cameraDX;
      this.cameraY += this.cameraDY;
      this.cameraR += this.cameraDR;

      if(BEAT) {
        switch(BEAN % 24) {
        case 6:
        case 9:
        case 18:
          this.spikeDirection = -this.spikeDirection;
          this.spikeAmount = 1;
        }
      }

      this.spikeAmount = 0.5;
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    renderZoomer() {
      const fontYOffset = 0.3223;

      let t5 = (this.frame - FRAME_FOR_BEAN(3456 - 6 + 9)) / (
          FRAME_FOR_BEAN(3456 + 9) - FRAME_FOR_BEAN(3456 - 6 + 9));
      t5 = Math.pow(lerp(0, 1, t5), 2);

      const scale = easeIn(1, 100, t5);
      this.ctx.translate(easeIn(0, 70, t5), 0);
      this.ctx.scale(scale, scale);

      this.ctx.save();
      this.ctx.fillStyle = '#77e15d';
      this.ctx.fillRect(-8, -4.5, 16, 9);
      this.ctx.font = 'bold 2pt schmalibre';
      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = 'right';
      this.ctx.fillStyle = 'white';
      this.ctx.lineWidth = 0.2;
      this.ctx.fillStyle = 'rgb(55, 60, 63)';
      this.ctx.fillText('NO', -8 / 3 - 0.25 + 0.1, fontYOffset + 0.1);
      this.ctx.fillStyle = 'white';
      this.ctx.fillText('NO', -8 / 3 - 0.25, fontYOffset);

      this.ctx.fillStyle = 'rgb(55, 60, 63)';
      this.ctx.textAlign = 'left';

      let t = (this.frame - FRAME_FOR_BEAN(3408 - 6)) / (
          FRAME_FOR_BEAN(3408) - FRAME_FOR_BEAN(3408 - 6));
      t = Math.pow(lerp(0, 1, t), 2);

      let t2 = (this.frame - FRAME_FOR_BEAN(3408 - 6 + 9)) / (
          FRAME_FOR_BEAN(3408 + 9) - FRAME_FOR_BEAN(3408 - 6 + 9));
      t2 = Math.pow(lerp(0, 1, t2), 2);

      let t3 = (this.frame - FRAME_FOR_BEAN(3408 - 6 + 9 + 9)) / (
          FRAME_FOR_BEAN(3408 + 9 + 9) - FRAME_FOR_BEAN(3408 - 6 + 9 + 9));
      t3 = Math.pow(lerp(0, 1, t3), 2);

      let t4 = (this.frame - FRAME_FOR_BEAN(3456 - 6)) / (
          FRAME_FOR_BEAN(3456) - FRAME_FOR_BEAN(3456 - 6));
      t4 = Math.pow(lerp(0, 1, t4), 2);

      if(BEAN >= 3360 + 9) {
        this.ctx.fillText(
            'AMIGA',
            - 8 / 3 + 0.25,
            fontYOffset + easeIn(0, 10, t));
      }

      this.ctx.fillText(
          'C64',
          - 8 / 3 + 0.25,
          fontYOffset + easeIn(-10, 0, t) + easeIn(0, 10, t2));

      this.ctx.fillText(
          'ATARI',
          - 8 / 3 + 0.25,
          fontYOffset + easeIn(-10, 0, t2) + easeIn(0, 10, t3));

      this.ctx.fillText(
          '4k',
          - 8 / 3 + 0.25,
          fontYOffset + easeIn(-10, 0, t3) + easeIn(0, 10, t4));

      this.ctx.fillText(
          'PC',
          - 8 / 3 + 0.25,
          fontYOffset + easeIn(-10, 0, t4));

      this.ctx.restore();
    }

    renderBowties() {
      this.ctx.save();
      this.ctx.translate(-8, -4.5);
      this.ctx.fillStyle = '#28654b';
      this.ctx.fillRect(0, 0, GU, GU);
      this.ctx.fillStyle = '#212121';
      this.ctx.lineWidth = 0.05;
      this.ctx.beginPath();
      for(let i = 0; i < 20; i++) {
        for(let j = 0; j < 10; j++) {
          const x = i + (j % 2) * 0.5;
          const y = j;
          const r = 0.25 + Math.max(0, (i % 2) * 0.25 - (j % 2 == 0) * 0.25);
          this.ctx.save();
          this.ctx.translate(x, y);
          let angle = (this.frame / 10) % (Math.PI * 2);
          angle = (angle + (i ^ j) / 2) % (Math.PI * 2);
          if(angle > Math.PI) {
            angle = Math.PI * 2 - angle;
            this.ctx.rotate(Math.PI / 2);
          }
          this.ctx.moveTo(0, 0);
          this.ctx.lineTo(r * Math.cos(-angle / 2),
                          r * Math.sin(-angle / 2));
          this.ctx.arc(0, 0, r,
               - angle / 2,
               + angle / 2);
          this.ctx.lineTo(0, 0);
          this.ctx.lineTo(r * Math.cos(Math.PI - angle / 2),
                          r * Math.sin(Math.PI - angle / 2));
          this.ctx.arc(0, 0, r, Math.PI -angle / 2, Math.PI + angle / 2);
          this.ctx.lineTo(0, 0);
          this.ctx.restore();
        }
      }
      this.ctx.fill();
      this.ctx.restore();
    }

    renderSpikes() {
      const ctx = this.ctx;
      ctx.save();
      ctx.translate(-8, -4.5);
      ctx.fillStyle = '#3c0850';
      ctx.fillRect(0, 0, GU, GU);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.fillStyle = '#570079';
      const amount = this.spikeDirection > 0
                   ? (this.spikeAmount - 0.5) * 2
                   : (0.5 - this.spikeAmount) * 2;
      const yOffset = (this.frame / 4) % 2;
      ctx.translate(0, -yOffset);
      for(let j = 0; j < 20; j++) {
        for(let i = 0; i < 17; i++) {
          ctx.lineTo(j % 2 ? i : 16 - i,
              -2 +
              j + (i % 2)
              + amount / 2 * (j % 2 ? 1 : -1)
              );
        }
      }
      ctx.lineTo(0, 20);
      ctx.fill();
      ctx.lineWidth = 0.1;
      ctx.strokeStyle = '#221e1f';
      ctx.stroke();
      ctx.translate(0, yOffset);
      ctx.restore();
    }

    renderTriangalons() {
      this.ctx.save();
      this.ctx.translate(-8, -4.5);

      const startScale = 1;

      this.ctx.fillStyle = '#2c3876';
      this.ctx.fillRect(0, 0, GU, GU);
      this.ctx.fillStyle = '#3d4da4';
      const side = 1;
      const radius = Math.sqrt(3) / 6 * side;
      const height = Math.sqrt(3) / 2 * side;
      const topToCenter = height - radius;
      this.ctx.lineWidth = 0.05;
      this.ctx.strokeStyle = '#202856';
      for(let i = 0; i < 18; i++) {
        for(let j = 0; j < 12; j++) {
          this.ctx.save();
          this.ctx.translate(i + (j % 2) / 2, j * height);
          const innerRotation = Math.PI * 2 * this.frame / 60 / 60 * 115 + i - j / 4;
          const rotation =  2 * (innerRotation +
            1 * Math.sin(innerRotation)) / 4;
          this.ctx.rotate(rotation);
          let scale = 0.75 + 0.25 * Math.sin(rotation);
          scale *= startScale;
          this.ctx.scale(scale, scale);
          this.ctx.beginPath();
          this.ctx.moveTo(-side / 2, -radius);
          this.ctx.lineTo(side / 2, -radius);
          this.ctx.lineTo(0, topToCenter);
          this.ctx.lineTo(-side /2, -radius);
          /* a little extra line for the stroke edge to look good*/
          this.ctx.lineTo(side / 2, -radius);
          this.ctx.fill();
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
      this.ctx.restore();
    }


    renderCirclePanner() {
      this.ctx.save();
      this.ctx.translate(-8, -4.5);
      this.ctx.fillStyle = '#5d0420';
      this.ctx.fillRect(0, 0, 16, 9);
      this.ctx.fillStyle = '#b3335b';
      this.ctx.lineWidth = 0.1;
      const radius = 0.325;
      this.ctx.beginPath();
      for(let i = -2; i < 20; i++) {
        for(let j = -2; j < 20; j++) {
          const x = ((8 * -this.frame / 90 * 1.2) % 4) + 2 * i + (j % 2);
          const y = ((8 * this.frame / 160 * 1.2 * 2) % 2) + j;
          this.ctx.moveTo(x + radius, y);
          this.ctx.arc(
              x,
              y,
              radius,
              0,
              Math.PI * 2);
        }
      }
      this.ctx.fill();
      this.ctx.restore();
    }

    render() {
      this.ctx.fillStyle = '#373c3f';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.translate(8, 4.5);
      //this.ctx.rotate(this.cameraR);
      this.ctx.translate(this.cameraX, this.cameraY);


      const offset = 3480;
      let text = '';
      let cameraX = 0;
      let cameraY = 0;
      let cameraZoom = 1;
      let cameraRotate = 0;
      let textOffset = 0;
      let textOpacity = 1;
      let textColor = 'white';
      let textShadow = true;
      let textAlign = 'center';
      let textX = 0;
      if(BEAN >= 3648 + 16) {
        textColor = 'white';
        textShadow = false;
        textAlign = 'left';
        const originalText = 'JUST REVISION';
        const t = (this.frame - FRAME_FOR_BEAN(3660 - 2 + 6)) / (
            FRAME_FOR_BEAN(3660 - 2 + 6 + 3) - FRAME_FOR_BEAN(3660 - 2 + 6));
        text = originalText.slice(0, easeOut(0, originalText.length, t) | 0);
        textX = -5.4;
        cameraZoom = 1;
        cameraX = 0;
        cameraRotate = -0.05;
      } else if(BEAN >= 3648 + 10) {
        textColor = 'rgb(55, 60, 63)';
        textShadow = false;
        textAlign = 'left';
        const originalText = 'JUST REVIS';
        const t = (this.frame - FRAME_FOR_BEAN(3658 + 3)) / (
            FRAME_FOR_BEAN(3660 + 4) - FRAME_FOR_BEAN(3658 + 3));
        text = 'JUST REVIS'.slice(0, easeOut(originalText.length, 0, t));
        textOffset = -1.27;
        cameraZoom = 1.5;
        cameraX = 1.8;
        textX = -4;
        cameraRotate = 0.05;
      } else if(BEAN >= 3648 + 4) {
        textColor = 'rgb(55, 60, 63)';
        textShadow = false;
        text = 'JUST RE';
        textOffset = -2.452;
        cameraZoom = 2;
        cameraX = 4;
        cameraRotate = -0.1;
      } else if(BEAN >= 3648) {
        textColor = 'rgb(55, 60, 63)';
        textShadow = false;
        text = 'JUST';
        textOffset = -3.526;
        cameraZoom = 4;
        cameraX = 14;
        cameraRotate = 0.1;
      } else if(BEAN >= 3624) {
        textColor = '#373c3f';
        textShadow = false;
        text = 'JUST KIDDING!';
        textOffset = -0.02;
      } else if(BEAN >=  offset + 48 + 24 + 9 + 9) {
        text = 'NO PARTY';
        const t = (this.frame - FRAME_FOR_BEAN(3600)) /
          (FRAME_FOR_BEAN(3612) - FRAME_FOR_BEAN(3600));
        textOpacity = easeIn(1, 0, t);
      } else if(BEAN >=  offset + 48 + 24 + 9) {
        const t = (
          (this.frame - FRAME_FOR_BEAN(offset + 48 + 24 + 9 + 6)) /
          (FRAME_FOR_BEAN(offset + 48 + 24 + 9 + 9) - FRAME_FOR_BEAN(offset + 48 + 24 + 9 + 6)));
        text = 'NO';
        textOffset = -2.58;
        cameraX = easeIn(8, 0, t);
        cameraZoom = easeIn(3, 1, t);
        cameraRotate = easeIn(0.1, 0, t);
      } else if(BEAN >=  offset + 48 + 9 + 9 + 12) {
        text = '';
      } else if(BEAN >=  offset + 48 + 9 + 9) {
        text = 'NO MUSIC';
      } else if(BEAN >=  offset + 48 + 9) {
        const t = (
          (this.frame - FRAME_FOR_BEAN(offset + 48 + 9 + 6)) /
          (FRAME_FOR_BEAN(offset + 48 + 9 + 9) - FRAME_FOR_BEAN(offset + 48 + 9 + 6)));
        text = 'NO';
        textOffset = -2.451;
        cameraX = easeIn(7.5, 0, t);
        cameraZoom = easeIn(3, 1, t);
        cameraRotate = easeIn(-0.1, 0, t);
      } else if(BEAN >=  offset + 24 + 9 + 9 + 12) {
        text = '';
      } else if(BEAN >=  offset + 24 + 9 + 9) {
        text = 'NO VISITORS';
      } else if(BEAN >=  offset + 24 + 9) {
        const t = (
          (this.frame - FRAME_FOR_BEAN(offset + 24 + 9 + 6)) /
          (FRAME_FOR_BEAN(offset + 24 + 9 + 9) - FRAME_FOR_BEAN(offset + 24 + 9 + 6)));
        text = 'NO';
        textOffset = -3.493;
        cameraX = easeIn(10.5, 0, t);
        cameraZoom = easeIn(3, 1, t);
        cameraRotate = easeIn(0.1, 0, t);
      } else if(BEAN >= offset + 9 + 9 + 12) {
        text = '';
      } else if(BEAN >= offset + 9 + 9) {
        text = 'NO DEMOS';
      } else if(BEAN >= offset + 9) {
        const t = (
          (this.frame - FRAME_FOR_BEAN(offset + 9 + 6)) /
          (FRAME_FOR_BEAN(offset + 9 + 9) - FRAME_FOR_BEAN(offset + 9 + 6)));
        text = 'NO';
        textOffset = -2.7;
        cameraX = easeIn(8, 0, t);
        cameraZoom = easeIn(3, 1, t);
        cameraRotate = easeIn(-0.1, 0, t);
      }

      this.ctx.rotate(cameraRotate);
      this.ctx.translate(cameraX, cameraY);
      this.ctx.scale(cameraZoom, cameraZoom);

      if(BEAN >= 3624) {
        this.ctx.fillStyle = '#77e15d';
        this.ctx.fillRect(-8 * 2, -4.5 * 2, 16 * 2, 9 * 2); 

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        const width = 0.5;
        this.ctx.save();
        this.ctx.rotate(Math.PI / 8);
        const frameStart = 9501 - 5;
        for(let i = 0; i < 20; i++) {
          const height = easeOut(0, 20, (this.frame - frameStart - i * 1) / 20);
          let yOffset = 0;
          if(i % 2 == 0) {
            yOffset = 20 - height;
          }
          this.ctx.fillRect(
            -10 + i * width * 2, 
            -4.5 * 2 + yOffset,
            width,
            height);

        }
        this.ctx.restore();

      } else if(BEAN >=  offset + 48 + 24 + 6) {
        const t = easeIn(1, 0,
              (this.frame - FRAME_FOR_BEAN(3576)) /
              (FRAME_FOR_BEAN(3588) - FRAME_FOR_BEAN(3576)));
        this.ctx.globalAlpha = t;
        this.renderBowties();
        this.ctx.globalAlpha = 1;
      } else if(BEAN >=  offset + 48 + 6) {
        this.renderTriangalons();
      } else if(BEAN >= offset + 24 + 6) {
        this.renderSpikes();
      } else if(BEAN >= offset) {
        this.renderCirclePanner();
      } else {
        this.renderZoomer();
      }

      this.ctx.font = 'bold 1.25pt schmalibre';
      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = 'center';
      const shadowOffset = 0.08;
      const fontYOffset = 0.5123;
      this.ctx.save();

      if(BEAN >= 3660 - 2 + 6) {
        const t = (this.frame - FRAME_FOR_BEAN(3660 - 2 + 6)) / (
            FRAME_FOR_BEAN(3660 - 2 + 6 + 3) - FRAME_FOR_BEAN(3660 - 2 + 6));
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.moveTo(-5.8, 0.3);
        this.ctx.lineTo(-5.3, 0.9);
        this.ctx.lineTo(easeOut(-5.2, 5.4, t), 1.1);
        this.ctx.lineTo(easeOut(-5.2, 6.1, t), -0.35);
        this.ctx.lineTo(easeOut(-5.2, 5.5, t), -1.15);
        this.ctx.lineTo(-5.2 ,-0.9);
        this.ctx.fill();
      }

      this.ctx.translate(textOffset, fontYOffset);
      this.ctx.globalAlpha = textOpacity;
      this.ctx.textAlign = textAlign;
      this.ctx.translate(textX, 0);
      if(textShadow) {
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText(text, shadowOffset, shadowOffset);
      }
      this.ctx.fillStyle = textColor;
      this.ctx.fillText(text, 0, 0);
      this.ctx.restore();
      this.ctx.restore();

      this.ctx.save();
      this.ctx.scale(GU, GU);

      const t = (this.frame - FRAME_FOR_BEAN(3660 + 9)) / (
          FRAME_FOR_BEAN(3672) - FRAME_FOR_BEAN(3660 + 9));

      this.ctx.save();
      this.ctx.translate(
        easeIn(-16, 0, t),
        easeIn(-9 / 3 / 2, 0, t));
      this.ctx.fillStyle = '#82052c';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(16, 0);
      this.ctx.lineTo(16 + (9 / 3 / 2) * 16 / 9, 0);
      this.ctx.lineTo(16 / 3 / 2, 9);
      this.ctx.lineTo(0, 9);
      this.ctx.lineTo(0, 0);
      this.ctx.fill();
      this.ctx.restore();

      this.ctx.translate(
        easeIn(16, 0, t),
        0);
      this.ctx.fillStyle = '#500019';
      this.ctx.beginPath();
      this.ctx.moveTo(16, 9 / 3 / 2);
      this.ctx.lineTo(16, 9);
      this.ctx.lineTo(16 / 3 / 2, 9);
      this.ctx.lineTo(16, 9 / 3 / 2);
      this.ctx.fill();

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
      demo.nm.nodes.bloom.opacity = this.textThrob * 1.5;
    }
  }

  global.breakdown = breakdown;
})(this);
