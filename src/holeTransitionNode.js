(function(global) {
  class holeTransitionNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput()
      };
      super(id, options);
    }

    beforeUpdate(frame) {
      this.inputs.A.enabled = true;
      this.inputs.B.enabled = BEAN >= 2948;
    }

    warmup(renderer) {
      this.update(4273);
      this.render(renderer);
    }

    update(frame) {
      this.uniforms.t.value = frame;
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
    }
  }

  global.holeTransitionNode = holeTransitionNode;
})(this);
