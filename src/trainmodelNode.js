(function(global) {
  class trainmodelNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.trainmodelNode = trainmodelNode;
})(this);
