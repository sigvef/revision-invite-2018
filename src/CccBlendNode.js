(function(global) {
  class CccBlendNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.CccBlendNode = CccBlendNode;
})(this);
