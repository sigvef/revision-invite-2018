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
    vec4 pink = vec4(255. / 255., 73. / 255., 130. / 255., 1.);
    vec4 green = vec4(119. / 255., 225. / 255., 93. / 255., 1.);

    float fadeIn = clamp(t / 2., 0., 1.);

    vec2 mod_uv = mod(vUv / 5. + 0. * vec2(frame / 8000., frame / 12000.), 0.05);
    vec4 color = mix(pink, vec4(1., 1., 1., 1.), fadeIn * .6 * step(mod_uv.x, .01));
    color = mix(color, vec4(1., 1., 1., 1.), fadeIn * .6 * step(mod_uv.y, .01));
    vec2 small_stripe_vUv = rotate(vUv / 2., M_PI / 4.) + 0. * vec2(frame / 8000., frame / 12000.);
    vec2 mod_uv2 = mod(small_stripe_vUv / 5., 0.05);
    color = mix(color, green, fadeIn * .5 * step(mod_uv2.x, .003));
    color = mix(color, green, fadeIn * .5 * step(mod_uv2.y, .003));

    color *= .9;

    gl_FragColor = vec4(color);
}
