(function(global) {
  class GodsOrKingsNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.GodsOrKingsNode = GodsOrKingsNode;
})(this);
