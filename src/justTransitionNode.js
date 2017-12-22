(function (global) {
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

    warmup(renderer) {
      this.update(2221);
      this.render(renderer);
    }

    beforeUpdate(frame) {
      const atariSceneStart = FRAME_FOR_BEAN(48 * 18);
      const animationFinished = FRAME_FOR_BEAN(48 * 18.25);

      this.inputs.A.enabled = frame < animationFinished;
      this.inputs.B.enabled = frame >= atariSceneStart - 200;
    }

    update(frame) {
      const t3 = (frame - FRAME_FOR_BEAN(864)) / (
          FRAME_FOR_BEAN(864 + 0) - FRAME_FOR_BEAN(864));
      const rectPositionY = easeOut(-2, 9, t3);

      this.textCtx.save();
      this.textCtx.scale(GU, GU);

      this.textCtx.textBaseline = 'middle';
      this.textCtx.fillStyle = '#ff0000';
      this.textCtx.fillRect(0, 0, 16, rectPositionY);
      this.textCtx.fillStyle = '#0000ff';
      this.textCtx.fillRect(0, 2.0 + rectPositionY, 16, 9);
      this.textCtx.fillStyle = '#ff0000';
      const t = (frame - FRAME_FOR_BEAN(864 - 12)) / (
          FRAME_FOR_BEAN(864 + 0 - 12) - FRAME_FOR_BEAN(864 - 12));
      this.textCtx.fillRect(0, easeOut(-9, 0, t), 16 / 3, 9);

      const t2 = (frame - FRAME_FOR_BEAN(864 - 6)) / (
          FRAME_FOR_BEAN(864 + 0 - 6) - FRAME_FOR_BEAN(864 - 6));
      this.textCtx.fillRect(16 / 3, easeOut(-9, 0, t2), 16 / 3, 9);

      const t4 = (frame - FRAME_FOR_BEAN(864 + 9)) / (
          FRAME_FOR_BEAN(864 + 9 + 3) - FRAME_FOR_BEAN(864 + 9));
      this.textCtx.fillStyle = '#0000ff';
      this.textCtx.fillRect(0, easeOut(3, 4.5, t4), 16, easeOut(3, 0, t4));

      this.textCtx.restore();
      this.textTexture.needsUpdate = true;
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
      this.uniforms.text.value = this.textTexture;
    }
  }

  global.justTransitionNode = justTransitionNode;
})(this);
