uniform float t;
uniform sampler2D A;
uniform sampler2D B;

varying vec2 vUv;

#define start_clock 1
#define start_expand 3724.
#define end_expand 3756.

void main() {
    vec4 colorA = texture2D(A, vUv);
    vec4 colorB = texture2D(B, vUv);

    float alpha = (t - start_expand) / (end_expand - start_expand);

    if (t < start_expand)
    {
      alpha = 0.;
    }

    if (t > end_expand)
    {
      alpha = 1.;
    }

    gl_FragColor = mix(colorA, colorB, alpha);
}
