(function(global) {
  class revisionLogoCenter extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;

      this.revisionLogoInner = document.createElement('img');
      this.revisionLogoOuter = document.createElement('img');
      this.revisionLogoMiddle = document.createElement('img');
      Loader.load('res/pink_revision_logo_inner.png', this.revisionLogoInner, () => { });
      Loader.load('res/pink_revision_logo_outer.png', this.revisionLogoOuter, () => { });
      Loader.load('res/pink_revision_logo_middle.png', this.revisionLogoMiddle, () => { });
    }

    update(frame) {
      super.update(frame);

      this.frame = frame;
    }

    resize() {
      super.resize();

      this.canvas.width = 4 * GU;
      this.canvas.height = 4 * GU;
    }

    render() {
      const frame = this.frame;

      // This clears the canvas
      this.canvas.width += 0;

      let scaler = 3*GU / this.revisionLogoOuter.width;
      this.ctx.save();
      this.ctx.translate(2*GU, 2*GU);
      this.ctx.scale(scaler, scaler);
      this.ctx.rotate(frame / 20);
      this.ctx.drawImage(this.revisionLogoOuter, -this.revisionLogoOuter.width / 2, -this.revisionLogoOuter.height / 2);
      this.ctx.restore();

      scaler = 3*GU / this.revisionLogoInner.width;
      this.ctx.save();
      this.ctx.translate(2*GU, 2*GU);
      this.ctx.scale(scaler, scaler);
      this.ctx.rotate(frame / 80);
      this.ctx.drawImage(this.revisionLogoInner, -this.revisionLogoInner.width / 2, -this.revisionLogoInner.height / 2);
      this.ctx.restore();

      scaler = 3*GU / this.revisionLogoMiddle.width;
      this.ctx.save();
      this.ctx.translate(2*GU, 2*GU);
      this.ctx.scale(scaler, scaler);
      this.ctx.rotate(frame / 80);
      this.ctx.drawImage(this.revisionLogoMiddle, -this.revisionLogoMiddle.width / 2, -this.revisionLogoMiddle.height / 2);
      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.revisionLogoCenter = revisionLogoCenter;
})(this);
