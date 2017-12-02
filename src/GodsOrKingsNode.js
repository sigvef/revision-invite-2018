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
    }
  }

  global.GodsOrKingsNode = GodsOrKingsNode;
})(this);
