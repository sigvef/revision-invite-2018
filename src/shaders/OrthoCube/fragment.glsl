uniform float frame;
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


vec2 sphereCube(vec3 p, float gap){
    float d = END + EPSILON;
    float cD = 0.0;
    float oID = 1.0;
    float currentID = 0.0;
    for(float x = -1.0; x <= 1.0; x++){
        for(float y = -1.0; y <= 1.0; y++){
            for(float z = -1.0; z <= 1.0; z++){
                cD = sphere((p-vec3(x*gap, y*gap, z*gap)), 0.3);
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
    float cubeSize = 1.0;
    float nframe = frame - 625.0; //quickfix to movement in time-slice
    if(nframe < 60.0){ //60
        //Stand still
    }
    else if(nframe < 201.0){ //201
        cubeP = (rotateZ((nframe - 60.0)/45.0) * vec4(p, 1.0)).xyz;
    }
    else if(nframe < 248.0){ //248
        //Stand still
    }
    else if(nframe < 283.0){ //283
        cubeP = (rotateX((nframe - 248.0)/45.0) * vec4(p, 1.0)).xyz;
    }
    else if(nframe < 307.0){ //307
        cubeP = (rotateX(35.7/45.0) * vec4(p, 1.0)).xyz;
    }
    else if(nframe < 344.0){ //344
        cubeP = (rotateX((nframe - 307.0 + 35.0)/45.0) * vec4(p, 1.0)).xyz;
    }else{
        cubeP = (rotateX((nframe - 344.0)/45.0) * vec4(p, 1.0)).xyz;
        cubeP = (rotateY((nframe - 344.0)/45.0) * vec4(cubeP, 1.0)).xyz;
        cubeSize = 1.0 + 0.5 * sin((16.0 + nframe) * 3.1415 / 30.0);
    }


    vec2 distoid = sphereCube(cubeP,cubeSize);
    return distoid;
}


vec2 march(vec3 eye, vec3 dir, float start, float end) {
    float depth = start;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        vec2 distoid = sdf(eye + depth * dir);
        float dist = distoid.x;
        if (dist < EPSILON) {
            return vec2(depth, distoid.y);
        }
        depth+=dist;
        if (depth >= end) {
            return vec2(end, 0.0);;
        }
    }
    return vec2(end, 0.0);
}

void main() {
    //vec3 pos = vec3(cos(frame/20.0)*10.0, 5.0, sin(frame/20.0)*10.0);
    vec3 pos = vec3(0.0, 0.0, -10.0);
    vec3 dir = normalize(-pos);

    vec2 propUV = vUv - vec2(0.5, 0.5);
    propUV = propUV * vec2(16, 9);

    //NOTE: Math assumes camera is always pointing in Z+
    //do not rotate the camera without fixing math
    vec3 eye = pos + vec3(propUV, 0.0);

    vec2  distOid = march(eye, dir, START, END);
    float dist = distOid.x;
    float oID = distOid.y;

    if (dist >= END-EPSILON) {
        gl_FragColor = vec4(0.0666, 0.0666, 0.0666, 1.0);
        return;
    }

    vec3 p = eye + dir * dist;
    float gray = 1.0 * mod(oID, 2.0) + 0.4;
    vec3 color = vec3(gray, gray, gray);

    gl_FragColor = vec4(color, 1.0);
}

