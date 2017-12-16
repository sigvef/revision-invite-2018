uniform float frame;
uniform float t;

varying vec2 vUv;

#define M_PI 3.1415926535897932384626433832795

vec2 rotate(vec2 point, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(point.x * c - point.y * s,
                point.x * s + point.y * c);
}

void main() {
    vec4 pink = vec4(175. / 255., 50. / 255., 89. / 255., 1.);
    pink *= clamp(1. + t / 5., 0., 1.5);
    vec4 green = vec4(119. / 255., 225. / 255., 93. / 255., 1.);

    float fadeIn = clamp(t / 2., 0., 1.);

    vec2 mod_uv = mod(vUv + vec2(frame / 8000., frame / 12000.), 0.05);
    vec4 color = mix(pink, vec4(1., 1., 1., 1.), fadeIn * .6 * step(mod_uv.x, .01));
    color = mix(color, vec4(1., 1., 1., 1.), fadeIn * .6 * step(mod_uv.y, .01));
    vec2 small_stripe_vUv = rotate(vUv, M_PI / 4.) + vec2(frame / 5000., frame / 8000.);
    vec2 mod_uv2 = mod(small_stripe_vUv, 0.05);
    color = mix(color, green, fadeIn * .5 * step(mod_uv2.x, .003));
    color = mix(color, green, fadeIn * .5 * step(mod_uv2.y, .003));
    gl_FragColor = vec4(color);
}
