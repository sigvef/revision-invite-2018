(function(global) {
  class GodsOrKingsNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.A.value = this.inputs.A.getValue();
    }
  }

  global.GodsOrKingsNode = GodsOrKingsNode;
})(this);
