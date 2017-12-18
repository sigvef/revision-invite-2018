(function(global) {
  class fallintransitionNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.t.value = easeIn(
        -1,
        easeOut(
          0,
          easeIn(
            -.12,
            easeOut(
              0,
              easeIn(-.06, 0, (frame - 6790) / 7),
              (frame - 6785) / 7
            ),
            (frame - 6775) / 10
          ),
          (frame - 6765) / 10
        ),
        (frame - 6745) / 20
      );
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();

      demo.nm.nodes.bloom.opacity = lerp(2, 0.25, (frame - 6745) / 20);
    }
  }

  global.fallintransitionNode = fallintransitionNode;
})(this);
