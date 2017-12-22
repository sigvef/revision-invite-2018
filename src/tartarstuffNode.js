(function(global) {
  class tartarstuffNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    warmup(renderer) {
      this.update(10611);
      this.render(renderer);
    }

    update(frame) {
      this.uniforms.frame.value = frame * 4;
      this.uniforms.t.value = (frame - FRAME_FOR_BEAN(84 * 48 + 18)) / 60 * 10;
    }
  }

  global.tartarstuffNode = tartarstuffNode;
})(this);
