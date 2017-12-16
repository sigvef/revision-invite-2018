uniform sampler2D A;
uniform sampler2D B;
uniform sampler2D text;

varying vec2 vUv;

void main() {
    vec4 color = texture2D(text, vUv);
    if (color.r > 0.25 && color.b < 0.25) {
        gl_FragColor = texture2D(B, vUv);
    } else if (color.b > 0.25 && color.r < 0.25) {
        gl_FragColor = texture2D(A, vUv);
    } else {
        gl_FragColor = color;
    }
}
