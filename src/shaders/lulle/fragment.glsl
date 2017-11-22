uniform float frame;
uniform sampler2D tDiffuse;

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

float sphere(vec3 p, float s) {
    return length(p)-s;
}

float boxy(vec3 p, vec3 b) {
    return length(max(abs(p)-b, .0));
}

float repBox(vec3 p, vec3 c) {
    vec3 q = mod(p, c)-.5*c;
    vec3 boxCoord = floor(p / vec3(4.0, 4.0, 6.0));
    float box = boxy(q, vec3(1.5, 1.5, 1.5));
    return box;
}

float twist(vec3 p) {
    float c = cos(20.0*p.y);
    float s = sin(20.0*p.y);
    mat2 m = mat2(c, -s, s, c);
    vec3 q = vec3(m*p.xz, p.y);
    return sphere(q, 1.5);
}

vec2 sdf(in vec3 p) {
    float sphere1 = sphere(p-vec3(sin(frame/60.),cos(frame/60.), 0.0), 1.5);
    float sphere3 = twist(p-vec3(sin(frame/60.),cos(frame/60.), 0.0));
    float sphere2 = displace(p*0.6, sphere3);
    float reps = repBox(p, vec3(12.0));
    return minmin(vec2(sphere2, 1.0), vec2(reps,2.0));
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
    
    vec3 light1Pos = vec3(4.0, 2.0, 50.0);
    vec3 light1Intensity = vec3(0.5, 0.5, 0.5);
    
    vec3 phongContrib = phongContribForLight(k_d, k_s, alpha, p, eye, light1Pos, light1Intensity);
    color += phongContrib;
    
    vec3 light2Pos = vec3(0.0, 0.0, 10.0);
    vec3 light2Intensity = vec3(0.2, 0.2, 0.2);
    
    phongContrib = phongContribForLight(k_d, k_s, alpha, p, eye, light2Pos, light2Intensity);
    color +=  phongContrib;
   
    color *= 2.;
    color = floor(color);
    color /= 2.;
    return color;
}


void main() {
    vec3 eye = vec3(0.0, 0.0, 10.0);
    vec3 dir = rayDir(60.0, vUv);
    
    vec2 res = march(eye, dir, START, END);

    if (res.x >= END-EPS) {
        gl_FragColor = vec4(55./255., 60./255., 63./255., 1.);
        return;
    }

    vec3 p = eye + dir * res.x;

    vec3 color = vec3(.0);
    if (res.y > 1.5) {
        color = vec3(.0, 224./255., 79./255.);
    } else {
        color = vec3(255./255., 73./255., 130./255.);
    }
    color = phongIllumination(color, color, vec3(1.0, 1.0, 1.0), 10.0, p, eye);
    
    gl_FragColor = vec4(color, 1.0);

}
