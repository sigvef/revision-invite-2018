(function(global) {
  class metaballs extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        image: new NIN.TextureInput(),
        nextScene: new NIN.TextureInput(),
        ballpositions: new NIN.Input(),
      };
      super(id, options);
      this.uniforms.sphere1.value = new THREE.Vector3(0, 0, 0);
      this.uniforms.sphere2.value = new THREE.Vector3(0, 0, 0);
      this.uniforms.sphere3.value = new THREE.Vector3(0, 0, 0);
      this.uniforms.sphere4.value = new THREE.Vector3(0, 0, 0);
      this.uniforms.sphere5.value = new THREE.Vector3(0, 0, 0);
      this.uniforms.sphere6.value = new THREE.Vector3(0, 0, 0);
    }

    beforeUpdate(frame) {
      this.inputs.nextScene.enabled = frame > 5673;
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.image.getValue();
      this.uniforms.nextScene.value = this.inputs.nextScene.getValue();
      this.uniforms.sphere1.value = this.inputs.ballpositions.getValue()[0];
      this.uniforms.sphere2.value = this.inputs.ballpositions.getValue()[1];
      this.uniforms.sphere3.value = this.inputs.ballpositions.getValue()[2];
      this.uniforms.sphere4.value = this.inputs.ballpositions.getValue()[3];
      this.uniforms.sphere5.value = this.inputs.ballpositions.getValue()[4];
      this.uniforms.sphere6.value = this.inputs.ballpositions.getValue()[5];
    }
  }

  global.metaballs = metaballs;
})(this);
