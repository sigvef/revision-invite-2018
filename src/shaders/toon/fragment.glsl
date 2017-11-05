uniform float frame;
uniform sampler2D tDiffuse;
uniform sampler2D coloring;

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
    float lineWidth = max(0., -0.1 + (1. - color) * 0.5);
    vec2 aspectCorrection = vec2(16., 9.) / 16.;
    uv *= aspectCorrection;
    uv *= 100.;
    float gap = mod(uv.x + uv.y + lineWidth * 0.5, 1.);
    if(gap > lineWidth) {
        return 1.;
    }
    return 0.;
}

float readGreyscale(vec2 uv) {
    vec4 color = texture2D(tDiffuse, uv);
    return (color.r + color.g + color.b) / 3. * color.a; 
}

float quantize(float value, float steps) {
    return floor(value * (steps + 1.)) / (steps);
}

bool floatEquals(float a, float b, float threshold) {
    return abs(a - b) <= threshold;
}

void main() {
    float quantizeValue = 99999.;
    float delta = 0.003;
    vec2 aspect = vec2(9., 16.) / 16.;
    float left = readGreyscale(vUv - vec2(delta, 0.) * aspect);
    float right = readGreyscale(vUv + vec2(delta, 0.) * aspect);
    float up = readGreyscale(vUv - vec2(0., delta) * aspect);
    float down = readGreyscale(vUv + vec2(0., delta) * aspect);
    float center = readGreyscale(vUv);
    float quantizedLeft = quantize(left, quantizeValue);
    float quantizedRight = quantize(right, quantizeValue);
    float quantizedUp = quantize(up, quantizeValue);
    float quantizedDown = quantize(down, quantizeValue);
    float quantizedCenter = quantize(center, quantizeValue);

    float pattern = diagonals(vUv, quantizedCenter);
    float floatCompareThreshold = 0.2;
    if(!floatEquals(quantizedLeft, quantizedCenter, floatCompareThreshold)) {
        pattern = 0.;
    }
    if(!floatEquals(quantizedRight, quantizedCenter, floatCompareThreshold)) {
        pattern = 0.;
    }
    if(!floatEquals(quantizedUp, quantizedCenter, floatCompareThreshold)) {
        pattern = 0.;
    }
    if(!floatEquals(quantizedDown, quantizedCenter, floatCompareThreshold)) {
        pattern = 0.;
    }

    vec4 originalColor = texture2D(tDiffuse, vUv);
    if(originalColor.a < 0.1) {
        pattern = 1.;
    }

    vec4 color = texture2D(coloring, vUv);

    vec3 lightColor = vec3(1., 249. / 255., 225. / 255.);
    vec3 darkColor = vec3(55. / 255., 60. / 255., 63. / 255.);

    gl_FragColor = vec4((1. - (1.0 * color.rgb)) * mix(darkColor, lightColor, pattern), 1.);
}
