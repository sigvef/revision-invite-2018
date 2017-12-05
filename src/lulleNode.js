(function(global) {
  class lulleNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    update(frame) { 
      this.uniforms.frame.value = frame;
      this.uniforms.BEAN.value = BEAN;
      this.uniforms.BEAT.value = BEAT ? 1 : 0;
    }
  }

  global.lulleNode = lulleNode;
})(this);
