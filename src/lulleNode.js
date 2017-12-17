(function(global) {
  class lulleNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = options.inputs || {};
      options.inputs.bg = new NIN.TextureInput();
      super(id, options);
      this.balls = 0;
    }

    update(frame) { 
      const startBEAN = 1848;
      if (BEAN < startBEAN + 6) this.balls = 0;
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.bg.getValue();
      this.uniforms.BEAN.value = BEAN;
      this.uniforms.BEAT.value = BEAT ? 1 : 0;
      demo.nm.nodes.bloom.opacity = easeOut(10, 2.0, Math.pow((frame - FRAME_FOR_BEAN(1824)) / (
            FRAME_FOR_BEAN(1824 + 24) - FRAME_FOR_BEAN(1824)), 2));

      if (BEAT) { 
          switch (BEAN) {
            case startBEAN + 6:
            case startBEAN + 10:
            case startBEAN + 6 + 24:
            case startBEAN + 10 + 24:
            case startBEAN + 6 + 48:
            case startBEAN + 10 + 48:
            case startBEAN + 6 + 72:
            case startBEAN + 10 + 72:
            case startBEAN + 6 + 96:
            case startBEAN + 10 + 96:
            case startBEAN + 6 + 120:
            case startBEAN + 10 + 120:
            case startBEAN + 6 + 144:
            case startBEAN + 10 + 144:
            case startBEAN + 6 + 168:
            case startBEAN + 10 + 168:
            case startBEAN + 18:
            case startBEAN + 18 + 24:
            case startBEAN + 18 + 48:
            case startBEAN + 18 + 72:
            case startBEAN + 18 + 96:
            case startBEAN + 18 + 120:
            case startBEAN + 18 + 144:
            case startBEAN + 18 + 168:
                  this.balls += 1;
                  break;
            }
      }
      if(BEAN >= 2016) {
        this.balls = 9999;
      }
      this.uniforms.numOfBalls.value = this.balls;
    }
  }

  global.lulleNode = lulleNode;
})(this);
