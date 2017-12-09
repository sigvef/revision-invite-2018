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

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          ctx.font = '40pt brandontext';
          const measurement = ctx.measureText(sentence.text);
          canvas.width = measurement.width;
          canvas.height = TEXT_IMAGE_HEIGHT;
          ctx.font = '40pt brandontext';
          ctx.textBaseline = 'middle';
          ctx.textAlign = 'center';
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.translate(canvas.width / 2, canvas.height / 2);
          // For future reference
          // const whiteColor = 0xffffff;
          // const grayColor = 0x373c3f;
          // const greenColor = 0x77e15d;
          // const pinkColor = 0xff4982;
          ctx.fillStyle = '#ff4982';
          ctx.fillText(sentence.text, 0, 0);
          sentence.canvas = canvas;
          accumulatedWidth += canvas.width;
        }
        row.widthWithoutPadding = accumulatedWidth * CANVAS_SCALER;
        row.padding = 5;
        const widthWithPadding = row.widthWithoutPadding + row.length * row.padding;
        row.width = widthWithPadding;
      }
    }

    update(frame) {
      this.frame = frame;

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
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      const alphaMultiplier = (this.frame - 1126) / (1627 - 1126);
      if(BEAN < 612) {
        for(let i = 0; i < this.texts.length; i++) {
          const row = this.texts[i];
          this.ctx.save();
          this.ctx.translate(-row.offset, 0);
          let sentenceOffset = 0;
          for (let j = 0; j < row.length * 2; j++) {
            this.ctx.save();
            const sentence = row[j % row.length];
            this.ctx.globalAlpha = alphaMultiplier * (0.2 + sentence.throb * 0.8);
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
      this.ctx.beginPath();

      const widthT = (this.frame - FRAME_FOR_BEAN(420 + beanOffset)) / (FRAME_FOR_BEAN(420 + 24 + beanOffset) - FRAME_FOR_BEAN(420 + beanOffset));
      let outerWidth = easeOut(31, 26, widthT);
      let innerWidth = easeOut(21, 26, widthT);
      let secondSmallestWidth = easeOut(17.6, 5, widthT);
      let smallestWidth = easeOut(0, 5, widthT);

      const openingT = (this.frame - FRAME_FOR_BEAN(240 + beanOffset)) / (FRAME_FOR_BEAN(240 + 24 + beanOffset) - FRAME_FOR_BEAN(240 + beanOffset));
      const openingT2 = (this.frame - FRAME_FOR_BEAN(240 + 3 + beanOffset)) / (FRAME_FOR_BEAN(240 + 3 + 24 + beanOffset) - FRAME_FOR_BEAN(240 + 3 + beanOffset));
      outerWidth = elasticOut(0, outerWidth, 1, openingT);
      innerWidth = elasticOut(0, innerWidth, 1, openingT);
      secondSmallestWidth = elasticOut(0, secondSmallestWidth, 1, openingT2);
      smallestWidth = elasticOut(0, smallestWidth, 1, openingT2);

      const smallThrobT = (this.frame - FRAME_FOR_BEAN(240 + beanOffset)) / (FRAME_FOR_BEAN(240 + 48 + beanOffset) - FRAME_FOR_BEAN(240 + 24 + beanOffset));

      if (BEAN < 612) {
        secondSmallestWidth = easeOut(secondSmallestWidth * 2, 8, smallThrobT);
      }

      if (BEAN >= 240 + 24 + beanOffset && BEAN < 612) {
        secondSmallestWidth += this.kickThrob * 8;
      }

      if (BEAN < 624) {
        this.ctx.translate(160 / 2, 90 / 2);
        this.ctx.moveTo(outerWidth, 0);
        this.ctx.arc(0, 0, outerWidth, 0, Math.PI * 2);
        this.ctx.moveTo(innerWidth, 0);
        this.ctx.arc(0, 0, innerWidth, 0, Math.PI * 2);
        this.ctx.moveTo(secondSmallestWidth, 0);
        this.ctx.arc(0, 0, secondSmallestWidth, 0, Math.PI * 2);
        this.ctx.moveTo(smallestWidth, 0);
        this.ctx.arc(0, 0, smallestWidth, 0, Math.PI * 2);
        this.ctx.fill('evenodd');
      }

      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.schmapple = schmapple;
})(this);
