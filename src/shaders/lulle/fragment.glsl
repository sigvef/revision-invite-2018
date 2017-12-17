uniform float frame;
uniform float BEAN;
uniform float BEAT;
uniform float numOfBalls;
uniform sampler2D tDiffuse;

#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

const int MAX_STEPS = 16;
const float EPS = 0.001;
const float END = 100.0;
const float START = 0.0;

const vec3 PINK = vec3(255., 73., 130.)/255.;
const vec3 GREY = vec3(55., 60., 63.)/255.;
const vec3 GREEN = vec3(119., 225., 130.)/255.;
const vec3 WHITE = vec3(255., 255., 255.)/255.;

vec2 smin(vec2 a, vec2 b, float k) {
    float h = clamp(0.5 + 0.5 * (b.x - a.x) / k, 0.0, 1.0);
    float material = mix(a.y, b.y, h);
    return vec2(mix(b.x, a.x, h) - k * h * (1.0 - h), material);
}

vec2 minmin(vec2 d1, vec2 d2) {
    float material = d1.y;
    if (d1.x > d2.x) {
        material = d2.y;
    }
    return vec2(smin(d1, d2, 1.).x, material);
}

float displace(vec3 p, float d1) {
    float d2 = 0.05*(1.-sin(20.*p.x))*(1.-cos(20.*p.y))*cos(20.*p.z-frame/60.);
    return d1+d2;
}

float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

float sphere(vec3 p, float s) {
    return length(p)-s;
}

vec2 sdf(in vec3 p) {
    float startBEAN = 1824. + 24.;
    float repeatSize = 15.;
    float repeatSizeY = repeatSize * .75;
    float offset = 0.;
    float loop = mod(BEAN - startBEAN, 24.);
    if (BEAN >= 2064. && BEAN < 2184.) {
        if (loop >= 6. && loop < 8.) offset = PI / 16.;
        if (loop >= 10. && loop < 12.) offset = PI / 16.;
        if (loop >= 18.) offset = PI / 8.;
    }
    
    p.x += repeatSize / 2. * step(repeatSizeY, mod(p.y + 5., repeatSizeY * 2.));
    p.x = mod(p.x + repeatSize / 2., repeatSize) - repeatSize / 2.;
    p.y = mod(p.y + repeatSizeY / 2., repeatSizeY) - repeatSizeY / 2.;

    if(frame < 4820.) {
        return vec2(999999., 1.);
    }

    float centerSize = 0.5 + cos(mod(BEAN - startBEAN, 48.) / 48. * PI) / 4.;
    vec2 s = vec2(sphere(p, centerSize * 1.5), 1.);

    for (float i = 0.; i < 24.; i++) {
        float circleIndex = floor(i / 8.0);
        float size =
            0.5 - circleIndex * 0.1 +
            cos(mod(-0.8 * (floor(i/8.) + 1.) + BEAN - startBEAN, 48.) / 48. * PI) / 4.;

        float radius = 1.5 + circleIndex;
        float angle = 2. * PI * i/8.;
        float visible = step(i+4., numOfBalls);
        float x = sin(angle + offset) * radius * visible;
        float y = cos(angle + offset) * radius * visible;
        vec2 a = vec2(sphere(p-vec3(x, y, 0.), size), 1.);
        s = minmin(s, a);
    }
    return s;
}

vec2 march(vec3 eye, vec3 dir, float s, float e) {
    float d = s;
    for (int i = 0; i < MAX_STEPS; i++) {
        vec2 res = sdf(eye + d * dir);
        if (res.x < EPS) {
            return vec2(d, res.y);
        }
        d += res.x;
        if (d >= e) {
            return vec2(e, .0);
        }
    }
    return vec2(e, .0);
}

vec3 rayDir(float fov, vec2 uv) {
    vec2 xy = uv * 2.0 - 1.0;
    xy.y = xy.y / (16.0 / 9.0);
    float z = 2.0 / tan(radians(fov / 2.0));
    return normalize(vec3(xy, -z));
}

vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
                sdf(vec3(p.x + EPS, p.yz)).x - sdf(vec3(p.x - EPS, p.yz)).x,
                sdf(vec3(p.x, p.y + EPS, p.z)).x - sdf(vec3(p.x, p.y - EPS, p.z)).x,
                sdf(vec3(p.xy, p.z + EPS)).x - sdf(vec3(p.xy, p.z - EPS)).x
                ));
}


vec3 phongContribForLight(vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye,
        vec3 lightPos, vec3 lightIntensity) {
    vec3 N = estimateNormal(p);
    vec3 L = normalize(lightPos - p);
    vec3 V = normalize(eye - p);
    vec3 R = normalize(reflect(-L, N));

    float dotLN = dot(L, N);
    float dotRV = dot(R, V);

    if (dotLN < 0.0) {
        return vec3(0.0, 0.0, 0.0);
    } 

    if (dotRV < 0.0) {
        return lightIntensity * (k_d * dotLN);
    }
    return lightIntensity * (k_d * dotLN + k_s * pow(dotRV, alpha));
}

vec3 phongIllumination(vec3 k_a, vec3 k_d, vec3 k_s, float alpha, vec3 p, vec3 eye) {

    vec3 pos = p;
    vec3 nor = estimateNormal(p);
    vec3 rd = eye;
    vec3 ref = reflect( rd, nor );
    vec3  lig = normalize( vec3(-0.4, 0.7, -0.6) );
    float amb = clamp( 0.5+0.5*nor.y, 0.0, 1.0 );
    float dif = clamp( dot( nor, lig ), 0.0, 1.0 );
    float bac = clamp( dot( nor, normalize(vec3(-lig.x,0.0,-lig.z))), 0.0, 1.0 )*clamp( 1.0-pos.y,0.0,1.0);
    float fre = pow( clamp(1.0+dot(nor,rd),0.0,1.0), 2.0 );
    float spe = pow(clamp( dot( ref, lig ), 0.0, 1.0 ),16.0);

    vec3 lin = vec3(0.0);
    lin += 1.30*dif*vec3(1.00,0.80,0.55);
    lin += 2.00*spe*vec3(1.00,0.90,0.70)*dif;
    lin += 0.40*amb*vec3(0.40,0.60,1.00);
    lin += 0.50*bac*vec3(0.25,0.25,0.25);
    lin += 0.25*fre*vec3(1.00,1.00,1.00);
    vec3 color = k_a * lin;

    return color;
}

vec4 background(vec2 uv) {
    return texture2D(tDiffuse, mod(uv * vec2(16., 9.) / 16. * 2., 1.));
    float intensity = 0.;
    intensity = (1. + floor(sin(uv.x * 100. + frame/100.) + sin(uv.y * 50.)));
    vec3 color = GREY;
    intensity = intensity * (1. + floor(1. + sin(mod(BEAN, 12.)/12.)));
    return vec4(color*(0.4 + 0.2 * intensity), 1.);
}

void main() {
    float eyez = 20.;

    if (BEAN > 2040.) {
        eyez = min((BEAN - 2000.)/2., 95.); 
    }
    if (frame > 5728.) {
        eyez = mix(95., 1., clamp((frame - 5729.) / (5750. - 5728.), 0.0, 1.0));
    }

    vec3 eye = vec3(0.0, 0.0, eyez);
    vec3 dir = rayDir(60.0, vUv);

    vec2 res = march(eye, dir, START, END);

    vec3 color = vec3(.0);
    if (res.x >= END-EPS) {
        color = background((vUv + vec2(-.5, frame / 800.)) * (1. + (frame - 4726.) / 1000.)).xyz;
    } else {
        vec3 p = eye + dir * res.x;
        color = mix(WHITE, WHITE, res.y - 1.);
        color = phongIllumination(color, color, normalize(vec3(1.0, 1.0, 1.0)), 10.0, p, eye);
    }

    vec2 uv = (vUv - 0.5) * 2.;
    color *= 0.75 + (1. - abs(uv.x * uv.y)) * 0.25;

    gl_FragColor = vec4(color, 1.0);
}
