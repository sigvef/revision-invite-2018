uniform sampler2D tDiffuse;
uniform float frame;

varying vec2 vUv;
varying vec4 globalPosition;
varying vec3 vNormal;

void main() {
    vUv = uv;
    vNormal = normalMatrix * normal;
    vec3 alteredPosition = position;

    float amount = sin(frame / 20. + position.x * 999. + position.y * 9999. + position.z * 99999.) * 0.01;
    alteredPosition *= 1. + amount;

    globalPosition = projectionMatrix * modelViewMatrix * vec4(alteredPosition, 1.0);
    gl_Position = globalPosition;
}
