uniform float t;
uniform sampler2D A;
uniform sampler2D B;

varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(A, vUv);
    if (t > 0. && t > vUv.x) {
        gl_FragColor = texture2D(B, vec2(vUv.x - 1. + t, vUv.y));
    }
}
