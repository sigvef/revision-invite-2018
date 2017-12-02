uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec3 orange = vec3(1., 149. / 255., 35. / 255.);
    vec4 color = vec4(0.);

    /*
    float size = 0.5; 
    float colorSize = 0.05;
    float period = 30.;
    float fadeValue = max(
        0., (sin(uv.y * period - frame * 0.2) - (1. - size)) / size);
    float colorValue = max(
        0., (sin(uv.y * period - frame * 0.2) - (0.98 - colorSize)) / colorSize);

    color.rgb = mix(orange.rgb, orange.rgb * 5., vec3(colorValue));
    color.a = mix(0., 1., fadeValue);
    */

    if(sin(uv.y * 70. - frame / 5.) > 0.95) {
        color = vec4(orange, 0.2);
    }

    float lineWidth = 0.01;
    if(uv.x > 1. - lineWidth) {
        color = vec4(orange, 1.);
    }
    if(uv.y < lineWidth) {
        color = vec4(orange, 1.);
    }
    if(uv.x > 0.5 - lineWidth && uv.x < 0.5 + lineWidth) {
        color = vec4(orange, 1.);
    }
    if(uv.x > 0.25 - lineWidth && uv.x < 0.25 + lineWidth) {
        color = vec4(orange, 1.);
    }
    if(uv.x > 0.75 - lineWidth && uv.x < 0.75 + lineWidth) {
        color = vec4(orange, 1.);
    }

    float height = 0.1 + (frame - 5759.) / (5822. - 5759.) * 0.9; 
    color.a *= step(uv.y, height);

    gl_FragColor = color;
}
