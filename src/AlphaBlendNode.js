(function (global) {
  class AlphaBlendNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = options.inputs || {};
      options.inputs.under = new NIN.TextureInput();
      options.inputs.over = new NIN.TextureInput();
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.under.value = this.inputs.under.getValue();
      this.uniforms.over.value = this.inputs.over.getValue();
    }
  }

  global.AlphaBlendNode = AlphaBlendNode;
})(this);
