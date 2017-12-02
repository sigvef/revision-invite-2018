uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec3 orange = vec3(153. / 255., 224. / 255., 182. / 255.) * 0.5;
    vec4 color = vec4(orange * 0.1, 1.);

    float lineWidth = 0.01;
    if(uv.y < 0. + lineWidth) {
        color = vec4(orange, 1.);
    }

    if(uv.y > 1. - lineWidth) {
        color = vec4(orange, 1.);
    }

    if(uv.x < 0. + lineWidth) {
        color = vec4(orange, 1.);
    }

    if(uv.x > 1. - lineWidth) {
        color = vec4(orange, 1.);
    }

    gl_FragColor = color;
}
