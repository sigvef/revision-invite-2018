(function(global) {

  class butterflies extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput(),
          ballpositions: new NIN.Output(),
          threedeecontent: new NIN.Output(),
        }
      });

      this.ps = new ParticleSystem({
        color: new THREE.Color(1, 73 / 255, 130 / 255),  
      });

      this.random = new Random(1041);

      this.kickThrobIndex = 0;

      this.throb = 0;

      const that = this;
      function CustomSinCurve(offset) {
        THREE.Curve.call(this);
        this.offset = offset;
        this.scale = 10 + that.random() * 5;
        this.scale /= 10;
      }

      CustomSinCurve.prototype = Object.create(THREE.Curve.prototype);
      CustomSinCurve.prototype.constructor = CustomSinCurve;

      CustomSinCurve.prototype.getPoint = function(t) {
        const x = t * 20 * 2;
        t += this.offset;
        const y = 0.5 * (Math.cos( 2 + t/353) + 2 * Math.sin(t / 10) + Math.sin(2 * Math.PI * t));
        const z = 0.5 * (Math.cos( 2 + t/142) + 3 * Math.sin(t / 40) + Math.sin(2 * Math.PI * t * 1.4));
        return new THREE.Vector3(x, y, z).multiplyScalar(10);
      };

      this.colors = [
        0xffffff,
        0xffffff,
        0xffffff,
        0xffffff,
        0xffffff,
        0xffffff,
        0x00e04f,
        0x00e04f,
        0x00e04f,
        0x00e04f,
        0x00e04f,
        0x00e04f,
      ];

      this.lines = [];

      this.butterflies = [];
      this.outputs.ballpositions.setValue([]);

      this.outputs.threedeecontent.value = new THREE.Object3D();
      this.outputs.threedeecontent.value.add(this.ps.particles);
      this.outputs.threedeecontent.value.rotation.y = -Math.PI / 2;
      const scale = 0.05;
      this.outputs.threedeecontent.value.scale.set(scale, scale, scale);
      this.outputs.threedeecontent.value.position.set(-0.5, 0.5, -2);

      for(let i = 0; i < 6; i++) {
        var path = new CustomSinCurve(this.random() * Math.PI * 2);
        var geometry = new THREE.TubeGeometry(path, 50, 0.15, 8);
        var material = new THREE.ShaderMaterial(SHADERS.butterflylines).clone();
        material.throb = 0;
        const color = new THREE.Color(this.colors[i]);
        material.uniforms.r.value = color.r;
        material.uniforms.g.value = color.g;
        material.uniforms.b.value = color.b;
        var mesh = new THREE.Mesh(geometry, material);
        mesh.path = path;
        mesh.scale.x = 0.5;
        this.outputs.threedeecontent.value.add(mesh);
        this.lines.push(mesh);
        mesh.percentageOffset = (this.random() - 0.5) * 0.1 * 0.5;

        const butterflyMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.7, 32 , 32),
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(55 / 255, 60 / 255, 63 / 255),
            emissive: new THREE.Color(1, 73 / 255, 130 / 255),
            emissiveIntensity: 1,
          }));
        this.butterflies.push(butterflyMesh);
        this.outputs.threedeecontent.value.add(butterflyMesh);
        mesh.light = new THREE.PointLight(new THREE.Color(1, 73 / 255, 130 / 255), 0.1);
        this.outputs.threedeecontent.value.add(mesh.light);
        this.outputs.ballpositions.getValue().push(butterflyMesh.position.clone());
      }
    }


    update(frame) {
      super.update(frame);
      const frameStart = 5759;
      const positionX = (frame - frameStart) / 2 / 2;

      if(frame == 5759) {
        this.kickThrobIndex = 0;
      }

      this.throb *= 0.85;
      if(BEAT && BEAN % 12 == 0) {
        this.throb = 1;
      }

      if(BEAT) {
        switch(BEAN % 96) { 
        case 0:
        case 42:
        case 48:
        case 48 + 9:
        case 48 + 18:
        case 48 + 24 + 6:
        case 48 + 24 + 8:
        case 48 + 24 + 10:
          this.lines[this.kickThrobIndex].material.throb = 1;
          this.kickThrobIndex = (this.kickThrobIndex + 1) % this.lines.length;
        }
      }


      for(let i = 0; i < this.lines.length; i++) {
        const percentage = (frame - frameStart) / 500 / 2 + this.lines[i].percentageOffset;
        this.lines[i].material.uniforms.percentage.value = percentage;
        this.butterflies[i].position.copy(this.lines[i].path.getPoint(percentage));
        this.butterflies[i].position.x /= 2;
        this.lines[i].light.position.copy(this.butterflies[i].position);
        this.outputs.ballpositions.value[i].copy(this.butterflies[i].position);
        this.outputs.ballpositions.value[i].x = this.butterflies[i].position.x - positionX;

        const material = this.lines[i].material;
        material.throb *= 0.9;
        material.uniforms.r.value = lerp(55 / 255, 1, material.throb);
        material.uniforms.g.value = lerp(60 / 255, 1, material.throb);
        material.uniforms.b.value = lerp(63 / 255, 1, material.throb);
        material.uniforms.a.value = 1;

        const position = this.butterflies[i].position;
        for(let i = 0; i < 2; i++) {
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * .5;
          const distance = 0;
          const velocityAngle = Math.random() * Math.PI * 2;
          const velocityRadius = 0.005;
          this.ps.spawn({
            x: position.x - distance,
            y: position.y + Math.cos(angle) * radius,
            z: position.z + Math.sin(angle) * radius,
          },
            {
              x: .5 * (0.05 -0.1 * Math.random()),
              y: Math.sin(velocityAngle) * velocityRadius,
              z: Math.cos(velocityAngle) * velocityRadius,
            }, 0.0002);
        }
      }

      //this.ps.update();
    }

    render() {
      //this.ps.render();
    }
  }

  global.butterflies = butterflies;
})(this);
