(function(global) {
  class letterboxNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = options.inputs || {};
      options.inputs.image = new NIN.TextureInput();
      super(id, options);
    }

    update(frame) {
      super.update(frame);
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.image.getValue();
      const t = Math.pow(easeIn(0, 1, (frame - FRAME_FOR_BEAN(1920)) / (FRAME_FOR_BEAN(1944) - FRAME_FOR_BEAN(1920))), 4);
      console.log(t);
      this.uniforms.amount.value = t;
    }
  }

  global.letterboxNode = letterboxNode;
})(this);
