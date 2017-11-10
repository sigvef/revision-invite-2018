uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

const int MAX_STEPS = 64;
const float EPS = 0.001;
const float END = 100.0;
const float START = 0.0;

float displace(vec3 p, float d1) {
    float d2 = 0.05*(1.-sin(20.*p.x))*(1.-cos(20.*p.y))*cos(20.*p.z-frame/60.);
    return d1+d2;
}

float sphere(vec3 p, float s) {
    return length(p)-s;
}

float sdf(in vec3 p) {
    float sphere1 = sphere(p-vec3(sin(frame/60.),cos(frame/60.), 0.0), 1.5);
    float sphere2 = displace(p, sphere1);
    return sphere2;
}

float march(vec3 eye, vec3 dir, float s, float e) {
    float d = s;
    for (int i = 0; i < MAX_STEPS; i++) {
        float dist = sdf(eye + d * dir);
        if (dist < EPS) {
            return d;
        }
        d += dist;
        if (d >= e) {
            return e;
        }
    }
    return e;
}

vec3 rayDir(float fov, vec2 uv) {
    vec2 xy = uv * 2.0 - 1.0;
    xy.y = xy.y / (16.0 / 9.0);
    float z = 2.0 / tan(radians(fov / 2.0));
    return normalize(vec3(xy, -z));
}

vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
        sdf(vec3(p.x + EPS, p.yz)) - sdf(vec3(p.x - EPS, p.yz)),
        sdf(vec3(p.x, p.y + EPS, p.z)) - sdf(vec3(p.x, p.y - EPS, p.z)),
        sdf(vec3(p.xy, p.z + EPS)) - sdf(vec3(p.xy, p.z - EPS))
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
    
    vec3 light1Pos = vec3(4.0, 2.0, 50.0);
    //vec3 light1Pos = vec3(0.0, 9.0, -50.0 + 9.0 * cos(frame / 90.));
    //vec3 light1Pos = vec3(0.0, 1.0*frame/100.0, 30.0*frame/2000.0);
    vec3 light1Intensity = vec3(0.5, 0.5, 0.5);
    
    vec3 phongContrib = phongContribForLight(k_d, k_s, alpha, p, eye, light1Pos, light1Intensity);
    color += phongContrib;
    
    vec3 light2Pos = vec3(0.0, 0.0, 10.0);
    vec3 light2Intensity = vec3(0.2, 0.2, 0.2);
    
    phongContrib = phongContribForLight(k_d, k_s, alpha, p, eye, light2Pos, light2Intensity);
    color +=  phongContrib;
    
    return color;
}


void main() {
    vec3 eye = vec3(0.0, 0.0, 10.0);
    vec3 dir = rayDir(60.0, vUv);
    
    float dist = march(eye, dir, START, END);

    if (dist >= END-EPS) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.2);
        return;
    }

    vec3 p = eye + dir * dist;

    vec3 color = vec3(vUv, 0.5 + 0.5 * sin(frame / 60.0));
    color = phongIllumination(color, color, vec3(1.0, 1.0, 1.0), 10.0, p, eye);

    gl_FragColor = vec4(color, 1.0);

}
