uniform float t;
uniform sampler2D A;
uniform sampler2D B;

varying vec2 vUv;

#define start_hole 7690.  // frame number
#define end_hole 7710.  // frame  number

void main()
{
    vec4 colorA = texture2D(A, vUv);
    vec4 colorB = texture2D(B, vUv);
    float alpha = 0.;

    float expand_progess =  1.0 - (t - start_hole) / (end_hole - start_hole);
    float radius = expand_progess;

    if(distance((vUv - vec2(0.5, 0.)) / vec2(9. / 16., 1.), vec2(0., .5)) < radius) {
        alpha = 0.0;
    } else {
        alpha = 1.0;
    }

    gl_FragColor = mix(colorA, colorB, max(min(alpha, 1.), 0.));
}
