(function(global) {
  class carouselNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        overlay: new NIN.TextureInput(),
        overlay2: new NIN.TextureInput(),
        nextScene: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      const t = (frame - FRAME_FOR_BEAN(4 * 12 * 30)) / 60;
      this.uniforms.t.value = frame / 60;
      this.uniforms.divisions.value = 6;
      this.uniforms.foregroundColor.value = new THREE.Color(0xff4982);
      this.uniforms.foregroundColor2.value = new THREE.Color(204 / 255, 38 / 255, 90 / 255);
      this.uniforms.backgroundColor.value = new THREE.Color(0x373c3f);
      this.uniforms.radiusMultiplier.value = easeIn(0, 50, t * 0.05);
      //this.uniforms.thirdColor.value = new THREE.Color(171 / 255, 12 / 255, 62 / 255);
      this.uniforms.thirdColor.value = new THREE.Color(204 / 255, 38 / 255, 90 / 255);
      this.uniforms.thirdColorRadius.value = (frame - FRAME_FOR_BEAN(32 * 48)) / (FRAME_FOR_BEAN(34 * 48) - FRAME_FOR_BEAN(32 * 48));
      this.uniforms.origo.value = new THREE.Vector2(easeOut(0, 0.5, t / 8),
                                                    easeOut(0, 0.5, t / 3));
      this.uniforms.overlay.value = this.inputs.overlay.getValue();
      this.uniforms.overlay2.value = this.inputs.overlay2.getValue();
      this.uniforms.nextScene.value = this.inputs.nextScene.getValue();
    }
  }

  global.carouselNode = carouselNode;
})(this);
