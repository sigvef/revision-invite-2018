uniform float t;
uniform float fadeOutT;
uniform float frame;
uniform float width;
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
uniform float cameraX;
uniform float cameraY;
uniform float cameraZoom;
uniform float cameraRotate;

varying vec2 vUv;

#define M_PI 3.1415926535897932384626433832795


vec2 rotate(vec2 point, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(point.x * c - point.y * s,
                point.x * s + point.y * c);
}

void main() {

    vec2 uv = vUv;

    uv -= 0.5;
    uv *= vec2(16., 9.) / 9.;

    uv -= vec2(cameraX, cameraY) / 9.;
    uv /= cameraZoom;
    uv = rotate(uv, cameraRotate);

    vec2 coords = (uv - origo);
    coords = rotate(uv, -frame * M_PI * 2. / 60. / 60. * 115. / divisions);

    float radius = length(coords);
    float angle = atan(coords.y / coords.x) + t + radius * radiusMultiplier;
    float mod_angle = mod(angle, M_PI / divisions);
    vec3 colorOne = foregroundColor;
    if (radius < thirdColorRadius) {
        if(frame < 4006.) {
            colorOne = backgroundColor;
        } else {
            colorOne = thirdColor;
        }
    }
    vec4 color = vec4(
            mix(mix(colorOne,
                    foregroundColor2,
                    step(mod(angle - 0.0, M_PI / divisions), M_PI / (divisions * 2.))
                   ),
                backgroundColor,
                step(mod_angle + 0.5 * (1. - width) * M_PI / divisions, M_PI / (divisions * 2.))), 1.);
    vec4 overlayColor = texture2D(overlay, vUv);
    vec4 overlay2Color = texture2D(overlay2, vec2(vUv.x, 1. - vUv.y));
    vec4 layer2Color = mix(color, overlayColor, overlayColor.a);
    gl_FragColor = mix(layer2Color, overlay2Color, overlay2Color.a);
    gl_FragColor = mix(gl_FragColor, vec4(0.), fadeOutT);

    vec4 nextSceneColor = texture2D(nextScene, vUv);
    if (nextSceneColor.r > 0.09) {
        gl_FragColor = texture2D(nextScene, vUv);
    }
}
