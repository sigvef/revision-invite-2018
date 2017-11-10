(function (global) {
  class GridShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        image: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.tDiffuse.value = this.inputs.image.getValue();
      this.uniforms.frame.value = frame;
    }
  }

  global.GridShaderNode = GridShaderNode;
})(this);
