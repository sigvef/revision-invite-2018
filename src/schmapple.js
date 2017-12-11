(function (global) {

  const TEXT_IMAGE_HEIGHT = 64;
  const CANVAS_SCALER = 0.05;

  const beanOffset = 48 * 4;

  class schmapple extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
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

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.CanvasTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;

      this.revisionLogoInner = document.createElement('img');
      this.revisionLogoOuter = document.createElement('img');
      this.revisionLogoMiddle = document.createElement('img');
      Loader.load('res/revision_logo_inner.png', this.revisionLogoInner, () => { });
      Loader.load('res/revision_logo_outer.png', this.revisionLogoOuter, () => { });
      Loader.load('res/revision_logo_middle.png', this.revisionLogoMiddle, () => { });

      this.kickThrob = 0;

      this.texts = [[
        { text: 'Even longer toilet tunnel' },
        { text: 'Dangerously hot campfire' },
        { text: 'Pretzelbuz' },
        { text: 'Rave parties' },
        { text: 'Free coffee!' },
        { text: 'Just revision.' },
      ], [
        { text: 'Even longer toilet tunnel' },
        { text: 'Dangerously hot campfire' },
        { text: 'Pretzelbuz' },
        { text: 'Rave parties' },
        { text: 'Free coffee!' },
        { text: 'Just revision.' },
      ], [
        { text: 'Even longer toilet tunnel' },
        { text: 'Dangerously hot campfire' },
        { text: 'Pretzelbuz' },
        { text: 'Rave parties' },
        { text: 'Free coffee!' },
        { text: 'Just revision.' },
      ], [
        { text: 'Even longer toilet tunnel' },
        { text: 'Dangerously hot campfire' },
        { text: 'Pretzelbuz' },
        { text: 'Rave parties' },
        { text: 'Free coffee!' },
        { text: 'Just revision.' },
      ], [
        { text: 'Even longer toilet tunnel' },
        { text: 'Dangerously hot campfire' },
        { text: 'Pretzelbuz' },
        { text: 'Rave parties' },
        { text: 'Free coffee!' },
        { text: 'Just revision.' },
      ], [
        { text: 'Even longer toilet tunnel' },
        { text: 'Dangerously hot campfire' },
        { text: 'Pretzelbuz' },
        { text: 'Rave parties' },
        { text: 'Free coffee!' },
        { text: 'Just revision.' },
      ], [
        { text: 'Even longer toilet tunnel' },
        { text: 'Dangerously hot campfire' },
        { text: 'Pretzelbuz' },
        { text: 'Rave parties' },
        { text: 'Free coffee!' },
        { text: 'Just revision.' },
      ], [
        { text: 'Even longer toilet tunnel' },
        { text: 'Dangerously hot campfire' },
        { text: 'Pretzelbuz' },
        { text: 'Rave parties' },
        { text: 'Free coffee!' },
        { text: 'Just revision.' },
      ], [
        { text: 'Even longer toilet tunnel' },
        { text: 'Dangerously hot campfire' },
        { text: 'Pretzelbuz' },
        { text: 'Rave parties' },
        { text: 'Free coffee!' },
        { text: 'Just revision.' },
      ],
      ];

      this.random = new Random(1337);

      for (let i = 0; i < this.texts.length; i++) {
        const row = this.texts[i];
        row.offset = this.random() * 20;
        row.speed = 0.1 + Math.pow(this.random(), 4) * 2;
        row.speed *= 0.5;
        row.blinkOffset = i;

        let accumulatedWidth = 0;
        for (let sentence of row) {
          sentence.throb = 0;

          const colorCanvas = document.createElement('canvas');
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const colorCtx = colorCanvas.getContext('2d');
          ctx.font = '40pt brandontext';
          const measurement = ctx.measureText(sentence.text);
          canvas.width = measurement.width;
          canvas.height = TEXT_IMAGE_HEIGHT;
          colorCanvas.width = measurement.width;
          colorCanvas.height = TEXT_IMAGE_HEIGHT;
          colorCtx.font = ctx.font = '40pt brandontext';
          colorCtx.textBaseline = ctx.textBaseline = 'middle';
          colorCtx.textAlign = ctx.textAlign = 'center';
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          colorCtx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.translate(canvas.width / 2, canvas.height / 2);
          colorCtx.translate(canvas.width / 2, canvas.height / 2);
          // For future reference
          // const whiteColor = 0xffffff;
          // const grayColor = 0x373c3f;
          // const greenColor = 0x77e15d;
          // const pinkColor = 0xff4982;
          ctx.fillStyle = 'white';
          //colorCtx.fillStyle = '#ff4982';
          colorCtx.fillStyle = '#77e15d';
          ctx.fillText(sentence.text, 0, 0);
          colorCtx.fillText(sentence.text, 0, 0);
          sentence.canvas = canvas;
          sentence.colorCanvas = colorCanvas;
          accumulatedWidth += canvas.width;
        }
        row.widthWithoutPadding = accumulatedWidth * CANVAS_SCALER;
        row.padding = 5;
        const widthWithPadding = row.widthWithoutPadding + row.length * row.padding;
        row.width = widthWithPadding;
      }
      this.stabThrob = 0;
      this.cumulativeStabThrob = 0;
    }

    update(frame) {
      this.frame = frame;

      this.throb *= 0.9;
      if(BEAT) {
        switch(BEAN) {
        case 648:
        case 648 + 6:
        case 648 + 12:
        case 648 + 18:
          this.throb = 1;
          this.cameraDX = (Math.random() - 0.5) * 5.0;
          this.cameraDY = (Math.random() - 0.5) * 5.0;
          this.cameraDR = (Math.random() - 0.5) * 0.1;
        }
      }

      if(BEAN >= 648) {
        this.cameraX += (Math.random() - 0.5) * 2;
        this.cameraY += (Math.random() - 0.5) * 2;
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

      this.stabThrob *= 0.95;
      if(BEAT) {
        switch(BEAN - 528) {
        case 0:
        case 9:
        case 24:
        case 24 + 9:
        case 24 + 9 + 9:
          this.stabThrob = 1;
        }
      }
      this.cumulativeStabThrob += this.stabThrob;

      for (let row of this.texts) {
        row.offset = (row.offset + row.speed) % row.width;
        for (let sentence of row) {
          sentence.throb *= 0.98;
        }
      }
      this.kickThrob *= 0.95;
      if (BEAT && BEAN % 12 == 0) {
        this.kickThrob = 1;
      }

      if (BEAT && BEAN % 24 == 12) {
        for (let row of this.texts) {
          row.blinkOffset++;
          for (let i = 0; i < row.length; i++) {
            if ((i + row.blinkOffset) % 3 == 0) {
              const sentence = row[i];
              sentence.throb = 1;
            }
          }
        }
      }
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
      this.ctx.scale(GU / 10, GU / 10);
    }

    render() {
      demo.nm.nodes.bloom.opacity = 0.1;
      this.ctx.fillStyle = '#111';
      this.ctx.fillStyle = '#373c3f';
      this.ctx.save();
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.restore();
      this.ctx.save();
      const shakeT = lerp(0, 1, (this.frame - FRAME_FOR_BEAN(624)) / (
        FRAME_FOR_BEAN(624 + 48 - 24) - FRAME_FOR_BEAN(624)));
      const amount = 2 * easeOut(0, 1, shakeT) * easeIn(1, 0, shakeT);
      this.ctx.translate(
        (Math.random() - 0.5) * amount,
        (Math.random() - 0.5) * amount);
      const alphaMultiplier = Math.max(0.0, Math.min(1.0, (this.frame - 1126) / (1627 - 1126)));
      if (BEAN < 612) {
        this.ctx.globalAlpha = smoothstep(1, 0,
            (this.frame - FRAME_FOR_BEAN(600)) / (
              FRAME_FOR_BEAN(612) - FRAME_FOR_BEAN(600)));
        for (let i = 0; i < this.texts.length; i++) {
          const row = this.texts[i];
          this.ctx.save();
          this.ctx.translate(-row.offset, 0);
          let sentenceOffset = 0;
          for (let j = 0; j < row.length * 2; j++) {
            this.ctx.save();
            const sentence = row[j % row.length];
            this.ctx.globalAlpha *= alphaMultiplier * (0.2 + sentence.throb * 0.8);
            const half = (sentence.canvas.width * CANVAS_SCALER + row.padding) / 2;
            sentenceOffset += half;
            const scale = (1 + sentence.throb * 0.2);
            this.ctx.translate(sentenceOffset, 6 + 10 * i);
            this.ctx.scale(scale, scale);
            this.ctx.scale(CANVAS_SCALER, CANVAS_SCALER);
            this.ctx.drawImage(
              sentence.canvas,
              -sentence.canvas.width / 2,
              -sentence.canvas.height / 2);
            this.ctx.globalAlpha *= alphaMultiplier * sentence.throb;
            this.ctx.drawImage(
              sentence.colorCanvas,
              -sentence.colorCanvas.width / 2,
              -sentence.colorCanvas.height / 2);
            sentenceOffset += half;
            this.ctx.restore();
          }
          this.ctx.restore();
        }
      }

      if (BEAN >= 420 + beanOffset) {
        this.ctx.save();
        let scaler = 65 / this.revisionLogoOuter.width;
        this.ctx.translate(160 / 2, 90 / 2);
        this.ctx.scale(scaler, scaler);
        this.ctx.rotate(this.frame / 170);
        this.ctx.drawImage(this.revisionLogoOuter, -this.revisionLogoOuter.width / 2, -this.revisionLogoOuter.height / 2);
        this.ctx.restore();

        scaler = 65 / this.revisionLogoInner.width;
        this.ctx.save();
        this.ctx.translate(160 / 2, 90 / 2);
        this.ctx.scale(scaler, scaler);
        this.ctx.rotate(-this.frame / 160);
        this.ctx.drawImage(this.revisionLogoInner, -this.revisionLogoInner.width / 2, -this.revisionLogoInner.height / 2);
        this.ctx.restore();

        scaler = 65 / this.revisionLogoMiddle.width;
        this.ctx.save();
        this.ctx.translate(160 / 2, 90 / 2);
        this.ctx.scale(scaler, scaler);
        this.ctx.rotate(-this.frame / 160);
        this.ctx.drawImage(this.revisionLogoMiddle, -this.revisionLogoMiddle.width / 2, -this.revisionLogoMiddle.height / 2);
        this.ctx.restore();
      }

      this.ctx.fillStyle = 'white';
      //this.ctx.fillStyle = '#77e15d';
      this.ctx.beginPath();

      let widthT = (this.frame - FRAME_FOR_BEAN(420 + beanOffset)) / (FRAME_FOR_BEAN(420 + 9 + beanOffset) - FRAME_FOR_BEAN(420 + beanOffset));
      let widthT2 = (this.frame - FRAME_FOR_BEAN(420 + 6 + beanOffset)) / (FRAME_FOR_BEAN(420 + 6 + 9 + beanOffset) - FRAME_FOR_BEAN(420 + 6 + beanOffset));
      let outerWidth = easeOut(31, 26, widthT);
      let innerWidth = easeOut(21, 26, widthT);
      let secondSmallestWidth = easeOut(17.6, 5, widthT2);
      let smallestWidth = easeOut(0, 5, widthT2);

      const openingT = (this.frame - FRAME_FOR_BEAN(240 + beanOffset)) / (FRAME_FOR_BEAN(240 + 24 + beanOffset) - FRAME_FOR_BEAN(240 + beanOffset));
      let openingT2 = (this.frame - FRAME_FOR_BEAN(420 + 24)) / (FRAME_FOR_BEAN(420 + 24 + 12) - FRAME_FOR_BEAN(420 + 24));
      outerWidth = elasticOut(0, outerWidth, 1, openingT);
      innerWidth = elasticOut(0, innerWidth, 1, openingT);
      secondSmallestWidth = elasticOut(0, secondSmallestWidth, 1, lerp(0, 1, openingT2));
      smallestWidth = elasticOut(0, smallestWidth, 1, lerp(0, 1, openingT2));

      const smallThrobT = (this.frame - FRAME_FOR_BEAN(240 + beanOffset)) / (FRAME_FOR_BEAN(240 + 48 + beanOffset) - FRAME_FOR_BEAN(240 + 24 + beanOffset));

      if (BEAN >= 420 + 24 && BEAN < 612) {
        secondSmallestWidth = easeOut(secondSmallestWidth * 2, 8, smallThrobT);
      }

      if (BEAN >= 420 + 24 && BEAN < 612) {
        secondSmallestWidth += this.kickThrob * 8;
      }

      if (BEAN < 624) {
        this.ctx.translate(160 / 2, 90 / 2);
        this.ctx.rotate(this.frame / 60 / 60 * 115 / 4 + 0.05 * this.cumulativeStabThrob);
        this.ctx.moveTo(outerWidth, 0);
        const amount = 200;
        for(let i = 0; i < amount; i++) {
          this.ctx.arc(0, 0, Math.max(0, 0.0001 + outerWidth + this.stabThrob * 3 * Math.sin(Math.PI * 2 * i / amount * 10)), Math.PI * 2 * i / amount, Math.PI * 2 * i / amount);
        }
        this.ctx.moveTo(innerWidth, 0);
        this.ctx.arc(0, 0, 0.0001 + innerWidth, 0, Math.PI * 2);
        this.ctx.moveTo(secondSmallestWidth, 0);
        this.ctx.arc(0, 0, 0.0001 + secondSmallestWidth, 0, Math.PI * 2);
        this.ctx.moveTo(smallestWidth, 0);
        this.ctx.arc(0, 0, 0.0001 + smallestWidth, 0, Math.PI * 2);

        this.ctx.globalAlpha = 1;
        this.ctx.fill('evenodd');
      }

      this.ctx.restore();
  
      this.ctx.save();

      if(BEAN >= 612 + 24) {
        this.ctx.fillStyle = '#77e15d';
        this.ctx.save();
        this.ctx.translate(80, 45);
        this.ctx.rotate(this.frame / 60);
        const scale = easeIn(0.01, 10,
            (this.frame - FRAME_FOR_BEAN(612 + 24)) / (
              FRAME_FOR_BEAN(648 + 6) - FRAME_FOR_BEAN(612 + 24)));
        this.ctx.scale(scale, scale);
        const originalRadius = 10;
        for(let i = 0; i < 10; i++) {
          let radius = originalRadius;
          const angle = i / 10 * Math.PI * 2;
          if(i % 2 == 0) {
            radius *= 2;
          }
          this.ctx.lineTo(
              radius * Math.cos(angle),
              radius * Math.sin(angle));
        }
        this.ctx.fill();
        this.ctx.restore();
      }

      if(BEAN >= 648) {
        this.ctx.save();
        this.ctx.fillStyle = '#77e15d';
        this.ctx.translate(80, 45);
        this.ctx.translate(0, 4);
        this.ctx.font = 'bold 20pt schmalibre';
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        let text = '';
        if(BEAN >= 648 + 18) {
          text = 'JUST';
        } else if(BEAN >= 648 + 12) {
          text = 'IT\'S';
        } else if(BEAN >= 648 + 6) {
          text = 'YEAR';
        } else {
          text = 'THIS';
        }
        this.ctx.translate(
          (Math.random() - 0.5) * amount,
          (Math.random() - 0.5) * amount);
        this.ctx.translate(this.cameraX, this.cameraY);
        this.ctx.rotate(this.cameraR);
        const scale = 1 + this.throb * 0.5;
        this.ctx.scale(scale, scale);
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillText(text, 2, 2);
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
      }
      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.schmapple = schmapple;
})(this);
