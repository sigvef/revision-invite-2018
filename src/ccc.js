(function(global) {
  class ccc extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.whiteColor = 0xffffff;
      this.grayColor = 0x373c3f;
      this.greenColor = 0x77e15d;
      this.pinkColor = 0xff4982;

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 50;

      this.NUM_TENTACLES = 30;

      this.group = new THREE.Group();
      for(let i = 0; i < this.NUM_TENTACLES; i++) {
        let geo = new THREE.Geometry();
        let tentacle = new THREE.Line(geo, new THREE.LineBasicMaterial({
          color: (Math.random() > 0.5 ? this.pinkColor : this.greenColor)
        }));

        tentacle.wave = Math.random();
        tentacle.speed = Math.random() * 1000 + 200;
        tentacle.radius = 20;

        for(let j = 0; j < this.NUM_TENTACLES; j++) {
          const point = ((j / this.NUM_TENTACLES) * tentacle.radius * 2) - tentacle.radius;
          const vec = new THREE.Vector3(point, 0, 0);
          geo.vertices.push(vec);
        }

        tentacle.rotation.x = Math.random() * Math.PI;
        tentacle.rotation.y = Math.random() * Math.PI;
        tentacle.rotation.z = Math.random() * Math.PI;
        this.group.add(tentacle);
      }

      this.scene.add(this.group);
    }

    update(frame) {
      super.update(frame);

      demo.nm.nodes.bloom.opacity = .25;

      this.group.rotation.x = (frame*0.0001);
      this.group.rotation.y = (frame*0.0001);

      for(let i = 0; i < this.NUM_TENTACLES; i++) {
        let tentacle = this.group.children[i];

        for(let j = 0; j < this.NUM_TENTACLES; j++) {
          let point = this.group.children[i].geometry.vertices[j];
          let ratio = 1 - ((tentacle.radius - Math.abs(point.x)) / tentacle.radius);
          let y = Math.sin(frame / tentacle.speed + j*0.15) * 12 * ratio;
          point.y = y;
        }

        tentacle.geometry.verticesNeedUpdate = true;
      }
    }
  }

  global.ccc = ccc;
})(this);
