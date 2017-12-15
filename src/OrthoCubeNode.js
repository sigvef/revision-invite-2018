(function(global) {
    class OrthoCubeNode extends NIN.ShaderNode {
        constructor(id, options) {
            super(id, options);
            this.kickThrob = 0;
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

            var lastBeanFrame = FRAME_FOR_BEAN(BEAN);
            var nextBeanFrame = FRAME_FOR_BEAN(BEAN+1);

            var f = (frame - lastBeanFrame)/(nextBeanFrame - lastBeanFrame)
            console.log(f);
            var interBean = lerp(BEAN, BEAN+1, f);
            var beat = (interBean - 240.0)/12.0;
            var rotX = 0.0;
            var rotY = 0.0;
            var rotZ = 0.0;
            var cubeSize = 2.0;

            //Pre-scene
            if(beat < 0.0){ //Pre-scene (begins at 208)
            }


            //PART 1
            else if(beat < 1.0){
                //spin right
                rotZ = 0.5 * Math.PI * easeOut(0.0, 1.0, (beat - 0.0)/1.0);
            }else if(beat < 2.0){
                //pause
            }else if(beat < 3.0){
                //spin left
                rotZ = -0.5 * Math.PI * easeOut(0.0, 1.0, (beat - 3.0)/1.0);
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
            else if(beat < 14.5){
                rotY = 1.5 * Math.PI * easeOut(0.0, 1.0, (beat - 11.5)/3.0);
                rotX = rotY;
            }

            //PART 4 (with wooo)
            else if(beat < 12.5){

            }
            else if(beat < 13.0){

            }
            else if(beat < 13.5){

            }
            else if(beat < 14.0){

            }
            else if(beat < 14.5){

            }
            else if(beat < 15.0){
            }
            else if(frame < 1120.0){
                cubeSize += 2.0 * Math.sin((frame - 1097.0)/(1125.0 - 1097.0) * 2.0 * Math.PI);
            }else{
                cubeSize = 0.0;
            }

            this.uniforms.cubeSize.value = cubeSize;
            this.uniforms.rotX.value = rotX;
            this.uniforms.rotY.value = rotY;
            this.uniforms.rotZ.value = rotZ;
        }
    }
    global.OrthoCubeNode = OrthoCubeNode;
})(this);

