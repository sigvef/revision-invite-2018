(function(global) {
  class chromaTransitionNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
        chroma: new NIN.TextureInput(),
      };
      super(id, options);
    }

    warmup(renderer) {
      this.update(0);
      this.render(renderer);
    }

    update(frame) {
      this.uniforms.t.value = frame;
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
      this.uniforms.chroma.value = this.inputs.chroma.getValue();
    }
  }

  global.chromaTransitionNode = chromaTransitionNode;
})(this);
