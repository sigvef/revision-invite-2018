// shoutout to the great IQ! https://www.shadertoy.com/view/Xds3zN

uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

#define PI 3.141592653589793238462643383279

// primitives

float sdPlane(vec3 p) {
  return p.y;
}

float sdSphere(vec3 p, float size) {
    return length(p) - size;
}

float sdCylinder(vec3 p, vec2 h) {
    vec2 d = abs(vec2(length(p.xz), p.y)) - h;
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float sdTriPrism(vec3 p, vec2 h) {
    vec3 q = abs(p);
    float d1 = q.z - h.y;
    float d2 = max(q.x * 0.866025 + p.y * 0.5, -p.y) - h.x * 0.5;
    return length(max(vec2(d1, d2), 0.0)) + min(max(d1, d2), 0.);
}

// operations

// Union
vec2 opU(vec2 d1, vec2 d2) {
    return d1.x > d2.x ? d2 : d1;
}

// Subtract
float opS(float d1, float d2) {
    return max(-d2, d1);
}

// Cheap bend
vec3 opCheapBend(vec3 p)
{
    float c = cos(.5*p.y);
    float s = sin(.5*p.y);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*p.xy,p.z);
    return q;
}

// Rotation
mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0,
            oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0,
            oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c, 0.0,
            0.0, 0.0, 0.0, 1.0);
}

// framework

vec2 map(in vec3 pos) {
    // crown start
    vec2 res = opU(vec2(sdPlane(pos), 1.0),
                   vec2(
                       opS(sdCylinder(pos-vec3(.0, .0, .0), vec2(1., 1.)),
                           sdCylinder(pos-vec3(.0, .0, .0), vec2(.8, 2.))
                           )
                   , 66.0)
                   );
    // bumps on crown
    int numOfBumps = 8;
    for(int i = 0; i < 8; ++i) {
        //pos = (rotationMatrix(vec3(0., 1., 0.), PI/2.) * vec4(pos, 1.)).xyz;
        vec3 bumpPos = vec3(sin(float(i) / float(numOfBumps)*2.0*PI)*0.9,
                            1.25,
                            cos(float(i) / float(numOfBumps)*2.0*PI)*0.9
                            );
        res = opU(res,
                  vec2(sdTriPrism(opCheapBend(
                          (rotationMatrix(vec3(0., 1., 0.), (
                            PI * 2. * float(i) / float(numOfBumps)
                            )) *  vec4(pos-bumpPos, 1.)).xyz),
                          vec2(.5, .1)),
                      88.0)
                  );
    }
    // crown end

    return res;
}

vec2 castRay(in vec3 ro, in vec3 rd) {
    float tmin = .1;
    float tmax = 20.0;

    // iterate to target
    float t = tmin;
    float m = -1.0;
    for(int i = 0; i < 64; i++) {
        float precis = 0.0005 * t;
        vec2 res = map(ro + rd * t);
        if(res.x < precis || t > tmax) {
            break;
        }

        t += res.x;
        m = res.y;
    }

    if(t > tmax) {
        m = -1.0;
    }

    return vec2(t, m);
}

float softshadow(in vec3 ro, in vec3 rd, in float mint, in float tmax) {
    float res = 1.0;
    float t = mint;
    for(int i = 0; i < 16; i++) {
        float h = map(ro + rd*t).x;
        res = min(res, 8.0 * h / t);
        t += clamp(h, 0.02, 0.10);
        if(h < 0.001 || t > tmax) {
            break;
        }
    }
    return clamp(res, 0.0, 1.0);
}

vec3 calcNormal(in vec3 pos) {
    vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
    return normalize(e.xyy*map(pos + e.xyy).x +
                     e.yyx*map(pos + e.yyx).x +
                     e.yxy*map(pos + e.yxy).x +
                     e.xxx*map(pos + e.xxx).x);
}

float calcAO(in vec3 pos, in vec3 nor) {
    float occ = 0.0;
    float sca = 1.0;
    for(int i = 0; i < 5; i++) {
        float hr = 0.01 + 0.12 * float(i) / 4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = map(aopos).x;
        occ += -(dd - hr) * sca;
        sca *= 0.95;
    }
    return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
}

vec3 render(in vec3 ro, in vec3 rd) {
    vec3 col = vec3(0.7, 0.9, 1.0) + (rd.y * 0.8);
    vec2 res = castRay(ro, rd);
    float t = res.x;
    float m = res.y;

    if(m>-.5) {
        vec3 pos = ro + rd*t;
        vec3 nor = calcNormal(pos);
        vec3 ref = reflect(rd, nor);

        // material
        col = 0.45 + 0.35 * sin(vec3(0.05, 0.08, 0.10) * (m - 1.0));
        if(m < 1.5) {
            float f = mod(floor(5.0*pos.z) + floor(5.0*pos.x), 2.0);
            col = 0.3 + 0.1*f*vec3(1.0);
        }

        // lighitng
        float occ = calcAO(pos, nor);
        vec3  lig = normalize(vec3(-0.4, 0.7, -0.6));
        float amb = clamp(0.5 + 0.5 * nor.y, 0.0, 1.0);
        float dif = clamp(dot(nor, lig), 0.0, 1.0);
        float bac = clamp(dot(nor, normalize(vec3(-lig.x, 0.0, -lig.z))), 0.0, 1.0 ) * clamp(1.0-pos.y, 0.0, 1.0);
        float dom = smoothstep(-0.1, 0.1, ref.y);
        float fre = pow(clamp(1.0 + dot(nor, rd), 0.0, 1.0), 2.0);
        float spe = pow(clamp(dot(ref, lig), 0.0, 1.0), 16.0);

        dif *= softshadow(pos, lig, 0.02, 2.5);
        dom *= softshadow(pos, ref, 0.02, 2.5);

        vec3 lin = vec3(0.0);
        lin += 1.30 * dif * vec3(1.00, 0.80, 0.55);
        lin += 2.00 * spe * vec3(1.00, 0.90, 0.70) * dif;
        lin += 0.40 * amb * vec3(0.40, 0.60, 1.00) * occ;
        lin += 0.50 * dom * vec3(0.40, 0.60, 1.00) * occ;
        lin += 0.50 * bac * vec3(0.25, 0.25, 0.25) * occ;
        lin += 0.25 * fre * vec3(1.00, 1.00, 1.00) * occ;
        //col = col*lin;

        // mix
        col = mix(col, vec3(0.8, 0.9, 1.0), 1.0 - exp(-0.0002 * t * t * t));
    }

    return vec3(clamp(col, 0.0, 1.0));
}

mat3 setCamera(in vec3 ro, in vec3 ta, float cr) {
    vec3 cw = normalize(ta - ro);
    vec3 cp = vec3(sin(cr), cos(cr), 0.0);
    vec3 cu = normalize(cross(cw, cp));
    vec3 cv = normalize(cross(cu, cw));

    return mat3(cu, cv, cw);
}

void main() {
    float time = 15.0 + frame / 1000. * 60.;
    vec3 tot = vec3(0.0);

    vec2 p = (vUv - 0.5) * 2.;

    // camera
    #if 1
    vec3 ro = 3. * vec3( -0.5+3.5*cos(0.1*time), 2.0, 0.5 + 4.0*sin(0.1*time) );
    #else
    vec3 ro = 3. * vec3( -0.5+3.5*cos(0.1), 2.0, 0.5 + 4.0*sin(0.1) );
    #endif
    vec3 ta = vec3( -0.5, -0.4, 0.5 );

    // camera-to-world transform
    mat3 ca = setCamera(ro, ta, 0.0);

    // ray direction
    vec3 rd = ca * normalize(vec3(p.xy, 2.0));

    // render
    vec3 col = render(ro, rd);

    // gamma
    col = pow(col, vec3(0.4545));

    tot = col;

    gl_FragColor = vec4(tot, 1.0);
}
