uniform float frame;

varying vec2 vUv;

float rand(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    float gridSize = 0.3 / 1.5;
    float padding = gridSize / 10.0;
    float sliceWidth = gridSize / 10.0;
    vec2 uv = vUv;
    uv -= 0.5;
    uv *= vec2(16., 9.);
    uv.y += frame / 60.0;
    uv = mod(uv, gridSize);

    float intensity = 1.0;
    float randomNoise = rand(vec2(vUv.x + frame * 0.0001, vUv.y + frame * 0.00001)) * 0.5;
    intensity += randomNoise;

    vec2 centeredLocalUv = abs(uv - gridSize / 2.0);
    float maxDist = max(centeredLocalUv.x, centeredLocalUv.y);
    if (!(maxDist > gridSize / 5.0 && maxDist < gridSize / 2.5)) {
        intensity *= 0.85;
    }

    vec3 greenColor = vec3(94., 112., 89.) / 255.;
    intensity *= 0.3;
    intensity = clamp(intensity, 0.0, 1.0);
    gl_FragColor = vec4(intensity * greenColor, 1.0);
}
