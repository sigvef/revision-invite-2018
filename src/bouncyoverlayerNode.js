(function(global) {

  function T(startBean, endBean, frame) {
    const startFrame = FRAME_FOR_BEAN(startBean);
    const endFrame = FRAME_FOR_BEAN(endBean);
    return (frame - startFrame) / (endFrame - startFrame);
  }

  class bouncyoverlayerNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = options.inputs || {};
      options.inputs.tDiffuse = new NIN.TextureInput();
      super(id, options);

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.canvasTexture = new THREE.CanvasTexture(this.canvas);
      this.canvasTexture.magFilter = THREE.LinearFilter;
      this.canvasTexture.minFilter = THREE.LinearFilter;

      this.textCanvas = document.createElement('canvas');
      this.textCtx = this.textCanvas.getContext('2d');

      document.fonts.load('bold 1pt schmalibre').then(() => {
        this.resize();
      });
    }

    resize() {
      super.resize();
      if(this.canvas) {
        this.canvas.width = 16 * GU;
        this.canvas.height = 9 * GU;
      }
      if(this.textCanvas) {
        this.textCanvas.width = 9 * GU;
        this.textCanvas.height = 2 * GU;
        this.textCtx.save();
        this.textCtx.scale(GU, GU);
        this.textCtx.translate(4.5, 1);
        this.textCtx.textAlign = 'center';
        this.textCtx.textBaseline = 'middle';
        this.textCtx.font = 'bold 0.9pt schmalibre';
        this.textCtx.fillStyle = 'white';
        this.textCtx.fillText('NO DEADLINES', 0, 0);
        this.textCtx.restore();
      }
    }

    update(frame) {
      this.frame = frame;
      this.uniforms.frame.value = frame;
      let t = Math.pow(T(62 * 48, 62 * 48 + 12, frame), 1.5);

      this.uniforms.translationOverX.value = easeIn(0.5, 0, t);
      this.uniforms.translationUnderX.value = easeIn(0, -0.15, t);

      if (BEAN >= 3024) {
        t = 1 - T(3024 + 12 - 2, 3024 + 12 - 2 + 10, frame);
        this.uniforms.translationOverX.value = easeIn(0.5, 0, t);
        this.uniforms.translationUnderX.value = easeIn(0, -0.15, t);
      }

      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
    }

    render(renderer) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const nudger = 0.5;

      if(BEAN < 3072) {
        this.ctx.save();
        this.ctx.scale(GU, GU);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(16 / 3 - nudger, 0);
        this.ctx.lineTo(16 / 3 + nudger, 9);
        this.ctx.lineTo(0, 9);
        this.ctx.lineTo(0, 0);
        this.ctx.fillStyle = 'rgb(55, 60, 63)';
        this.ctx.fillStyle = '#282b2d';
        this.ctx.fill();

        this.ctx.font = 'bold 1pt schmalibre';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.translate(16 / 3 - nudger, 9 / 2);
        this.ctx.rotate(Math.PI / 2 - 0.11);
        this.ctx.fillStyle = 'white';
        this.ctx.translate(-4.5, -.5);
        this.ctx.translate(0, 1.5);
        const bouncyScale = 1 + 0.1 * Math.cos(this.frame / 60 / 60 * 115 * Math.PI * 2);
        this.ctx.scale(1 / GU, 1 / GU * bouncyScale);
        this.ctx.translate(0, -1.5 * GU);
        const step = 4;
        for(let i  = 0; i < this.textCanvas.height; i+=step) {
          this.ctx.drawImage(
            this.textCanvas,
            0,
            i,
            this.textCanvas.width,
            step + 1,
            (1 - i / this.textCanvas.height) * 12 * Math.cos(this.frame / 60 / 60 * 115 * Math.PI),
            i,
            this.textCanvas.width,
            step + 1);
        }

        this.ctx.restore();
      }

      this.ctx.save();
      this.ctx.scale(GU, GU);
      this.ctx.translate(8, 0);
      this.ctx.font = 'bold 1pt schmalibre';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      if(BEAN >= 3072) {
        const t = T(3072, 3072 + 48, this.frame);
        const t2 = 0.5 + (t > 0.5 ? 1 : -1) * Math.pow(Math.abs(2 * t - 1), 10.6) / 2;
        this.uniforms.translationOverX.value = 0;
        this.ctx.fillStyle = 'black';
        this.ctx.fillText('NO SIZE LIMITS', lerp(16, -16, t2) - lerp(-3, 3, t), 4 / 5 * 9);
      }

      if(BEAN >= 3264 && BEAN < 3264 + 24 + 8) {
        this.ctx.fillStyle = 'black';
        this.ctx.font = 'bold 1.66pt schmalibre';
        this.ctx.fillText('WAIT, WHAT?', 0, 5.1);
      } else if(BEAN >= 3216 && BEAN < 3264 - 24) {
        this.uniforms.translationOverX.value = 0;
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('NO SUBMISSIONS', 0, 4.5);
      } else if(BEAN >= 3168 && BEAN < 3216 - 24) {
        this.uniforms.translationOverX.value = 0;
        this.ctx.fillStyle = 'white';
        this.ctx.fillText('NO LIVE CODING', 0, 4.5);
      }
      this.ctx.restore();

      this.canvasTexture.needsUpdate = true;
      this.uniforms.overlay.value = this.canvasTexture;
      super.render(renderer);
    }
  }

  global.bouncyoverlayerNode = bouncyoverlayerNode;
})(this);
