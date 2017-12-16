(function(global) {
  class ccc extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.random = new Random(0x80); // eslint-disable-line

      this.whiteColor = 0xffffff;
      this.grayColor = 0x373c3f;
      this.greenColor = 0x77e15d;
      this.pinkColor = 0xff4982;

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 200;

      this.NUM_TENTACLES = 30;

      this.particles = new THREE.Group();

      this.group = new THREE.Group();
      for(let i = 0; i < this.NUM_TENTACLES; i++) {
        let geo = new THREE.Geometry();

        let tentacleInfo = {
          wave: this.random(),
          speed: this.random() * 1000 + 200,
          radius: 80
        };

        for(let j = 0; j < this.NUM_TENTACLES; j++) {
          const point = ((j / this.NUM_TENTACLES) * tentacleInfo.radius * 2) - tentacleInfo.radius;
          const vec = new THREE.Vector3(point, 0, 0);
          geo.vertices.push(vec);
        }

        let line = new THREE.MeshLine();
        line.setGeometry(geo);//, p => 1-p);

        let lineMaterial = new THREE.MeshLineMaterial({
          color: new THREE.Color((this.random() > 0.5 ? this.pinkColor : this.greenColor)),
          resolution: new THREE.Vector2(16*GU, 9*GU),
          lineWidth: 1,
        });

        let tentacle = new THREE.Mesh(line.geometry, lineMaterial);

        tentacle.wave = tentacleInfo.wave;
        tentacle.speed = tentacleInfo.speed;
        tentacle.radius = tentacleInfo.radius;

        tentacle.rotation.x = this.random() * Math.PI;
        tentacle.rotation.y = this.random() * Math.PI;
        tentacle.rotation.z = this.random() * Math.PI;
        this.group.add(tentacle);
      }

      this.scene.add(this.group);
    }

    update(frame) { super.update(frame);

      demo.nm.nodes.bloom.opacity = .25;

      this.group.rotation.x = (frame*0.0001);
      this.group.rotation.y = (frame*0.0001);

      for(let i = 0; i < this.NUM_TENTACLES; i++) {
        let tentacle = this.group.children[i];

        let positions = tentacle.geometry.attributes.position.array;

        for(let j = 0; j < positions.length; j+=3) {
          let ratio = 1 - ((tentacle.radius - Math.abs(positions[j])) / tentacle.radius);
          let y = Math.sin(frame * 10 / tentacle.speed + j*0.15) * 2 * ratio;
          positions[j+1] = y;
          /*
          let z = Math.cos(frame * 10 / tentacle.speed + j*0.15) * 2 * ratio;
          positions[j+2] = z;
          */
        }

        tentacle.geometry.attributes.position.needsUpdate = true;
      }
    }

    render(renderer) {
      renderer.setClearColor(this.grayColor, 1.0);
      super.render(renderer);
    }

  }

  global.ccc = ccc;
})(this);
