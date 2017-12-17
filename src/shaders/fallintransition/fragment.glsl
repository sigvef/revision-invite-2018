uniform float t;
uniform sampler2D A;
uniform sampler2D B;

varying vec2 vUv;

void main() {
    gl_FragColor = texture2D(A, vUv);
    if (vUv.y + t > 0. && vUv.y + t < 1.) {
        gl_FragColor = texture2D(B, vec2(vUv.x, vUv.y + t));
    }
}
