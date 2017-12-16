precision mediump float; // or lowp
#define M_PI 3.1415926535897932384626433832795

uniform float frame;
uniform float BEAN;
uniform float kickThrob;
uniform float rotX;
uniform float rotY;
uniform float rotZ;
uniform float cubeSize;
uniform sampler2D tDiffuse; 
varying vec2 vUv;

const int MAX_MARCHING_STEPS = 128;
const float EPSILON = 0.001;
const float END = 100.0;
const float START = 0.0;

float uni(float d1, float d2) {
    return min(d1, d2);
}

float sub(float d1, float d2) {
    return max(-d1, d2);
}

float inter(float d1, float d2) {
    return max(d1, d2);
}

float sphere(vec3 p, float s) {
    return length(p)-s;
}


vec2 sphereCube(vec3 p, float sphereSize, float gap){
    float d = END + EPSILON;
    float minD = d;
    float cD = 0.0;
    float oID = 1.0;
    float currentID = 0.0;
    for(float x = -1.0; x <= 1.0; x++){
        for(float y = -1.0; y <= 1.0; y++){
            for(float z = -1.0; z <= 1.0; z++){
                cD = sphere((p-vec3(x*gap, y*gap, z*gap)), sphereSize);
                if(cD < d){
                    d = cD;
                    currentID = oID;
                }
                oID = oID + 1.0;
            }
        }
    }
    return vec2(d, currentID);
}

mat4 rotateX(float theta) {
    float c = cos(-theta);
    float s = sin(-theta);

    return mat4(
            vec4(1, 0, 0, 0),
            vec4(0, c, -s, 0),
            vec4(0, s, c, 0),
            vec4(0, 0, 0, 1)
            );
}
mat4 rotateY(float theta) {
    float c = cos(-theta);
    float s = sin(-theta);

    return mat4(
            vec4(c, 0, s, 0),
            vec4(0, 1, 0, 0),
            vec4(-s, 0, c, 0),
            vec4(0, 0, 0, 1)
            );
}
mat4 rotateZ(float theta) {
    float c = cos(-theta);
    float s = sin(-theta);

    return mat4(
            vec4(c, -s, 0, 0),
            vec4(s, c, 0, 0),
            vec4(0, 0, 1, 0),
            vec4(0, 0, 0, 1)
            );
}

vec2 sdf(vec3 p) {
    vec3 cubeP = p;

    cubeP = (rotateX(rotX) * vec4(p, 1.0)).xyz;
    cubeP = (rotateY(rotY) * vec4(cubeP, 1.0)).xyz;
    cubeP = (rotateZ(rotZ) * vec4(cubeP, 1.0)).xyz;

    float sphereSize = 0.6;

    if(BEAN >= 240.0){
        sphereSize += 0.15 * kickThrob;
    }
    vec2 distoid = sphereCube(cubeP, sphereSize, cubeSize);
    return distoid;
}


//Returns vec4(depth, objectID, numberOfSteps)
vec3 march(vec3 eye, vec3 dir, float start, float end) {
    float depth = start;
    float closestDist = END;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        vec2 distoid = sdf(eye + depth * dir);
        float dist = distoid.x;
        if(dist < closestDist){
            closestDist = dist;
        }
        if (dist < EPSILON) {
            return vec3(depth, distoid.y, i);
        }
        depth+=dist;
        if (depth >= end) {
            return vec3(end, 0.0, i);;
        }
    }
    return vec3(end, 0.0, MAX_MARCHING_STEPS);
}

vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
        sdf(vec3(p.x + EPSILON, p.yz)).x - sdf(vec3(p.x - EPSILON, p.yz)).x,
        sdf(vec3(p.x, p.y + EPSILON, p.z)).x - sdf(vec3(p.x, p.y - EPSILON, p.z)).x,
        sdf(vec3(p.xy, p.z + EPSILON)).x - sdf(vec3(p.xy, p.z - EPSILON)).x
    ));
}

void main() {
    vec3 color1 = vec3(255.0/255.0, 73.0/255.0, 130.0/255.0);
    vec3 color2 = vec3(119.0/255.0, 225.0/255.0, 93.0/255.0);
    vec3 white  = vec3(1.0, 1.0, 1.0);
    vec3 dark   = vec3(55.0/255.0, 60.0/255.0, 63.0/255.0);

    //vec3 pos = vec3(cos(frame/20.0)*10.0, 5.0, sin(frame/20.0)*10.0);
    vec3 pos = vec3(0.0, 0.0, -10.0);
    vec3 dir = normalize(-pos);

    vec2 propUV = vUv - vec2(0.5, 0.5);
    propUV = propUV * vec2(16, 9);

    //NOTE: Math assumes camera is always pointing in Z+
    //do not rotate the camera without fixing math
    vec3 eye = pos + vec3(propUV, 0.0);

    vec3  distOid = march(eye, dir, START, END);
    float dist = distOid.x;

    vec3 color;

    if (dist >= END-EPSILON) {
        color = dark;
    }else{
        float oID = distOid.y;

        vec3 p = eye + dir * dist;
        vec3 normal = estimateNormal(p);
        float fresnell = abs(dot(dir,normal));

        if(fresnell < 0.5){ //border!
            color = dark; 
        }else{
            float beat = (BEAN - 240.0)/12.0;
            color = mod(oID, 2.0) == 0.0 ? white : color2;

            //Morph to white at the end
            color += vec3(1.0, 1.0, 1.0) * pow(max(0.0 , (beat-15.0) * 2.0), 2.0);
        }
        if(BEAN >= 240.0 && fresnell >= 0.5){
            //color += 0.3 * kickThrob;
        }
    }

    gl_FragColor = vec4(color, 1.0);
}

