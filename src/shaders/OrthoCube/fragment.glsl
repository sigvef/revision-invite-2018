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


float sphereCube(vec3 p){
    float d = END + EPSILON;
    for(float x = -1.0; x <= 1.0; x++){
        for(float y = -1.0; y <= 1.0; y++){
            for(float z = -1.0; z <= 1.0; z++){
                d = uni(d, sphere((p-vec3(x, y, z)), 0.3));
            }
        }
    }
    return d;
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

float sdf(vec3 p) {
    vec3 cubeP = p;
    float nframe = frame + 1100.0; //quickfix to movement in time-slice
    if(nframe < 11143.0){
        //Stand still
    }
    else if(nframe < 11284.0){
        cubeP = (rotateY((nframe - 11143.0)/45.0) * vec4(p, 1.0)).xyz;
    }
    else if(nframe < 11331.0){
        //Stand still
    }
    else if(nframe < 11366.0){
        cubeP = (rotateX((nframe - 11331.0)/45.0) * vec4(p, 1.0)).xyz;
    }
    else if(nframe < 11390.0){
        cubeP = (rotateX(35.7/45.0) * vec4(p, 1.0)).xyz;
    }
    else if(nframe < 11427.0){
        cubeP = (rotateX((nframe -11390.0 + 35.0)/45.0) * vec4(p, 1.0)).xyz;
    }else{
        cubeP = (rotateX((nframe - 11427.0)/45.0) * vec4(p, 1.0)).xyz;
        cubeP = (rotateY((nframe - 11427.0)/45.0) * vec4(cubeP, 1.0)).xyz;
    }


    float d = sphereCube(cubeP);
    return d;
}


float march(vec3 eye, vec3 dir, float start, float end) {
    float depth = start;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        float dist = sdf(eye + depth * dir);
        if (dist < EPSILON) {
            return depth;
        }
        depth+=dist;
        if (depth >= end) {
            return end;
        }
    }
    return end;
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

    float dist = march(eye, dir, START, END);

    if (dist >= END-EPSILON) {
        return;
    }

    vec3 p = eye + dir * dist;
    vec3 color = vec3(0.00089 * dist * dist * dist, 0.2, 1.0-0.0009 * dist * dist * dist);

    gl_FragColor = vec4(color, 1.0);
}

