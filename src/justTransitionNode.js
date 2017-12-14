(function(global) {
  class justTransitionNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };
      super(id, options);

      this.textCanvas = document.createElement('canvas');
      this.textCanvas.width = 16 * GU;
      this.textCanvas.height = 9 * GU;
      this.textCtx = this.textCanvas.getContext('2d');
      this.textTexture = new THREE.CanvasTexture(this.textCanvas);
      this.textTexture.minFilter = THREE.NearestFilter;
      this.textTexture.magFilter = THREE.NearestFilter;
    }

    update(frame) {
      const t = (frame - FRAME_FOR_BEAN(17.5 * 48)) / (FRAME_FOR_BEAN(18 * 48) - FRAME_FOR_BEAN(17.5 * 48));
      this.textCtx.font = `${GU * 2}px schmalibre`;
      this.textCtx.textAlign = 'center';
      this.textCtx.textBaseline = 'middle';
      this.textCtx.fillStyle = '#ff0000';
      this.textCtx.fillRect(0, 0, 16 * GU, lerp(-2 * GU, 9 * GU, t));
      this.textCtx.fillStyle = '#0000ff';
      this.textCtx.fillRect(0, lerp(0, 11 * GU, t), 16 * GU, 9 * GU);
      this.textCtx.fillStyle = '#77e15d';
      this.textCtx.fillRect(0, lerp(-2 * GU, 9 * GU, t), 16 * GU, 2 * GU);
      this.textCtx.fillStyle = 'white';
      this.textCtx.fillText('JUST', 8 * GU, lerp(-0.6 * GU, 10.165 * GU, t));
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
