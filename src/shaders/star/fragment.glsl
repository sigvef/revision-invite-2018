uniform float t;
uniform sampler2D tDiffuse;
uniform float smallCircleRadius;
uniform float waveIndex;
uniform float angle;

varying vec2 vUv;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {
    gl_FragColor = vec4(1., .3, .1, 1.);

    vec2 normalized = vec2(vUv.x * 16. / 9., vUv.y);
    vec2 rotated = rotate2d(angle) * normalized;
    vec2 translated = mod(rotated + t / 10., 1.);

    float scale = 1.;
    if (mod(floor(translated.x * 10.) + floor(translated.y * 10.), 10.) == waveIndex) {
        scale = 1.4;
    }
    if (mod(abs(floor(translated.x * 10.) + floor(translated.y * 10.) - waveIndex), 10.) == 1.) {
        scale = 1.2;
    }

    vec2 coords = mod(translated * 10., 1.);
    if (distance(coords, vec2(.5)) < smallCircleRadius * scale) {
        gl_FragColor = vec4(1., 1., 1., 1.);
    }
    if (distance(coords, vec2(.5)) < smallCircleRadius / 3. * scale) {
        gl_FragColor = vec4(0., 0., 0., 1.);
    }
}
