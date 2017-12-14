uniform float frame;
uniform sampler2D walltexture;
uniform sampler2D texttexture;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

void main() {

    vec2 uv = vUv;
    uv -= 0.5;
    uv *= vec2(16., 9.) / 16.;

    float light = 1.;
    vec2 grid = uv * 8.;
    light *= abs(sin(grid.x * PI * 2.));
    light *= abs(cos(PI + grid.y * PI * 2.));
    light = pow(light, .1);

    vec3 color = texture2D(walltexture, vUv).xyz * 2.;
    color = mix(color, texture2D(texttexture, vUv).xyz, texture2D(texttexture, vUv).a);
    color *= light;

    color *= 0.9;
    color += 0.1;

    gl_FragColor = vec4(color, 1.);
}
