(function(global) {
  class griddymidNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);

      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      });
      this.resize();
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.griddymidNode = griddymidNode;
})(this);
