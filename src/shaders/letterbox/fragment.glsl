uniform float frame;
uniform float amount;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(tDiffuse, vUv);

    if(vUv.y > (9. - amount) / 9.) {
        color = vec4(55. / 255., 60. / 255., 63. / 255., 1.);
    }
    if(vUv.y < amount * 1. / 9.) {
        color = vec4(55. / 255., 60. / 255., 63. / 255., 1.);
    }

    gl_FragColor = color;
}
