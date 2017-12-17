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
    }

    resize() {
      super.resize();
      if(this.canvas) {
        this.canvas.width = 16 * GU;
        this.canvas.height = 9 * GU;
      }
    }

    update(frame) {
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
      this.ctx.save();
      this.ctx.scale(GU, GU);

      const nudger = 0.5;

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
      this.ctx.fillText('NO TUNNELS', 0, 0);

      this.ctx.restore();
      this.canvasTexture.needsUpdate = true;
      this.uniforms.overlay.value = this.canvasTexture;
      super.render(renderer);
    }
  }

  global.bouncyoverlayerNode = bouncyoverlayerNode;
})(this);
