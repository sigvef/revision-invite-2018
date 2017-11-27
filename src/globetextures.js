(function(global) {
  class globetextures extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          globeTextures: new NIN.Output()
        }
      });
      
      let names = [
        'res/space-sky/skybox_right1.png',
        'res/space-sky/skybox_left2.png',
        'res/space-sky/skybox_top3.png',
        'res/space-sky/skybox_bottom4.png',
        'res/space-sky/skybox_front5.png',
        'res/space-sky/skybox_back6.png',
      ];
      var materialArray = [];
      for (var i = 0; i < 6; i++) {
        materialArray.push(
            new THREE.MeshBasicMaterial({
              map: Loader.loadTexture(names[i]),
              side: THREE.BackSide,
            }));
      }

      this.outputs.globeTextures.value = {
        map: Loader.loadTexture('res/earth-map.jpg'),
        cloudMap: Loader.loadTexture('res/earth-cloud-map.jpg'),
        skyboxMaterial: new THREE.MeshFaceMaterial(materialArray),
      };
    }
  }

  global.globetextures = globetextures;
})(this);
