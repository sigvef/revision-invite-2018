(function(global) {
  class starNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
    }

    warmup(renderer) {
      this.update(1700);
      this.render(renderer);
    }

    update(frame) {
      this.uniforms.t.value = (frame - FRAME_FOR_BEAN(76 * 12 * 4)) / 60;
      this.uniforms.smallCircleRadius.value = frame / 500 % 0.2 + 0.1;
      this.uniforms.waveIndex.value = (frame / 3 | 0) % 10;
      this.uniforms.angle.value = frame / 240;
    }
  }

  global.starNode = starNode;
})(this);
