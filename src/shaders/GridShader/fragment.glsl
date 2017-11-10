uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec2 pos = vUv * vec2(16.0, 9.0) - vec2(8.0, 4.5);
    vec4 originalColor = texture2D(tDiffuse, vUv);

    vec3 black = vec3(.0, .0, .0);
    vec3 gray = vec3(55.0, 60.0, 63.0) / 255.0;
    vec3 neonGreen = vec3(0.0, 244.0, 79.0) / 255.0;

    vec3 color = originalColor.rgb;

    float margin = 0.05;
    vec2 modpos = mod(pos + vec2(sin(frame / 60.0), cos(frame / 60.0)), 0.2);
    if (modpos.x < margin || modpos.y < margin) {
        color = black;
    } else {
        color *= neonGreen;
    }

    //color += gray;
    gl_FragColor = vec4(color, 1.0);
}
