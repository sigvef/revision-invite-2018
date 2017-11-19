(function(global) {
  class trainoverlay extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.output = Loader.loadTexture('res/train-overlay.png');
    }

    render() {
      this.outputs.render.setValue(this.output);
    }
  }

  global.trainoverlay = trainoverlay;
})(this);
