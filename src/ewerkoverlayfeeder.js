(function(global) {
  class ewerkoverlayfeeder extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });


      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvasTexture = new THREE.CanvasTexture(this.canvas);
      this.canvasTexture.minFilter = THREE.LinearFilter;
      this.canvasTexture.magFilter = THREE.LinearFilter;
      this.canvas.width = 1920;
      this.canvas.height = 1080;
      this.beforeImage = document.createElement('img');
      Loader.load('res/intro-overlay.png', this.beforeImage, () => {});
      this.afterImage = document.createElement('img');
      Loader.load('res/outro-overlay.png', this.afterImage, () => {});
    }

    warmup(renderer) {
      this.update(11509);
      this.render(renderer);
      this.update(166);
      this.render(renderer);
    }

    update(frame) {
      this.frame = frame;
    }

    render() {
      this.ctx.clearRect(0, 0, this.canvas.width,  this.canvas.height);
      let t = lerp(0, 1, (this.frame - 112) / (124 - 112));
      t = lerp(t, 0, (this.frame - 239 + 10) / (250 - 239));
      t = lerp(t, 1, (this.frame - 11315) / 400);
      this.ctx.globalAlpha = easeIn(0, 1, t * 3);
      this.ctx.fillStyle = 'rgb(55, 60, 63)';
      //this.ctx.fillRect(0, 800, 1920, 1000);
      if(BEAN < 1000) {
        this.ctx.drawImage(this.beforeImage, 0, easeIn(20, -20, t));
      } else {
        this.ctx.drawImage(this.afterImage, 0, easeOut(100, -40, t));
      }

      this.canvasTexture.needsUpdate = true;
      this.outputs.render.setValue(this.canvasTexture);
    }

    resize() {
    }
  }

  global.ewerkoverlayfeeder = ewerkoverlayfeeder;
})(this);
