(function(global) {
  class holeTransitionNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput()
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.t.value = frame;
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
    }
  }

  global.holeTransitionNode = holeTransitionNode;
})(this);
