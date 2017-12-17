(function(global) {
  class lulleNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = options.inputs || {};
      options.inputs.bg = new NIN.TextureInput();
      super(id, options);
    }

    update(frame) { 
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.bg.getValue();
      this.uniforms.BEAN.value = BEAN;
      this.uniforms.BEAT.value = BEAT ? 1 : 0;
      demo.nm.nodes.bloom.opacity = 0.5;
    }
  }

  global.lulleNode = lulleNode;
})(this);
