(function(global) {
  class iceberg extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput(),
          renderColoring: new NIN.TextureOutput(),
        }
      });

      this.cube = new THREE.Mesh(
        new THREE.BoxGeometry(50, 50, 50),
        new THREE.MeshPhongMaterial({ color: 0xffffff, }));
      this.scene.add(this.cube);
      this.cube.position.x = -150;

      this.sphere = new THREE.Mesh(
        new THREE.SphereGeometry(50),
        new THREE.MeshPhongMaterial({ color: 0xffffff, }));
      this.scene.add(this.sphere);

      this.cone = new THREE.Mesh(
        new THREE.ConeGeometry(50),
        new THREE.MeshPhongMaterial({ color: 0xffffff, }));
      this.scene.add(this.cone);
      this.cone.position.x = 150;


      this.pinklightball = new THREE.Mesh(
          new THREE.SphereGeometry(10),
          new THREE.MeshBasicMaterial({color: 0xff00ff}));
      this.greenlightball = new THREE.Mesh(
          new THREE.SphereGeometry(10),
          new THREE.MeshBasicMaterial({color: 0xff00ff}));
      this.scene.add(this.pinklightball);
      this.scene.add(this.greenlightball);
      this.pinklight = new THREE.PointLight(0xff00ff);
      this.greenlight = new THREE.PointLight(0xff00ff);

      this.scene.add(this.pinklight);
      this.scene.add(this.greenlight);

      /* override rendertarget to get RGBA format */
      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      });

      this.renderTargetColoring = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      });

      this.light = new THREE.DirectionalLight(0xffffff, 1, 100);
      this.light.position.set(50, 50, 50);
      this.scene.add(this.light);

      this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
      this.scene.add(this.ambientLight);
    }

    update(frame) {
      super.update(frame);

      this.cube.rotation.x = frame / 100;
      this.cube.rotation.y = frame / 100;
      this.sphere.rotation.x = frame / 100;
      this.sphere.rotation.y = frame / 100;
      this.cone.rotation.x = frame / 100;
      this.cone.rotation.y = frame / 100;

      this.pinklightball.position.x = 100 * Math.sin(frame / 121);
      this.pinklightball.position.y = 100 * Math.sin(frame / 123);
      this.pinklightball.position.z = 100 * Math.cos(frame / 142);
      this.pinklight.position.copy(this.pinklightball.position);
      this.greenlightball.position.x = 100 * Math.sin(1 + frame / 121);
      this.greenlightball.position.y = 100 * Math.sin(2 + frame / 123);
      this.greenlightball.position.z = 100 * Math.cos(3 + frame / 142);
      this.greenlight.position.copy(this.greenlightball.position);

      this.camera.position.x = 500 * Math.sin(frame / 100);
      this.camera.position.y = 200;
      this.camera.position.z = 500 * Math.cos(frame / 100);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));

      demo.nm.nodes.bloom.opacity = 0.1;
    }

    resize() {
      const scale = 1 / 2;
      this.renderTarget.setSize(16 * GU, 9 * GU);
      this.renderTargetColoring.setSize(16 * GU * scale, 9 * GU * scale);
    }

    render(renderer) {
      this.light.visible = true;
      this.ambientLight.visible = true;
      this.pinklightball.material.color.setHex(0xffffff);
      this.pinklight.color.setHex(0xffffff);
      this.pinklight.intensity = 1;
      this.greenlightball.material.color.setHex(0xffffff);
      this.greenlight.color.setHex(0xffffff);
      this.greenlight.intensity = 1;
      renderer.setClearColor(new THREE.Color(0x000000), 0);
      super.render(renderer);

      this.light.visible = false;
      this.ambientLight.visible = false;
      this.pinklightball.material.color.setRGB(
          (0xff - 255) / 0xff, 
          (0xff - 73) / 0xff,
          (0xff - 130) / 0xff);
      this.pinklight.color.setRGB(
          (0xff - 255) / 0xff, 
          (0xff - 73) / 0xff,
          (0xff - 130) / 0xff);
      this.pinklight.intensity = 0.25;
      this.greenlightball.material.color.setRGB(
          (0xff - 0x00) / 0xff, 
          (0xff - 0xe0) / 0xff,
          (0xff - 0x4f) / 0xff);
      this.greenlight.color.setRGB(
          (0xff - 0x00) / 0xff, 
          (0xff - 0xe0) / 0xff,
          (0xff - 0x4f) / 0xff);
      this.greenlight.intensity = 0.25;
      renderer.setClearColor(new THREE.Color(0x000000), 1);
      renderer.render(this.scene, this.camera, this.renderTargetColoring, true);
      this.outputs.renderColoring.setValue(this.renderTargetColoring.texture);
    }
  }

  global.iceberg = iceberg;
})(this);
