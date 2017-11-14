(function(global) {
  class trainmodelNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.outputs = options.outputs || {};
      options.inputs = options.inputs || {};
      options.inputs.twistertex = new NIN.TextureInput();
      super(id, options);
      this.snareThrob = 0;
      this.kickThrob = 0;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 512 * 2 * 2;
      canvas.height = 128 * 2;
      ctx.fillStyle = 'rgb(255, 73, 130)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '130pt monospace';
      ctx.fillStyle = 'white';
      ctx.fillText('R E V I S i o N', canvas.width / 2, canvas.height / 2);
      this.revisionTexture = new THREE.CanvasTexture(canvas);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.snareThrob *= 0.97;
      if(BEAT && BEAN % 48 == 24) {
        this.snareThrob = 1;
      }
      this.uniforms.snareThrob.value = this.snareThrob;
      this.uniforms.tDiffuse.value = this.inputs.twistertex.getValue();
      this.uniforms.tDiffuse.value = this.revisionTexture;

      demo.nm.nodes.bloom.opacity = easeOut(1.5, 0.5, (frame - FRAME_FOR_BEAN(2004)) / (FRAME_FOR_BEAN(2016 + 12) - FRAME_FOR_BEAN(2004)));

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
