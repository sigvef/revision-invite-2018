uniform float t;
uniform sampler2D A;
uniform sampler2D B;

varying vec2 vUv;

void main() {
    vec4 colorA = texture2D(A, vUv);
    vec4 colorB;
    if (t > 0.0) {
        colorB = texture2D(B, vUv);
    } else {
        colorB = vec4(55./255., 60./255., 63./255., 1.);
    }
    gl_FragColor = mix(colorB, vec4(colorA.rgb, 1.0), colorA.a);
}
