(function(global) {
  class atarifxNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = options.inputs || {};
      options.inputs.tDiffuse = new NIN.TextureInput();
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      demo.nm.nodes.bloom.opacity = 0.5;
    }
  }

  global.atarifxNode = atarifxNode;
})(this);
