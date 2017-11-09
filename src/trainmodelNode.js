(function(global) {
  class trainmodelNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
      this.snareThrob = 0;
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.snareThrob *= 0.97;
      if(BEAT && BEAN % 48 == 24) {
        this.snareThrob = 1;
      }
      this.uniforms.snareThrob.value = this.snareThrob;
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
