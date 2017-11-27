uniform float r;
uniform float g;
uniform float b;
uniform float a;
uniform float percentage;

varying vec2 vUv;


void main() {
    if(vUv.x > percentage) {
        discard; 
    }
    gl_FragColor = vec4(r, r, r, a);
}
