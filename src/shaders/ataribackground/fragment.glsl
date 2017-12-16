uniform float frame;

varying vec2 vUv;

float rand(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    float gridSize = 0.3 / 1.5 * 4.;
    float padding = gridSize / 10.0;
    float sliceWidth = gridSize / 10.0;
    vec2 uv = vUv;
    uv -= 0.5;
    uv *= vec2(16., 9.);
    uv.y += frame / 30.0;
    uv.x += frame / 30.0;
    uv = mod(uv, gridSize);

    float intensity = 1.0;
    float randomNoise = rand(vec2(vUv.x + frame * 0.0001, vUv.y + frame * 0.00001));
    intensity *= (0.8 + randomNoise * 0.3);

    vec2 centeredLocalUv = abs(uv - gridSize / 2.0);
    float maxDist = max(centeredLocalUv.x, centeredLocalUv.y);
    if (!(maxDist > gridSize / 5.0 && maxDist < gridSize / 2.5)) {
        intensity *= 0.9;
    }
    intensity *= 1.;

    vec3 greenColor = vec3(55., 60., 63.) / 255.;
    intensity = clamp(intensity, 0.0, 1.0);
    gl_FragColor = vec4(intensity * greenColor, 1.0);
}
