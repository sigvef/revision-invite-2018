(function(global) {
  class trainmodelNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.outputs = options.outputs || {};
      options.inputs = options.inputs || {};
      options.inputs.twistertex = new NIN.TextureInput();
      options.inputs.camera = new NIN.Input();
      super(id, options);
      this.snareThrob = 0;
      this.kickThrob = 0;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 2048;
      canvas.height = 1024;
      ctx.fillStyle = '#00e04f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '130pt monospace';
      ctx.fillStyle = 'white';
      ctx.fillText('R E V I S i o N', canvas.width / 2, canvas.height / 2);
      ctx.fillStyle = 'rgb(55, 60, 63)';
      ctx.fillRect(0, 0, canvas.width, canvas.height / 16);
      ctx.fillRect(0, canvas.height - canvas.height / 16, canvas.width, canvas.height / 16);
      this.revisionTexture = new THREE.CanvasTexture(canvas);
      this.uniforms.trainCameraPosition.value = new THREE.Vector3(0, 0, 0);
      this.uniforms.trainCameraRotation.value = new THREE.Vector3(0, 0, 0);
    }

    update(frame) {
      const camera = this.inputs.camera.getValue();
      if(camera) {
        this.uniforms.trainCameraPosition.value.copy(camera.position);
        this.uniforms.trainCameraRotation.value.copy(camera.rotation);
        this.quad.material.needsUpdate = true;
      }
      this.uniforms.frame.value = frame;
      this.snareThrob *= 0.97;
      if(BEAT && BEAN % 48 == 24) {
        this.snareThrob = 1;
      }
      this.uniforms.snareThrob.value = this.snareThrob;
      this.uniforms.tDiffuse.value = this.inputs.twistertex.getValue();
      this.uniforms.tDiffuse.value = this.revisionTexture;

      const twistAmount = smoothstep(0, 1, (frame - FRAME_FOR_BEAN(2028)) / (FRAME_FOR_BEAN(2040) - FRAME_FOR_BEAN(2028)));
      this.uniforms.twistAmount.value = twistAmount;

      demo.nm.nodes.bloom.opacity = easeOut(1.5, 0.5, (frame - FRAME_FOR_BEAN(2016)) / (FRAME_FOR_BEAN(2028) - FRAME_FOR_BEAN(2016)));

      this.kickThrob *= 0.95;
      if(BEAT && BEAN >= 1920) {
        switch(BEAN % 96) { 
        case 0:
        case 42:
        case 48:
        case 48 + 9:
        case 48 + 18:
        case 48 + 24 + 6:
        case 48 + 24 + 8:
        case 48 + 24 + 10:
          this.kickThrob = 1;
        }
      }
      this.uniforms.kickThrob.value = this.kickThrob;
    }

    resize() {
      let width = 16 * GU;
      let height = 9 * GU;
      this.renderTarget.setSize(width, height);
      if(width >= 1280) {
        width = 1280;
        height = 720;
      }
    }
  }

  global.trainmodelNode = trainmodelNode;
})(this);
