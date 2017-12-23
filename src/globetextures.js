(function(global) {
  class globetextures extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          globeTextures: new NIN.Output()
        }
      });

      const mapDetail = Loader.loadTexture('res/earth-map-detail.png');
      mapDetail.repeat.set(4, 4);
      mapDetail.offset.set(-1.5, -2.5);

      this.outputs.globeTextures.value = {
        map: Loader.loadTexture('res/earth-map.png'),
        mapDetail,
      };
    }
  }

  global.globetextures = globetextures;
})(this);
