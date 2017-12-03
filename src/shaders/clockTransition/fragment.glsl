uniform float t;
uniform sampler2D A;
uniform sampler2D B;

varying vec2 vUv;

#define start_clock 1
#define start_expand 3724.
#define end_expand 3756.
#define circle_diameter 0.3832 // <- 25 minutes of math....                 JK, tried random numbers and picked the one that looked best.

void main()
{
    vec4 colorA = texture2D(A, vUv);
    vec4 colorB = texture2D(B, vUv);

    float alpha = 0.;//(t - start_expand) / (end_expand - start_expand);

    if (t < start_expand)
    {
      alpha = 0.;
    }

    if (t > end_expand)
    {
      alpha = 1.;
    }

    //if( distance(vUv / vec2(9./16., 1.) - vec2(0.25 * 16. / 9., 0.), vec2(.5, .5)) < 0.5)
    if( distance((vUv - vec2(0.5, 0.)) / vec2(9. / 16., 1.), vec2(0., .5)) < 0.3832)
    {
      alpha = 1.;
    }

    gl_FragColor = mix(colorA, colorB, alpha);
}
