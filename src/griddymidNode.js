(function(global) {
  class griddymidNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.shader = 'griddymid';
      super(id, options);

      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      });
      this.resize();
    }

    resize() {
      this.renderTarget.setSize(640 / 2, 360 / 2);
    }

    warmup(renderer) {
      this.update(5773);
      this.render(renderer);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.griddymidNode = griddymidNode;
})(this);
