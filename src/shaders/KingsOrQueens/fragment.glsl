// shoutout to the great IQ! https://www.shadertoy.com/view/Xds3zN

uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

// primitives

float sdPlane(vec3 p) {
  return p.y;
}

float sdSphere(vec3 p, float size) {
    return length(p) - size;
}

// operations

vec2 opU(vec2 d1, vec2 d2) {
    return d1.x > d2.x ? d2 : d1;
}

// framework

vec2 map(in vec3 pos) {
    vec2 res = opU(vec2(sdPlane(pos), 1.0),
                   vec2(sdSphere(pos-vec3(.0, 1.5, .0), 1.5), 366.0)
                   );
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

vec3 calcNormal(in vec3 pos) {
    vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
    return normalize(e.xyy*map(pos + e.xyy).x +
                     e.yyx*map(pos + e.yyx).x +
                     e.yxy*map(pos + e.yxy).x +
                     e.xxx*map(pos + e.xxx).x);
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

        // lighting

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
    #if 0
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
