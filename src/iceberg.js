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

      this.lightball = new THREE.Mesh(
          new THREE.SphereGeometry(10),
          new THREE.MeshBasicMaterial({color: 0xff9a36}));
      this.scene.add(this.lightball);
      this.orangelight = new THREE.PointLight(0xff9a36);
      this.scene.add(this.orangelight);

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

      this.lightball.position.x = 100 * Math.sin(frame / 121);
      this.lightball.position.y = 100 * Math.sin(frame / 123);
      this.lightball.position.z = 100 * Math.cos(frame / 142);
      this.orangelight.position.copy(this.lightball.position);

      this.camera.position.x = 500 * Math.sin(frame / 100);
      this.camera.position.y = 200;
      this.camera.position.z = 500 * Math.cos(frame / 100);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }

    resize() {
      const scale = 1 / 2;
      this.renderTarget.setSize(16 * GU, 9 * GU);
      this.renderTargetColoring.setSize(16 * GU * scale, 9 * GU * scale);
    }

    render(renderer) {
      this.light.visible = true;
      this.ambientLight.visible = true;
      this.lightball.material.color.setHex(0xffffff);
      this.orangelight.color.setHex(0xffffff);
      this.orangelight.intensity = 1;
      renderer.setClearColor(new THREE.Color(0x000000), 0);
      super.render(renderer);

      this.light.visible = false;
      this.ambientLight.visible = false;
      this.lightball.material.color.setRGB(
          (0xff - 0xff) / 0xff, 
          (0xff - 0x9a) / 0xff,
          (0xff - 0x36) / 0xff);
      this.orangelight.color.setRGB(
          (0xff - 0xff) / 0xff, 
          (0xff - 0x9a) / 0xff,
          (0xff - 0x36) / 0xff);
      this.orangelight.intensity = 0.25;
      renderer.setClearColor(new THREE.Color(0x000000), 1);
      renderer.render(this.scene, this.camera, this.renderTargetColoring, true);
      this.outputs.renderColoring.setValue(this.renderTargetColoring.texture);
    }
  }

  global.iceberg = iceberg;
})(this);
