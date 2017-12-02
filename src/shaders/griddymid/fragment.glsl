uniform float frame;
uniform float upper;
uniform float lower;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec3 orange = vec3(227. / 255., 82. / 255., 175. / 255.);
    vec4 color = vec4(0.);

    if(sin(uv.y * 70. - frame / 5.) > 0.95) {
        color = vec4(orange, 0.2);
    }

    float lineWidth = 0.005;
    if(uv.y < 0.02 + lineWidth) {
        color = vec4(orange, 1.);
    }

    if(uv.x > 0.25 - lineWidth && uv.x < 0.25) {
        color = vec4(orange, 1.);
    }
    if(uv.x > 0.5 - lineWidth && uv.x < 0.5) {
        color = vec4(orange, 1.);
    }
    if(uv.x > 0.75 - lineWidth && uv.x < 0.75) {
        color = vec4(orange, 1.);
    }
    if(uv.x > 1. - lineWidth && uv.x < 1.) {
        color = vec4(orange, 1.);
    }
    if(uv.x > 0. && uv.x < 0.25 && (uv.x - 0.) * 4. < uv.y + lineWidth * 4.) {
        color = vec4(orange, 1.);
    }
    if(uv.x > 0.25 && uv.x < 0.5 && (uv.x - 0.25) * 4. < uv.y + lineWidth * 4.) {
        color = vec4(orange, 1.);
    }
    if(uv.x > 0.5 && uv.x < 0.75 && (uv.x - 0.5) * 4. < uv.y + lineWidth * 4.) {
        color = vec4(orange, 1.);
    }
    if(uv.x > 0.75 && ((uv.x - 0.75) * 4.) < uv.y + lineWidth * 4.) {
        color = vec4(orange, 1.);
    }

    if(uv.y > 0.85) {
        color = vec4(orange, 1.);
    }

    color *= step(uv.y, upper);
    color *= 1. - step(uv.y, lower);

    gl_FragColor = color;
}
