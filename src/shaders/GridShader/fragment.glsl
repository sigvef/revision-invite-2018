uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec2 pos = vUv * vec2(16.0, 9.0) - vec2(8.0, 4.5);
    vec4 originalColor = texture2D(tDiffuse, vUv);

    vec4 color = originalColor;
        //vec4(vUv, 0.5 + 0.5 * sin(frame / 60.0), .1);

    //vec4 additive = vec4(vUv, 0.5 + 0.5 * sin(frame / 60.0), .1);
    if (mod(pos.x + frame / 80.0, 1.0) < 0.1 || mod(pos.y + frame / 100.0, 1.0) < 0.1) {
        color = vec4(0.0);
    } else {
        color += vec4(sin(frame / 20.) / 2.0 + 0.50, .0, .0, .0);
    }

    gl_FragColor = color;
}
