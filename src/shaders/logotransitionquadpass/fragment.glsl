uniform float frame;
uniform float yOffset;
uniform sampler2D logo;
uniform sampler2D scene;

varying vec2 vUv;

void main() {

    vec2 uv = vUv;
    uv.y = mod(uv.y + yOffset, 1.);
    vec4 sceneColor = texture2D(scene, uv);
    vec4 logoColor = texture2D(logo, uv);

    float t = (frame - 4601.) / (4632. - 4601.);
    float darkener = 1. - mix(0., 1., clamp(t, 0., 1.)) * 0.5;

    vec3 color = mix(sceneColor.rgb * darkener, logoColor.rgb, logoColor.a);

    gl_FragColor = vec4(color, 1.);
}
