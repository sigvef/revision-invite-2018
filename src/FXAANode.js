(function(global) {
  class FXAANode extends NIN.ShaderNode {
    constructor(id, options) {
      const optionsClone = Object.assign({}, options);
      optionsClone.inputs = {};
      optionsClone.inputs.tDiffuse = new NIN.TextureInput();
      optionsClone.shader = global.threeShaderFXAA();
      super(id, optionsClone);
    }

    resize() {
      super.resize();
      this.uniforms.resolution.value.x = 16 * GU;
      this.uniforms.resolution.value.y = 9 * GU;
    }

    warmup(renderer) {
      this.update(9896);
      this.render(renderer);
    }

    update(frame) {
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
    }
  }

  global.FXAANode = FXAANode;
})(this);
