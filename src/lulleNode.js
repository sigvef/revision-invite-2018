(function(global) {
  class lulleNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.lulleNode = lulleNode;
})(this);
