uniform float frame;
uniform float translationOverX;
uniform float translationUnderX;
uniform sampler2D tDiffuse;
uniform sampler2D overlay;

varying vec2 vUv;

void main() {
    vec4 overlaySample = texture2D(overlay, vUv + vec2(translationOverX, 0.));
    vec4 tDiffuseSample = texture2D(tDiffuse, vUv + vec2(translationUnderX, 0.));
    gl_FragColor = vec4(mix(
        tDiffuseSample.rgb,
        overlaySample.rgb,
        overlaySample.a), 1.);
}
