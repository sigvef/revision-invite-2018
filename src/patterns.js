(function(global) {
  class patterns extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.spikeBallsCanvas = document.createElement('canvas');
      this.spikeBallsCtx = this.spikeBallsCanvas.getContext('2d');

      this.circlePannerCanvas = document.createElement('canvas');
      this.circlePannerCtx = this.circlePannerCanvas.getContext('2d');

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;

      this.scopes = [
        {x: 0, y: 0, r: 3},
        {x: 0, y: 0, r: 2},
      ];
      this.throb = 0;
    }

    update(frame) {
      this.frame = frame;

      this.throb *= 0.95;
      if(BEAT && BEAN % 12 == 0) {
        this.throb = 1;
      }

      this.scopes[0].x = 6 + 6 * Math.sin(frame / 60);
      this.scopes[0].y = 6 + 3 * Math.cos(frame / 60);
      this.scopes[0].r = 2 + Math.sin(frame / 80);

      this.scopes[1].x = 6 + 6 * Math.sin(Math.PI + frame / 50);
      this.scopes[1].y = 6 + 3 * Math.cos(Math.PI + frame / 60);
    }

    resize() {
      this.spikeBallsCanvas.width = 16 * GU;
      this.spikeBallsCanvas.height = 9 * GU;
      this.circlePannerCanvas.width = 16 * GU;
      this.circlePannerCanvas.height = 9 * GU;
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    renderSpikeballs() {
      const ctx = this.spikeBallsCtx;
      const canvas = this.spikeBallsCanvas;
      ctx.fillStyle = '#0f933e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(GU, GU);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.fillStyle = '#00e04f';
      let amount = Math.sin(this.frame * Math.PI * 2 / 60 / 60 * 115 / 2);
      let sign = Math.sign(amount);
      amount = Math.pow(amount, 8);
      amount *= sign;
      for(let j = 0; j < 20; j++) {
        for(let i = 0; i < 17; i++) {
          ctx.lineTo(j % 2 ? i : 16 - i,
              -2 +
              j + (i % 2)
              + amount / 2 * (j % 2 ? 1 : -1)
              );
        }
      }
      ctx.lineTo(0, 20);
      ctx.fill();
      ctx.lineWidth = 0.1;
      ctx.strokeStyle = 'rgb(55, 60, 63)';
      ctx.stroke();

      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      ctx.moveTo(12 + 1.5, 5);
      for(let scope of this.scopes) {
        ctx.moveTo(scope.x + scope.r, scope.y);
        ctx.arc(scope.x, scope.y, scope.r, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.lineWidth = 0.1;
      ctx.strokeStyle = 'white';
      ctx.globalCompositeOperation = 'source-over';
      ctx.stroke();

      ctx.restore();
    }

    renderCirclePanner() {
      const canvas = this.circlePannerCanvas;
      const ctx = this.circlePannerCtx;
      ctx.save();
      ctx.scale(GU, GU);
      ctx.fillStyle = '#85062e';
      ctx.strokeStyle = 'white';
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = 'rgb(255, 73, 130)';
      ctx.lineWidth = 0.1;
      const radius = 0.25 + this.throb * 0.25;
      for(let i = -2; i < 20; i++) {
        for(let j = -2; j < 20; j++) {
          ctx.beginPath();
          ctx.arc(
              ((8 * -this.frame / 90) % 4) + 2 * i + (j % 2),
              ((8 * this.frame / 160) % 2) + j,
              radius,
              0,
              Math.PI * 2);
          ctx.fill();
          //ctx.stroke();
        }
      }
      ctx.restore();
    }

    render() {
      demo.nm.nodes.bloom.opacity = 0;
      this.renderCirclePanner();
      this.renderSpikeballs();

      this.ctx.drawImage(this.circlePannerCanvas, 0, 0);
      this.ctx.drawImage(this.spikeBallsCanvas, 0, 0);

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.patterns = patterns;
})(this);
