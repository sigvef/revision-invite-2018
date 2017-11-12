(function(global) {

  const petalRandom = new Random(1248);

  const petalCache = [];
  let petalCacheIndex = -1;
  const MAX_PETALS = 32;

  function generateFlower() {
    petalCacheIndex = (petalCacheIndex + 1) % MAX_PETALS;
    const cached = petalCache[petalCacheIndex];
    if(cached) {
      return cached;
    }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.heigth);
    ctx.scale(canvas.width / 2, canvas.height / 2);
    ctx.translate(1, 1);
    ctx.fillStyle = 'rgb(255, 73, 130)';
    ctx.strokeStyle = 'white';
    ctx.strokeStyle = '#b71346';
    ctx.lineWidth = 0.06;
    const numberOfPetals = 3 + petalRandom() * 21 | 0;
    const innerRadius = 0.2 + petalRandom()  * 0.5;
    const outerRadius = innerRadius + petalRandom() * (1 - innerRadius);
    ctx.moveTo(innerRadius, 0);
    const controlPoint1 = {
      x: petalRandom() - 0.5,
      y: petalRandom() - 0.5,
    };
    const controlPoint2 = {
      x: petalRandom() - 0.5,
      y: petalRandom() - 0.5,
    };
    for(let i = 0; i < numberOfPetals; i++) {
      ctx.bezierCurveTo( 
          controlPoint1.x, controlPoint1.y,
          controlPoint2.x, controlPoint2.y,
          outerRadius, 0);
      ctx.rotate(Math.PI * 2 / numberOfPetals);
      ctx.bezierCurveTo( 
          -controlPoint1.x, -controlPoint1.y,
          -controlPoint2.x, -controlPoint2.y,
          innerRadius, 0);
    }

    ctx.stroke();
    ctx.fill();

    ctx.save();
    ctx.scale(1.2, 1.2);
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.moveTo(innerRadius, 0);
    for(let i = 0; i < numberOfPetals; i++) {
      ctx.bezierCurveTo( 
          controlPoint1.x, controlPoint1.y,
          controlPoint2.x, controlPoint2.y,
          outerRadius, 0);
      ctx.rotate(Math.PI * 2 / numberOfPetals);
      ctx.bezierCurveTo( 
          -controlPoint1.x, -controlPoint1.y,
          -controlPoint2.x, -controlPoint2.y,
          innerRadius, 0);
    }
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.scale(0.8, 0.8);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(innerRadius, 0);
    for(let i = 0; i < numberOfPetals; i++) {
      ctx.bezierCurveTo( 
          controlPoint1.x, controlPoint1.y,
          controlPoint2.x, controlPoint2.y,
          outerRadius, 0);
      ctx.rotate(Math.PI * 2 / numberOfPetals);
      ctx.bezierCurveTo( 
          -controlPoint1.x, -controlPoint1.y,
          -controlPoint2.x, -controlPoint2.y,
          innerRadius, 0);
    }
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.scale(0.45, 0.45);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.moveTo(innerRadius, 0);
    for(let i = 0; i < numberOfPetals; i++) {
      ctx.bezierCurveTo( 
          controlPoint1.x, controlPoint1.y,
          controlPoint2.x, controlPoint2.y,
          outerRadius, 0);
      ctx.rotate(Math.PI * 2 / numberOfPetals);
      ctx.bezierCurveTo( 
          -controlPoint1.x, -controlPoint1.y,
          -controlPoint2.x, -controlPoint2.y,
          innerRadius, 0);
    }
    ctx.fill();
    ctx.restore();

    const height = petalRandom() * 0.3;
    const radius = 0.01 + petalRandom() * 0.1;
    for(let i = 0; i < numberOfPetals; i++) {

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(height, 0, radius * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.rotate(Math.PI * 2 / numberOfPetals);
    }

    ctx.globalCompositeOperation = 'destination-over';
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 0.5);
    gradient.addColorStop(0, 'rgba(0,0,0,0.25)');
    gradient.addColorStop(0.2, 'rgba(0,0,0,0.25)');
    gradient.addColorStop(0.4, 'rgba(0,0,0,0.2)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0.2, 0.5, 0, Math.PI * 2);
    ctx.fill();

    const value = new THREE.CanvasTexture(canvas);
    petalCache[petalCacheIndex] = value;
    return value;
  }

  class butterflies extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput(),
          ballpositions: new NIN.Output()
        }
      });

      this.camera = new THREE.PerspectiveCamera(.5, 16/9, 1, 100000);

      const flowerGeometry = new THREE.BoxGeometry(20, 20, 20);
      this.flowers = [];
      for(let i = 0; i < 1000; i++) {
        const flower = new THREE.Mesh(
            flowerGeometry,
            new THREE.MeshBasicMaterial({
              map: generateFlower(),
              transparent: true,
            }));
        this.flowers.push(flower);
        flower.position.set(
            (petalRandom()- 0.5) * 100,
            (petalRandom()- 0.5) * 200,
            (petalRandom()- 0.5) * 400);
        this.scene.add(flower);
      }


      this.random = new Random(1041);

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

      this.bg = new THREE.Mesh(
          new THREE.CylinderGeometry(10000, 10000, 1000, 32),
          new THREE.MeshStandardMaterial({
            emissive: new THREE.Color(255 / 255, 73 / 255, 130 / 255),
            emissiveIntensity: 1,
            side: THREE.BackSide,
          }));
      this.scene.add(this.bg);

      this.colors = [
        0x00e04f,
        0x00e04f,
        0x00e04f,
        0x00e04f,
        0x00e04f,
        0x00e04f,
      ];

      this.lines = [];

      this.butterflies = [];

      this.particleSystem = new window.ParticleSystem({
        color: new THREE.Color(0xfffffff)
      });
      //this.scene.add(this.particleSystem.particles);
      //
      this.outputs.ballpositions.setValue([]);

      for(let i = 0; i < 6; i++) {
        var path = new CustomSinCurve(this.random() * Math.PI * 2);
        var geometry = new THREE.TubeGeometry(path, 50, 0.2, 8);
        var material = new THREE.ShaderMaterial(SHADERS.butterflylines).clone();
        const color = new THREE.Color(this.colors[i]);
        material.uniforms.r.value = color.r;
        material.uniforms.g.value = color.g;
        material.uniforms.b.value = color.b;
        var mesh = new THREE.Mesh(geometry, material);
        mesh.path = path;
        mesh.scale.x = 0.5;
        this.scene.add(mesh);
        this.lines.push(mesh);
        mesh.percentageOffset = (this.random() - 0.5) * 0.1 * 0.5;

        const butterflyMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.7, 32 , 32),
          new THREE.MeshStandardMaterial({
            color: new THREE.Color(55 / 255, 60 / 255, 63 / 255),
            emissive: 0xffffff,
            emissiveIntensity: 1,
          }));
        this.butterflies.push(butterflyMesh);
        this.scene.add(butterflyMesh);
        this.outputs.ballpositions.getValue().push(butterflyMesh.position.clone());
      }
    }


    update(frame) {
      super.update(frame);
      const frameStart = 7011;
      this.camera.position.x = (frame - frameStart) / 2 / 2;

      for(let flower of this.flowers) {
        flower.lookAt(this.camera.position);
      }

      /*
      for(let i = 0; i < this.lines.length; i++) {
        const line = this.lines[i];
        line.material.uniforms.r.value = lerp(0, 1, this.throb);
        line.material.uniforms.g.value = lerp(0xe0 / 255, 1, this.throb);
        line.material.uniforms.b.value = lerp(0x4f / 255, 1, this.throb);
      }
      */

      this.throb *= 0.85;
      if(BEAT && BEAN % 12 == 0) {
        this.throb = 1;
      }

      const t = (frame - frameStart - 250) / 150;
      const fov = easeIn(5, 45, t);
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
      this.camera.position.z = smoothstep(500, 0, t);
      this.camera.position.x += smoothstep(0, 10, t);
      const percentage = (frame - frameStart) / 500 / 2;
      const lookAtX = easeOut(this.camera.position.x, this.lines[0].path.getPoint(percentage).x / 2, t);
      this.camera.lookAt(new THREE.Vector3(lookAtX, 0, 0));

      for(let i = 0; i < this.lines.length; i++) {
        const percentage = (frame - frameStart) / 500 / 2 + this.lines[i].percentageOffset;
        this.lines[i].material.uniforms.percentage.value = percentage;
        this.butterflies[i].position.copy(this.lines[i].path.getPoint(percentage));
        this.butterflies[i].position.x /= 2;
        this.outputs.ballpositions.value[i].copy(this.butterflies[i].position);
        this.outputs.ballpositions.value[i].x = this.butterflies[i].position.x - this.camera.position.x;
        const angle = this.random() * Math.PI * 2;
        const amplitude = 0.05;
        const dy = amplitude * Math.cos(angle);
        const dz = amplitude * Math.cos(angle);
        this.particleSystem.spawn(this.butterflies[i].position, {
          x: -0.001 * this.random(),
          y: dy * this.random(),
          z: dz * this.random(),
        });
      }

      this.particleSystem.update();

      //this.bg.scale.y = smoothstep(1, 0.02, t);
      this.bg.scale.x = smoothstep(1, 0.1, t);
      this.bg.scale.z = smoothstep(1, 0.1, t);

      const baseFrame = FRAME_FOR_BEAN(2592);
      for(let i = 0; i < this.flowers.length; i++) {
        const flower = this.flowers[i];
        const scale = elasticOut(0.0001, 1, 2.2, (frame - baseFrame - 100 - flower.position.x * 3) / 40);
        flower.scale.set(scale, scale, scale);
        flower.rotation.z = frame / 302 * (1 + flower.position.z / 200);
      }

    }

    render(renderer) {
      super.render(renderer);
    }
  }

  global.butterflies = butterflies;
})(this);
