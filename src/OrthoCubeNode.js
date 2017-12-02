(function(global) {
  class OrthoCubeNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame + 200;
    }
  }

  global.OrthoCubeNode = OrthoCubeNode;
})(this);
