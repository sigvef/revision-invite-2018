(function(global) {
  class justTransitionNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };
      super(id, options);

      this.textCanvas = document.createElement('canvas');
      this.textCtx = this.textCanvas.getContext('2d');
      this.textTexture = new THREE.CanvasTexture(this.textCanvas);
      this.textTexture.minFilter = THREE.NearestFilter;
      this.textTexture.magFilter = THREE.NearestFilter;
      this.resize();
    }

    resize() {
      super.resize();
      if(this.textCanvas) {
        this.textCanvas.width = 16 * GU;
        this.textCanvas.height = 9 * GU;
      }
    }

    update(frame) {
      const t = (frame - FRAME_FOR_BEAN(18 * 48)) / (FRAME_FOR_BEAN(18.25 * 48) - FRAME_FOR_BEAN(18 * 48));
      this.textCtx.save();
      this.textCtx.scale(GU, GU);
      this.textCtx.font = '1pt schmalibre';
      this.textCtx.textAlign = 'center';
      this.textCtx.textBaseline = 'middle';
      this.textCtx.fillStyle = '#ff0000';
      this.textCtx.fillRect(0, 0, 16, easeOut(-2, 9, t));
      this.textCtx.fillStyle = '#0000ff';
      this.textCtx.fillRect(0, easeOut(0, 11, t), 16, 9);
      this.textCtx.fillStyle = '#77e15d';
      this.textCtx.fillRect(0, easeOut(-2, 9, t), 16, 2);
      this.textCtx.fillStyle = 'white';
      this.textCtx.fillText('JUST', 8, easeOut(-0.6, 10.165, t));
      this.textCtx.restore();
      this.textTexture.needsUpdate = true;
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
      this.uniforms.text.value = this.textTexture;

      if (t == 1) {
        demo.nm.nodes.bloom.opacity = 0.5;
      }
    }
  }

  global.justTransitionNode = justTransitionNode;
})(this);
