uniform float t;
uniform sampler2D A;
uniform sampler2D B;

varying vec2 vUv;

#define start_clock 3693.
#define start_expand 3724.
#define end_expand 3756.
#define circle_diameter 0.3832 // <- 25 minutes of math....                 JK, tried random numbers and picked the one that looked best.
#define PI 3.14159

void main()
{
    vec4 colorA = texture2D(A, vUv);
    vec4 colorB = texture2D(B, vUv);

    float spin_progess = (t - start_clock) / (start_expand - start_clock);
    spin_progess = max(min(spin_progess, 1.), 0.);
    float expand_progess = (t - start_expand) / (end_expand - start_expand);
    float radius = circle_diameter;
    float alpha = 0.;

    if (t > start_expand)
    {
      radius = circle_diameter + expand_progess * (1. - circle_diameter);
    }


    //if( distance(vUv / vec2(9./16., 1.) - vec2(0.25 * 16. / 9., 0.), vec2(.5, .5)) < 0.5)
    if( distance((vUv - vec2(0.5, 0.)) / vec2(9. / 16., 1.), vec2(0., .5)) < radius)
    {
      alpha = atan((vUv.x - .5) * 16. / 9., vUv.y - .5) / (PI * 2.);// + (mod(t, 100.)) / 100.);
      alpha = mod(alpha, 1.);

      alpha = alpha - 1. + spin_progess * 2.;
      alpha = (alpha - .5) * 10.;
    }

    gl_FragColor = mix(colorA, colorB, max(min(alpha, 1.), 0.));
}
