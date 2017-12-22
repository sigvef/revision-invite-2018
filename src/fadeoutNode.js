(function(global) {
  class fadeoutNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
      };
      super(id, options);
    }

    warmup(renderer) {
      this.update(11694);
      this.render(renderer);
    }

    update(frame) {
      this.uniforms.t.value = clamp(0, (frame - FRAME_FOR_BEAN(94 * 12 * 4 + 24)) / 50, 1);
      this.uniforms.A.value = this.inputs.A.getValue();
    }
  }

  global.fadeoutNode = fadeoutNode;
})(this);
