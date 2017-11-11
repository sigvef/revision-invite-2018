(function(global) {
  class barndoorsNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      const startFrame = FRAME_FOR_BEAN(79 * 12 * 4);
      const endFrame = FRAME_FOR_BEAN(80 * 12 * 4);
      const t = (frame - startFrame) / (endFrame - startFrame);
      this.uniforms.openAmount.value = lerp(1, 0, t);
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
    }
  }

  global.barndoorsNode = barndoorsNode;
})(this);
