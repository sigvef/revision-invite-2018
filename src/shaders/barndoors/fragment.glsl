uniform float openAmount;
uniform sampler2D A;
uniform sampler2D B;

varying vec2 vUv;

void main() {
    if (vUv.x < .5) {
        vec2 projected = vec2(
            vUv.x / openAmount,
            .5 + (vUv.y - .5) / (1.0 - vUv.x / openAmount * (1. - openAmount))
        );
        if (projected.y < 0. || projected.y > 1. || projected.x < 0. || projected.x > 0.5) {
            gl_FragColor = texture2D(B, vUv);
        } else {
            gl_FragColor = texture2D(A, projected);
        }
    } else {
        vec2 projected = vec2(
            1. - (1. - vUv.x) / openAmount,
            .5 + (vUv.y - .5) / (1.0 - (1.0 - vUv.x) / openAmount * (1. - openAmount))
        );
        if (projected.y < 0. || projected.y > 1. || projected.x < 0.5 || projected.x > 1.) {
            gl_FragColor = texture2D(B, vUv);
        } else {
            gl_FragColor = texture2D(A, projected);
        }
    }
}
