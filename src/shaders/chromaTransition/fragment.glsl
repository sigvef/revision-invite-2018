uniform float t;
uniform sampler2D A;
uniform sampler2D B;
uniform sampler2D chroma;

varying vec2 vUv;

void main() {
    vec4 colorA = texture2D(A, vUv);
    vec4 colorB = texture2D(B, vUv);
    vec4 colorChroma = texture2D(chroma, vUv);
    gl_FragColor = mix(colorA, colorB, colorChroma.a);
}
