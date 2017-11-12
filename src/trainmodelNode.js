(function(global) {
  class trainmodelNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
      this.snareThrob = 0;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 256;
      ctx.fillStyle = '#00e04f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '70pt Arial';
      ctx.fillStyle = 'rgb(55, 60, 63)';
      ctx.fillText('REVISION', 256, 128);
      this.revisionTexture = new THREE.CanvasTexture(canvas);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.snareThrob *= 0.97;
      if(BEAT && BEAN % 48 == 24) {
        this.snareThrob = 1;
      }
      this.uniforms.snareThrob.value = this.snareThrob;
      this.uniforms.tDiffuse.value = this.revisionTexture;
    }

    resize() {
      let width = 16 * GU;
      let height = 9 * GU;
      if(width >= 1280) {
        width = 1280;
        height = 720;
      }
      this.renderTarget.setSize(width, height);
    }
  }

  global.trainmodelNode = trainmodelNode;
})(this);
