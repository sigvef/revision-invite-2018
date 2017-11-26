(function(global) {
  class logotransitionquadpassNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = options.inputs || {};
      options.inputs.scene = new NIN.TextureInput();
      options.inputs.logo = new NIN.TextureInput();
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.scene.value = this.inputs.scene.getValue();
      this.uniforms.logo.value = this.inputs.logo.getValue();
      this.uniforms.yOffset.value = 0;

      if(frame >= FRAME_FOR_BEAN(1812)) {
        this.uniforms.yOffset.value -= 0.5;
        this.uniforms.yOffset.value -= (frame - FRAME_FOR_BEAN(1812)) / 1000;
        this.uniforms.yOffset.value += 0.05 * (Math.random() - 0.5);
      }
      if(frame >= FRAME_FOR_BEAN(1812 + 6)) {
        this.uniforms.yOffset.value += 0.5;
        this.uniforms.yOffset.value += 0.05 * (Math.random() - 0.5);
      }
    }
  }

  global.logotransitionquadpassNode = logotransitionquadpassNode;
})(this);
