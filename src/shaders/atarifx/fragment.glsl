uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

#define PI 3.14159265

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {

    float mixer = pow(clamp((frame - 2271.) / 10., 0., 1.), 4.);
    mixer = 1.;

    vec2 uv;
    vec3 color;

    /* tv frame */
    uv = vUv;
    uv = (uv - 0.5) * mix(2., 2.4, mixer);
    
    float squircleAmount = mix(9999., 12., mixer);
    float squircle = pow(abs(uv.x), squircleAmount) + pow(abs(uv.y), squircleAmount);
    if(squircle > 1.) {
        float squircleHighlight = pow(abs(uv.x - 0.005), squircleAmount) +
                                  pow(abs(uv.y + 0.015), squircleAmount);

        color = vec3(55. + 100. * sin(uv.x + 5. * uv.y), 60., 63.) / 255. * 0.5;

        color = vec3(52., 29., 8.) / 255. / 4. * 
            (1. - 0.2 * (1. + vec3(sin(uv.x * 16. * 16. * 2.) - sin(2. * uv.y * 16. * 9.))));

        color += 0.2 * mix(vec3(0.), vec3(1.), clamp(vec3(1.35 - squircleHighlight), 0., 1.));

        float light = length(uv * vec2(16., 9.)  + vec2(-15.9, 8.9));
        color = mix(color, vec3(119., 225., 93.) / 255. * 2., 1. - clamp(-0.2 + light / 0.2 * 2., 0., 1.));

        for(float i = 0.; i < 2.9; i+=1.) {
            vec2 shadowUv = uv + vec2(0.002, -0.002);
            float shadow = length(shadowUv * vec2(16., 9.)  +
                                  vec2(-15. + i * 1.5, 10.0));
            color = mix(color, vec3(0.1) * 2., 1. - step(.51, shadow));

            vec2 knobUv = uv * vec2(16., 9.)  + vec2(-15. + i * 1.5, 10.0);
            float knob = length(knobUv);
            color = mix(color, vec3(0.02) * 2., 1. - step(.5, knob));
            color *= 0.5 + 0.5 * clamp(15. * knob, 0., 1.);

        }

        color *= 2.;

    } else {
        /* lens distortion */
        uv *= mix(1., 0.95, mixer);
        float len = length(uv);
        uv = uv * mix(1., len, len * 0.05 * mixer);

        vec4 originalColor = texture2D(tDiffuse, uv / 2. + 0.5);
        color = originalColor.xyz;

        /* vignette */
        vec2 vignetteUv = uv * 0.75;
        color *= mix(1., (1. - abs(vignetteUv.x * vignetteUv.y) * .75), mixer);

        /* screen glare */
        color += mixer * 0.05 * (mix(
                0.,
                1.,
                clamp(
                    -100. + 100. * 2. * ((vUv.y - 0.5) + 0.5 * sin(0.75 * PI / 2. + vUv.x * PI / 4.)),
                    0., 1.)

                ) * mix(
                0.,
                1.,
                2. * ((vUv.y - 0.5) + 0.5 * sin(0.75 * PI / 2. + vUv.x * PI / 4.))));

        /* screen shadows */
        float shadowSquircle = pow(abs(uv.x - 0.075), squircleAmount) +
                               pow(abs(uv.y + 0.075), squircleAmount);
        color = color * (1. - shadowSquircle * .7);


        /* noise */
        float noise = rand(vec2(vUv.x + frame * 0.0001, vUv.y + frame * 0.00001));
        color += mixer * noise * 0.1;

        /* scanlines */
        vec2 scanLinesUv = uv / 2.;
        float intensity = (1. + sin(scanLinesUv.y * 3.14159265 * 2. * 176.)) * 0.5;
        color *= mix(1., 1. - intensity * 0.1, mixer);
    }


    /* outer vignette */
    vec2 vignetteUv2 = (vUv - 0.5) * 1.75;
    color *= mix(1., (1. - abs(vignetteUv2.x * vignetteUv2.y) * .75), mixer);

    /* color grading */
    color = mix(color, pow(color, vec3(1.25)), vec3(mixer));

    gl_FragColor = vec4(color, 1.);
}
