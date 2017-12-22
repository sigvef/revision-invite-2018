(function(global) {
  class textoutNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };
      super(id, options);

      this.throb = 0;
    }

    beforeUpdate(frame) {
      this.inputs.A.enabled = BEAN < 24 * 12 * 4;
      this.inputs.B.enabled = BEAN >= 23 * 12 * 4;
    }

    update(frame) {
      const t = lerp(
        0,
        2,
        (frame - FRAME_FOR_BEAN(23 * 12 * 4)) / (FRAME_FOR_BEAN(24 * 12 * 4) - FRAME_FOR_BEAN(23 * 12 * 4))
      );

      this.throb *= .95;
      if(BEAT) {
        switch(BEAN % 96) {
        case 0:
        case 9:
        case 24:
        case 24 + 9:
        case 24 + 18:
        case 48 + 12:
        case 48 + 24:
          this.throb = 1;
        }
      }
      
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
    }
  }

  global.textoutNode = textoutNode;
})(this);
