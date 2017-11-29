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

    update(frame) {
      const t = lerp(
        0,
        2,
        (frame - FRAME_FOR_BEAN(16 * 12 * 4)) / (FRAME_FOR_BEAN(17 * 12 * 4) - FRAME_FOR_BEAN(16 * 12 * 4))
      );
      this.uniforms.t.value = t;
      demo.nm.nodes.bloom.opacity = t * 2;
      demo.nm.nodes.bloom.opacity = 0.1;

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
