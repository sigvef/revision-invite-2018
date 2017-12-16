(function (global) {
  const firstDrumBeat = FRAME_FOR_BEAN(48 * 18 - 6);
  const secondDrumBeat = FRAME_FOR_BEAN(48 * 18 - 3);
  const atariSceneStart = FRAME_FOR_BEAN(48 * 18);
  const animationFinished = FRAME_FOR_BEAN(48 * 18.25);

  class justTransitionNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };
      super(id, options);

      this.textCanvas = document.createElement('canvas');
      this.textCtx = this.textCanvas.getContext('2d');
      this.textTexture = new THREE.CanvasTexture(this.textCanvas);
      this.textTexture.minFilter = THREE.NearestFilter;
      this.textTexture.magFilter = THREE.NearestFilter;
      this.resize();
    }

    resize() {
      super.resize();
      if (this.textCanvas) {
        this.textCanvas.width = 16 * GU;
        this.textCanvas.height = 9 * GU;
      }
    }

    beforeUpdate(frame) {
      this.inputs.A.enabled = frame < animationFinished;
      this.inputs.B.enabled = frame >= atariSceneStart;
    }

    update(frame) {
      const rectPositionY = easeOut(
        easeOut(-2, 0, (frame - firstDrumBeat) / (secondDrumBeat - firstDrumBeat)),
        9, (frame - atariSceneStart) / (animationFinished - atariSceneStart));

      this.textCtx.save();
      this.textCtx.scale(GU, GU);
      this.textCtx.font = '1pt schmalibre';
      this.textCtx.textAlign = 'center';


      this.textCtx.textBaseline = 'middle';
      this.textCtx.fillStyle = '#ff0000';
      this.textCtx.fillRect(0, 0, 16, rectPositionY);
      this.textCtx.fillStyle = '#0000ff';
      this.textCtx.fillRect(0, 2.0 + rectPositionY, 16, 9);
      this.textCtx.fillStyle = '#77e15d';
      this.textCtx.fillStyle = 'rgb(55, 60, 63)';
      this.textCtx.fillRect(0, rectPositionY, 16, 2);
      this.textCtx.fillStyle = 'white';
      this.textCtx.fillText('JUST', 8, 0.94 + rectPositionY);//    easeOut(-0.6, 10.165, t));
      this.textCtx.restore();
      this.textTexture.needsUpdate = true;
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
      this.uniforms.text.value = this.textTexture;

      demo.nm.nodes.bloom.opacity = lerp(0.0, 0., (frame - atariSceneStart) / (animationFinished - atariSceneStart));
    }
  }

  global.justTransitionNode = justTransitionNode;
})(this);
