uniform float t;
uniform sampler2D tDiffuse;
uniform sampler2D overlay;
uniform float divisions;
uniform vec4 foregroundColor;
uniform vec4 backgroundColor;
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
    vec4 color;
    if (mod_angle > M_PI / (divisions * 2.)) {
        color = foregroundColor;
    } else {
        color = backgroundColor;
    }
    vec4 overlayColor = texture2D(overlay, vUv);
    gl_FragColor = mix(color, overlayColor, overlayColor.a);
}
