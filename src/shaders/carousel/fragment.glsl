uniform float t;
uniform sampler2D tDiffuse;
uniform sampler2D overlay;
uniform float divisions;
uniform vec3 foregroundColor;
uniform vec3 backgroundColor;
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
    vec4 color = vec4(
            mix(foregroundColor,
                backgroundColor,
                step(mod_angle, M_PI / (divisions * 2.))), 1.);
    vec4 overlayColor = texture2D(overlay, vUv);
    gl_FragColor = mix(color, overlayColor, overlayColor.a);
}
