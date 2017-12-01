(function(global) {
  class carouselNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        overlay: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      const t = (frame - FRAME_FOR_BEAN(4 * 12 * 30)) / 60;
      this.uniforms.t.value = frame / 60;
      this.uniforms.divisions.value = 6;
      this.uniforms.foregroundColor.value = new THREE.Color(0x2bbc80);
      this.uniforms.backgroundColor.value = new THREE.Color(0x097a52);
      this.uniforms.radiusMultiplier.value = easeIn(0, 5, t * 0.05);
      this.uniforms.origo.value = new THREE.Vector2(easeOut(0, 0.5, t / 8),
                                                    easeOut(0, 0.5, t / 3));
      this.uniforms.overlay.value = this.inputs.overlay.getValue();
    }
  }

  global.carouselNode = carouselNode;
})(this);
