(function(global) {
  class OrthoCubeNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.OrthoCubeNode = OrthoCubeNode;
})(this);
