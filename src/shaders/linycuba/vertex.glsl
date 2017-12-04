uniform sampler2D tDiffuse;
uniform float frame;

varying vec2 vUv;
varying vec4 globalPosition;
varying vec3 vNormal;

void main() {
    vUv = uv;
    vNormal = normalMatrix * normal;
    globalPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = globalPosition;
}
