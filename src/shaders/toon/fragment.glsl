uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

float diagonal_one(vec2 uv) {
   uv *= 200.;
   return floor(1. + sin(uv.x)); 
}

float diagonal_two(vec2 uv) {
   uv *= 300.;
   return floor(1. + sin(uv.y)); 
}

float diagonal_three(vec2 uv) {
   uv *= 400.;
   return floor(1. + sin(uv.y + uv.x)); 
}

float diagonal_four(vec2 uv) {
   uv *= 500.;
   return floor(1. + sin(uv.y * uv.x)); 
}

float diagonals(vec2 uv, float color) {
    uv *= 30. * (0.5 + color * 0.5);
    float gap = mod(uv.x + uv.y * 16. / 9., 1.);
    if(gap > (-0.1 + color * 0.5)) {
        return 1.;
    }
    return 0.;
}

float readGreyscale(vec2 uv) {
    vec4 color = texture2D(tDiffuse, uv);
    return (color.r + color.g + color.b) / 3. * color.a; 
}

void main() {
    float delta = 0.003;
    vec2 aspect = vec2(9., 16.) / 16.;
    float left = readGreyscale(vUv - vec2(delta, 0.) * aspect);
    float right = readGreyscale(vUv + vec2(delta, 0.) * aspect);
    float up = readGreyscale(vUv - vec2(0., delta * aspect));
    float down = readGreyscale(vUv + vec2(0., delta) * aspect);
    float greyscale = readGreyscale(vUv);
    float pattern = diagonals(vUv, greyscale);
    if(left < delta) {
        pattern = 0.;
    }
    if(right < delta) {
        pattern = 0.;
    }
    if(up < delta) {
        pattern = 0.;
    }
    if(down < delta) {
        pattern = 0.;
    }
    if(left < delta) {
        pattern = 0.;
    }

    if(left < delta && right < delta && up < delta && down < delta) {
        pattern = 1.;
    }

    vec3 lightColor = vec3(1., 249. / 255., 225. / 255.);
    vec3 darkColor = vec3(16. / 255., 11. / 255., 8. / 255.);

    gl_FragColor = vec4(mix(darkColor, lightColor, pattern), 1.);
}
