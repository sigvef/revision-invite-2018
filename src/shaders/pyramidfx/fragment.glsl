uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

float rand(vec2 co){
        return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec2 uv = vUv;
    vec3 original = texture2D(tDiffuse, uv).rgb;

    vec2 fakeResolution = vec2(16., 9.) * 30.;
    vec2 pixelated = floor(uv * fakeResolution) / fakeResolution;
    vec2 sampler = vec2(pixelated.x + frame * 0.0001, pixelated.y + frame * 0.00001);
    vec3 epsilon = vec3(0.001, -0.001, 0.);
    float noise = (
        rand(sampler + epsilon.xx) +
        rand(sampler + epsilon.xy) +
        rand(sampler + epsilon.xz) +

        rand(sampler + epsilon.zx) +
        rand(sampler + epsilon.zy) +
        2. * rand(sampler + epsilon.zz) +

        rand(sampler + epsilon.yx) +
        rand(sampler + epsilon.yy) +
        rand(sampler + epsilon.yz)) / 10.;

    noise *= (1. - length((uv - 0.5) * vec2(16., 9.) / 9.));
    noise += 0.1;

    float vignette = (1. - length((uv - 0.5) * vec2(16., 9.) / 20.));

    float scanlines = 0.8 + max(0., abs(sin(uv.y * 3.14159265 * 2. * 576.))) * 0.2;

    vec3 color = (original + noise * 0.1) * vignette * scanlines;

    color = mix(color, pow(color, vec3(2.2)), vec3(0.2));

    gl_FragColor = vec4(color * 1.5, 1.);
}
