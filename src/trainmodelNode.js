(function(global) {
  class trainmodelNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }

    resize() {
      let width = 16 * GU;
      let height = 9 * GU;
      if(width >= 1601) {
        width /= 2;
        height /= 2;
      }
      this.renderTarget.setSize(width, height);
    }
  }

  global.trainmodelNode = trainmodelNode;
})(this);
