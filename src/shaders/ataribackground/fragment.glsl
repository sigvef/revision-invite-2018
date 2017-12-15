uniform float frame;
uniform sampler2D walltexture;
uniform sampler2D texttexture;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

void main() {
    float gridSize = 0.3 / 1.5;
    float padding = gridSize / 10.0;
    float sliceWidth = gridSize / 10.0;
    vec2 uv = vUv;
    uv -= 0.5;
    uv *= vec2(16., 9.);
    uv.y += frame / 60.0;
    uv = mod(uv, gridSize);

    vec3 color = vec3(.0, .0, .0);
    vec2 centeredLocalUv = abs(uv - gridSize / 2.0);
    float maxDist = max(centeredLocalUv.x, centeredLocalUv.y);
    if (maxDist > gridSize / 5.0 && maxDist < gridSize / 2.5) {
        color = vec3(.05, .05, .05);
    }

    gl_FragColor = vec4(color, 5.);
}
