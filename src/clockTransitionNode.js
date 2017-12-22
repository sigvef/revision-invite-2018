(function (global) {
  class clockTransitionNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput()
      };
      super(id, options);
    }

    beforeUpdate(frame) {
      const startClock = 3662;
      const endExpand = 3756;
      this.inputs.A.enabled = frame < endExpand;
      this.inputs.B.enabled = frame > startClock;
    }

    warmup(renderer) {
      this.update(0);
      this.render(renderer);
    }

    update(frame) {
      this.uniforms.t.value = frame;
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
    }
  }

  global.clockTransitionNode = clockTransitionNode;
})(this);
