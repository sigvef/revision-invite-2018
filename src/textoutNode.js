(function(global) {
  class textoutNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      const t = lerp(
        0,
        1,
        (frame - FRAME_FOR_BEAN(16 * 12 * 4)) / (FRAME_FOR_BEAN(17 * 12 * 4) - FRAME_FOR_BEAN(16 * 12 * 4))
      );
      this.uniforms.t.value = t;
      demo.nm.nodes.bloom.opacity = t * 2;
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
    }
  }

  global.textoutNode = textoutNode;
})(this);
