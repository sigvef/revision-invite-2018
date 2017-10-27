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
    uv *= 20. * (0.5 + color * 0.5);
    float gap = mod(uv.x + uv.y * 16. / 9., 1.);
    if(gap > color * 0.5) {
        return 1.;
    }
    return 0.;
}

void main() {
    vec3 color = texture2D(tDiffuse, vUv).rgb;
    float greyscale = (color.r + color.g + color.b) / 3.; 
    float pattern = diagonals(vUv, greyscale);
    gl_FragColor = vec4(vec3(pattern), 1.);
}
