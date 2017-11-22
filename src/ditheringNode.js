(function(global) {
  class ditheringNode extends NIN.ShaderNode {
    constructor(id, options) {
      const optionsClone = {
        ...options,
      }
      optionsClone.inputs = {};
      optionsClone.inputs.tDiffuse = new NIN.TextureInput();
      super(id, optionsClone);
      this.uniforms.indexMatrix4x4.value = [
        0,  8,  2,  10,
        12, 4,  14, 6,
        3,  11, 1,  9,
        15, 7,  13, 5];
      const gray = new THREE.Color(55 / 255, 60 / 255, 63 / 255).getHSL();
      const pink = new THREE.Color(255 / 255, 73 / 255, 130 / 255).getHSL();
      const green = new THREE.Color(0x00 / 255, 0xe0 / 255, 0x4f / 255).getHSL();
      const white = green;
      this.uniforms.palette.value = [
        gray.h, gray.s, gray.l,
        pink.h, pink.s, pink.l,
        green.h, green.s, green.l,
        white.h, white.s, white.l];

      for(let i = 0; i < 4; i++) {
        let color = new THREE.Color(green);
        color.lerp(pink, (i + 1) / 6);
        let hsl = color.getHSL();
        this.uniforms.palette.value.push(hsl.h);
        this.uniforms.palette.value.push(hsl.s);
        this.uniforms.palette.value.push(hsl.l);
      }
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      this.uniforms.pixelWidth.value = 128;
      demo.nm.nodes.bloom.opacity = 0.2;
    }
  }

  global.ditheringNode = ditheringNode;
})(this);
