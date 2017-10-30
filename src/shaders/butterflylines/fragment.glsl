uniform float r;
uniform float g;
uniform float b;
uniform float percentage;

varying vec2 vUv;


void main() {
    if(vUv.x > percentage) {
        discard; 
    }
    gl_FragColor = vec4(vec3(r, g, b), 1.);
}
