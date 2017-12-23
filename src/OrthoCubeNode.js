(function(global) {
    class OrthoCubeNode extends NIN.ShaderNode {
        constructor(id, options) {
            super(id, options);
            this.kickThrob = 0.0;
        }

        warmup(renderer) {
          this.update(673);
          this.render(renderer);
        }

        update(frame) {
            demo.nm.nodes.bloom.opacity = 0;
            this.kickThrob *= 0.8;
            if(BEAN % 12 == 0) {
                this.kickThrob = 1;
            }

            this.uniforms.kickThrob.value = this.kickThrob;
            this.uniforms.frame.value = frame;
            this.uniforms.BEAN.value = BEAN;

            let lastBeanFrame = FRAME_FOR_BEAN(BEAN);
            let nextBeanFrame = FRAME_FOR_BEAN(BEAN+1);

            let f = (frame - lastBeanFrame)/(nextBeanFrame - lastBeanFrame)
            let interBean = lerp(BEAN, BEAN+1, f);
            let beat = (interBean - 240.0)/12.0; 
            //let beat = (INTERBEAN - 240.0)/12.0; For new nin
            let rotX = 0.0;
            let rotY = 0.0;
            let rotZ = 0.0;
            let cubeSize = 2.1;

            //Pre-scene
            if(beat < 0.0){ //Pre-scene (begins at 208)
                cubeSize = elasticOut(0, 2.1, 1.0, clamp(0, (beat + 2 / 12 + 1.0)/1.0, 1));
            }


            //PART 1
            else if(beat < 1.0){
                //spin right
                rotZ = 0.5 * Math.PI * easeOut(0.0, 1.0, (beat - 0.0)/1.0);
            }else if(beat < 2.0){
                //pause
            }else if(beat < 3.0){
                //spin left
                rotZ = -0.5 * Math.PI * easeOut(0.0, 1.0, (beat - 2.0)/1.0);
            }else if(beat < 4.0){
            }


            //PART 2
            else if(beat < 5.0){
                rotY = 0.5 * Math.PI * easeOut(0.0, 1.0, (beat - 4.0)/1.0);
            }
            else if(beat < 6.0){ //hold for a beat and a half
                //pause
            }
            else if(beat < 7.0){  //half beat for a half spin
                rotX = 0.5 * Math.PI * easeOut(0.0, 1.0, (beat - 6.0)/1.0);
            }
            else if(beat < 8.0){
                //pause
            }


            //PART 3 (With lead)
            //Leads: 8.0, 8.75, 10.0, 10.75, 11.5
            else if(beat < 8.5){
                rotX = -0.25 * Math.PI * easeOut(0.0, 1.0, (beat - 8.0)/0.5);
            }
            else if(beat < 8.75){
                rotX = -0.25 * Math.PI;
            }
            else if(beat < 9.5){
                rotX = -0.25 * Math.PI * easeOut(1.0, 2.0, (beat - 8.75)/0.75);
            }
            else if(beat < 10.0){

            }
            else if(beat < 10.25){
                rotY = -0.25 * Math.PI * easeOut(0.0, 1.0, (beat - 10.0)/0.25);
            }
            else if(beat < 10.75){
                rotY = -0.25 * Math.PI;
            }
            else if(beat < 11.0){
                rotY = -0.25 * Math.PI * easeOut(1.0, 2.0, (beat - 10.75)/0.25);
            }
            else if(beat < 11.5){
            }
            else if(beat < 14.0){
                rotY = (1 + 0.25) * Math.PI * easeOut(0.0, 1.0, (beat - 11.5)/2.5);
                rotX = (1 + 0.19591111) * Math.PI * easeOut(0.0, 1.0, (beat - 11.5)/2.5);
            }

            //PART 4 (with wooo)
            else if(beat <= 15.0){
                rotY = 0.25 * Math.PI;
                rotX = 0.19591111 * Math.PI;
            }
            else if(beat <= 15.25){
                rotY = 0.25 * Math.PI;
                rotX = 0.19591111 * Math.PI;
                cubeSize += easeOut(0, 1.1, (beat - 15.0)/0.25);
            }else if(beat <= 15.75){
                rotY = 0.25 * Math.PI;
                rotX = 0.19591111 * Math.PI;
                cubeSize += 1.1 - easeOut(0, 3.2, (beat - 15.5)/0.5);
            }else{
                cubeSize = 0;
            }

            this.uniforms.cubeSize.value = cubeSize;
            this.uniforms.rotX.value = rotX;
            this.uniforms.rotY.value = rotY;
            this.uniforms.rotZ.value = rotZ;
        }
    }
    global.OrthoCubeNode = OrthoCubeNode;
})(this);

