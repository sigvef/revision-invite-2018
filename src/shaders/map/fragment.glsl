uniform float t;
uniform sampler2D A;
uniform sampler2D B;
uniform sampler2D C;
uniform sampler2D D;

varying vec2 vUv;

void main() {
    vec4 colorA = vec4(0., 1., 0., 1.);
    vec2 coordsB = vec2(vUv.x * 3. - 1.12, vUv.y * 3. - 0.99);
    vec4 colorB = texture2D(B, coordsB);
    vec2 coordsC = vec2(vUv.x * 2. - 0.685, vUv.y * 2. - 0.48);
    vec4 colorC = texture2D(C, coordsC);
    vec2 coordsD = vec2(vUv.x * 1. - 0.03, vUv.y * 1.);
    vec4 colorD = texture2D(D, coordsD);
    vec4 colorE = vec4(.216, .235, .247, 1.);
    if (t <= 1.0) {
        gl_FragColor = mix(colorA, colorB, t);
    } else if (t <= 2.0) {
        gl_FragColor = mix(colorB, colorC, t - 1.);
    } else if (t <= 3.0) {
        gl_FragColor = mix(colorC, colorD, t - 2.);
    } else {
        gl_FragColor = mix(colorD, colorE, t - 3.);
    }
}
