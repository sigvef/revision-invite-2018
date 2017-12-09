uniform float t;
uniform sampler2D overlay;
uniform sampler2D overlay2;
uniform sampler2D nextScene;
uniform float divisions;
uniform vec3 foregroundColor;
uniform vec3 foregroundColor2;
uniform vec3 backgroundColor;
uniform vec3 thirdColor;
uniform float thirdColorRadius;
uniform float radiusMultiplier;
uniform vec2 origo;

varying vec2 vUv;

#define M_PI 3.1415926535897932384626433832795

void main() {
    vec2 coords = (vUv - origo);
    coords.x = coords.x * 16. / 9.;
    float radius = length(coords);
    float angle = atan(coords.y / coords.x) + t + radius * radiusMultiplier;
    float mod_angle = mod(angle, M_PI / divisions);
    vec3 colorOne = foregroundColor;
    if (radius < thirdColorRadius) {
        colorOne = thirdColor;
    }
    vec4 color = vec4(
            mix(mix(colorOne,
                    foregroundColor2,
                    step(mod(angle - 0.05, M_PI / divisions), M_PI / (divisions * 2.))
                   ),
                backgroundColor,
                step(mod_angle, M_PI / (divisions * 2.))), 1.);
    vec4 overlayColor = texture2D(overlay, vUv);
    vec4 overlay2Color = texture2D(overlay2, vec2(vUv.x, 1. - vUv.y));
    vec4 layer2Color = mix(color, overlayColor, overlayColor.a);
    gl_FragColor = mix(layer2Color, overlay2Color, overlay2Color.a);

    if (overlay2Color.rgb == vec3(0., 0., 1.)) {
        gl_FragColor = texture2D(nextScene, vUv);
    }
}
