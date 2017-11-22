uniform float frame;
uniform sampler2D tDiffuse;
uniform vec4 foregroundColor;
uniform vec4 backgroundColor;

varying vec2 vUv;

void main() {
    vec4 color;
    float total = floor(vUv.x * 40. * 16. / 9.) + floor(vUv.y * 40.);
    if (mod(total, 2.) == 0.0) {
        color = foregroundColor;
    } else {
        color = backgroundColor;
    }
    gl_FragColor = color;
}
