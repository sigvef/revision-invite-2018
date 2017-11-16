uniform float frame;
uniform float pixelWidth;
uniform sampler2D tDiffuse;
uniform vec3 palette[8];
uniform float indexMatrix4x4[16];

varying vec2 vUv;

#define PALETTE_SIZE 8
#define EPSILON 1e-10

vec3 HUEtoRGB(float h) {
    float r = abs(h * 6. - 3.) - 1.;
    float g = 2. - abs(h * 6. - 2.);
    float b = 2. - abs(h * 6. - 4.);
    return clamp(vec3(r, g, b), 0., 1.);
}

vec3 HSLtoRGB(vec3 hsl) {
    vec3 rgb = HUEtoRGB(hsl.x);
    float c = (1. - abs(2. * hsl.z - 1.)) * hsl.y;
    return (rgb - 0.5) * c + hsl.z;
}


vec3 RGBtoHCV(vec3 rgb) {
    // Based on work by Sam Hocevar and Emil Persson
    vec4 p = (rgb.g < rgb.b) ? vec4(rgb.bg, -1.0, 2.0/3.0) : vec4(rgb.gb, 0.0, -1.0/3.0);
    vec4 q = (rgb.r < p.x) ? vec4(p.xyw, rgb.r) : vec4(rgb.r, p.yzx);
    float c = q.x - min(q.w, q.y);
    float h = abs((q.w - q.y) / (6. * c + EPSILON) + q.z);
    return vec3(h, c, q.x);
}

vec3 RGBtoHSL(vec3 rgb) {
    vec3 hcv = RGBtoHCV(rgb);
    float l = hcv.z - hcv.y * 0.5;
    float s = hcv.y / (1. - abs(l * 2. - 1.) + EPSILON);
    return vec3(hcv.x, s, l);
}


float indexValue() {
    int x = int(mod(vUv.x * pixelWidth, 4.));
    int y = int(mod(vUv.y * pixelWidth * 9. / 16., 4.));
    for(int i = 0; i < 16; i++) {
        if(i == x + y * 4) {
            return (indexMatrix4x4[i] + 0.5) / 16.;
        }
    }
}

float hueDistance(float h1, float h2) {
    float diff = abs((h1 - h2));
    return min(abs((1.0 - diff)), diff);
}

float hslDistance(vec3 hslA, vec3 hslB) {
    return pow((
        2.0 * pow(hueDistance(hslA.x, hslB.x), 2.0) +
        pow(abs(hslA.y - hslB.y), 2.0) +
        pow(abs(hslA.z - hslB.z), 2.0)), 0.5);
}

vec3 closestColors(vec3 hsl, bool trueIfClosestElseSecondClosest) {
    vec3 closest = vec3(-2, 0, 0);
    vec3 secondClosest = vec3(-2, 0, 0);
    vec3 temp;
    for (int i = 0; i < PALETTE_SIZE; ++i) {
        temp = palette[i];
        float tempDistance = hslDistance(temp, hsl);
        if (tempDistance < hslDistance(closest, hsl)) {
            secondClosest = closest;
            closest = temp;
        } else {
            if (tempDistance < hslDistance(secondClosest, hsl)) {
                secondClosest = temp;
            }
        }
    }
    if(trueIfClosestElseSecondClosest) {
        return closest;
    }
    return secondClosest;
}

vec3 dither(vec3 color) {
    vec3 hsl = RGBtoHSL(color);
    vec3 closestColor = closestColors(hsl, true);
    vec3 secondClosestColor = closestColors(hsl, false);
    float d = indexValue();
    float hslDiff = hslDistance(hsl, closestColor) /
                    hslDistance(closestColor, secondClosestColor);
    return HSLtoRGB(hslDiff < d ? closestColor : secondClosestColor);
}

void main() {
    vec2 uv = vUv * pixelWidth;
    uv.y = uv.y / 16. * 9.;
    uv = floor(uv);
    uv /= pixelWidth;
    uv.y = uv.y * 16. / 9.;
    vec3 color = texture2D(tDiffuse, uv).rgb;
    gl_FragColor = vec4(dither(color), 1.);
}

