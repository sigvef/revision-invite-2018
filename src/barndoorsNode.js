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
      const startBean = 81 * 12 * 4;
      const endBean = 81 * 12 * 4 + 24;
      const startFrame = FRAME_FOR_BEAN(startBean);
      const endFrame = FRAME_FOR_BEAN(endBean);
      const t = (frame - startFrame) / (endFrame - startFrame);
      this.uniforms.openAmount.value = easeIn(1, 0, t);
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
    }
  }

  global.barndoorsNode = barndoorsNode;
})(this);
