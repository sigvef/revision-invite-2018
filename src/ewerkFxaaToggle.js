(function(global) {
  class ewerkFxaaToggle extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        },
        inputs: {
          fxaa: new NIN.TextureInput(),
          noFxaa: new NIN.TextureInput()
        }
      });

    }

    beforeUpdate() {
      let selectedOutput;
      if(BEAN < 94){
        selectedOutput = this.inputs.noFxaa;
      }else{
        selectedOutput = this.inputs.fxaa;
      }

      this.outputs.render.setValue(selectedOutput.getValue());

    }
  }

  global.ewerkFxaaToggle = ewerkFxaaToggle;
})(this);
