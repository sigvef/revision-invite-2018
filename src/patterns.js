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
      this.spikeballAmount = 0;
      this.spikeballDirection = -1;

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

      this.spikeballAmount *= 0.75;

      if(BEAT && BEAN == 3672) {
        this.spikeballAmount = 0;
        this.spikeballDirection = -1;
      }

      if(BEAT) {
        switch(BEAN % 24) {
        case 6:
        case 9:
        case 18:
          this.spikeballDirection = -this.spikeballDirection;
          this.spikeballAmount = 1;
        }
      }
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
      const amount = this.spikeballDirection > 0
                   ? (this.spikeballAmount - 0.5) * 2
                   : (0.5 - this.spikeballAmount) * 2;
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

      const scaler = this.zoomer(ctx);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.beginPath();
      let i = 0;
      const zoomX = 11.9;
      const zoomY = 7.8;
      const startBean = 3672 + 12;
      const beanLength = 12 * 3;
      this.scopes[1].r = easeIn(2, 10,
          (this.frame - FRAME_FOR_BEAN(startBean + 24)) /
          (FRAME_FOR_BEAN(startBean + 24 + 24) - FRAME_FOR_BEAN(startBean + 24)));
      for(let scope of this.scopes) {
        const beanOffset = i * 3;
        const scopeScale = elasticOut(0.000001, 1, 0.95,
            (this.frame - FRAME_FOR_BEAN(3672 + beanOffset)) /
            (FRAME_FOR_BEAN(3672 + 24 + beanOffset) - FRAME_FOR_BEAN(3672 + beanOffset)));
        i++;
        ctx.save();
        ctx.translate(scope.x, scope.y);
        ctx.scale(scopeScale, scopeScale);
        ctx.moveTo(0 + scope.r, 0);
        ctx.arc(0, 0, scope.r, 0, Math.PI * 2);
        ctx.restore();
      }
      ctx.fill();
      ctx.lineWidth = 0.1 / scaler;
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
      const scaler = this.zoomer(ctx);
      ctx.fillStyle = '#85062e';
      ctx.strokeStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgb(255, 73, 130)';
      ctx.lineWidth = 0.1 / scaler;
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

    zoomer(ctx) {
      const zoomX = 11.9;
      const zoomY = 7.8;
      const startBean = 3672 + 12;
      const beanLength = 12 * 3;
      let scaler = Math.log10(easeIn(10, 100,
          (this.frame - FRAME_FOR_BEAN(startBean)) /
          (FRAME_FOR_BEAN(startBean + beanLength) - FRAME_FOR_BEAN(startBean))));
    
      ctx.translate(zoomX, zoomY);
      ctx.scale(scaler, scaler);
      ctx.translate(-zoomX, -zoomY);
      return scaler;
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
