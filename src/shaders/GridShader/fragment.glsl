uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec4 additive = vec4(vUv, 0.5 + 0.5 * sin(frame / 60.0), .1);
    gl_FragColor = texture2D(tDiffuse, vUv) + additive;
}
