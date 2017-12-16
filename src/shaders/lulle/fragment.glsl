uniform float frame;
uniform float BEAN;
uniform float BEAT;
uniform sampler2D tDiffuse;

#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

const int MAX_STEPS = 64;
const float EPS = 0.001;
const float END = 100.0;
const float START = 0.0;

vec2 minmin(vec2 d1, vec2 d2) {
    if (d1.x > d2.x) {
        return d2;
    }
    return d1;
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

float torus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xy)-t.x, p.z);
    return length(q)-t.y;
}

float hex(vec3 p, vec2 h) {
    vec3 q = abs(p);
    return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);
}

vec2 sdf(in vec3 p) {
    vec2 ar[8];
    float n = 0.;
    vec3 q = vec3(0.);
    vec2 s = vec2(sphere(p, 0.), 1.);
    float startBEAN = 1824.;
    ar[0] = vec2(0., 1.5);
    ar[1] = vec2(1., 1.);
    ar[2] = vec2(1.5, 0.);
    ar[3] = vec2(1., -1.);
    ar[4] = vec2(0., -1.5);
    ar[5] = vec2(-1., -1.);
    ar[6] = vec2(-1.5, 0.);
    ar[7] = vec2(-1., 1.);

    float centerSize = 0.5 + cos(mod(BEAN - startBEAN, 12.) / 12. * PI) / 4.;
    s = vec2(sphere(p, centerSize * 1.5), 1.);
    n = (BEAN-startBEAN)/12.;

    for (float i = 0.; i < 32.; i++) {
        if (i > n) {break;}
        vec2 a = vec2(0.);
        if (i <= 7.) {
            float size = 0.5 + cos(mod(-0.8 * (floor(i/8.) + 1.) + BEAN - startBEAN, 24.) / 24. * PI) / 4.;
            a = vec2(sphere(p-vec3(ar[int(i)], 0.), size), 2.);
        }
        if (i > 7. && i < 16.) {
            float size = 0.5 + cos(mod(-.8 * (floor(i/8.) + 1.) + BEAN - startBEAN, 24.) / 24. * PI) / 4.;
            a = vec2(sphere(p-vec3((ar[int(mod(i, 8.))])*1.75, 0.), size-0.1), 1.);
        }
        if (i > 15. && i < 24.) {
            float size = 0.5 + cos(mod(-.8 * (floor(i/8.) + 1.) + BEAN - startBEAN, 24.) / 24. * PI) / 4.;
            a = vec2(sphere(p-vec3((ar[int(mod(i, 8.))])*2.25, 0.), size-0.2), 2.);
        }
        if (i > 23. && i < 32.) {
            float size = 0.5 + cos(mod(-.8 * (floor(i/8.) + 1.) + BEAN - startBEAN, 24.) / 24. * PI) / 4.;
            a = vec2(sphere(p-vec3((ar[int(mod(i, 8.))])*2.75, 0.), size-0.3), 1.);
        }
        s = minmin(a, s);
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
    const vec3 ambientLight = 0.5 * vec3(1.0, 1.0, 1.0);
    vec3 color = ambientLight * k_a;

    vec3 light1Pos = vec3(0.0, 0.0, 10.0);
    vec3 light1Intensity = vec3(0.5, 0.5, 0.5);

    vec3 phongContrib = phongContribForLight(k_d, k_s, alpha, p, eye, light1Pos, light1Intensity);
    color += phongContrib;

    vec3 light2Pos = vec3(0.0, 0.0, 10.0);
    vec3 light2Intensity = vec3(0.2, 0.2, 0.2);

    //phongContrib = phongContribForLight(k_d, k_s, alpha, p, eye, light2Pos, light2Intensity);
    //color +=  phongContrib;

    // color *= 2.;
    // color = floor(color);
    //color /= 2.;
    return color;
}


void main() {
    vec3 eye = vec3(0.0, 0.0, 20.0);
    vec3 dir = rayDir(60.0, vUv);

    vec2 res = march(eye, dir, START, END);

    if (res.x >= END-EPS) {
        gl_FragColor = vec4(55./255., 60./255., 63./255., 1.);
        return;
    }

    vec3 p = eye + dir * res.x;

    vec3 color = vec3(.0);
    if (res.y == 2.) {
        color = vec3(.0, 224./255., 79./255.);
    } else if (res.y == 3.) {
        color = vec3(255., 255., 0.);
    } else {
        color = vec3(255./255., 73./255., 130./255.);
    }
    color = phongIllumination(color, color, vec3(1.0, 1.0, 1.0), 10.0, p, eye);

    gl_FragColor = vec4(color, 1.0);

}
