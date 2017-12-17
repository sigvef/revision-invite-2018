uniform float frame;
uniform sampler2D A;
uniform sampler2D B;

varying vec2 vUv;

void main() {
    vec4 A = texture2D(A, vUv);
    vec4 B = texture2D(B, vUv);

    gl_FragColor = mix(B, A, A.a);
}
