uniform float t;
uniform sampler2D A;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(A, vUv);
    gl_FragColor = mix(color, vec4(0., 0., 0., 1.), t);
}
