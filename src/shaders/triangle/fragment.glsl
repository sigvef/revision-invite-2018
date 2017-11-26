uniform float frame;
uniform sampler2D tDiffuse;
uniform vec3 sphere1;
uniform vec3 sphere2;
uniform vec3 sphere3;
uniform vec3 sphere4;
uniform vec3 sphere5;
uniform vec3 sphere6;
#define PI 3.141592653589793

varying vec2 vUv;

float sphere(vec3 position, vec3 sphere, float radius) {
    return length(position - sphere) - radius;
}

float box(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}


float torus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

float displacement(vec3 p) {
    return 1.5 * sin(frame / 9. + .9 * p.x) * sin(.5 * p.y) * sin(.9 * p.z);
}

float cylinder( vec3 p, vec2 h ) {
    vec2 d = abs(vec2(length(p.xz),p.y)) - h;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}


float smin(float a, float b, float k) {
    float res = exp(-k * a) + exp(-k * b);
    return -log(res) / k;
}

float map(vec3 p) {
    float timer = clamp((frame - 6573.) / 50., 0., 1.);
    float size = smoothstep(0., 0.85, timer);
    float sminParameter = .5 - max(0., (frame - 6573.) / (6761. - 6573.) / 2.);
    float zscale = -1.;
    float yscale = 1.;
    float xscale = 4.;
    float s = sphere(p, vec3(sphere1.z * zscale, sphere1.y * yscale, sphere1.x * xscale), size);
    s = smin(s, sphere(p, vec3(sphere2.z * zscale, sphere2.y * yscale, sphere2.x * xscale), size), sminParameter);
    s = smin(s, sphere(p, vec3(sphere3.z * zscale, sphere3.y * yscale, sphere3.x * xscale), size), sminParameter);
    s = smin(s, sphere(p, vec3(sphere4.z * zscale, sphere4.y * yscale, sphere4.x * xscale), size), sminParameter);
    s = smin(s, sphere(p, vec3(sphere5.z * zscale, sphere5.y * yscale, sphere5.x * xscale), size), sminParameter);
    s = smin(s, sphere(p, vec3(sphere6.z * zscale, sphere6.y * yscale, sphere6.x * xscale), size), sminParameter);
    return s;
}

float castRay(vec3 ro, vec3 rd, float sizeChange) {
    float totalDistance = 0.0;
    const int maxSteps = 128;

    for(int i = 0; i < maxSteps; ++i) {
        vec3 p = ro + rd * totalDistance;
        float d = map(p*(1. + sizeChange));
        if(d < 0.001 || totalDistance >= 250.0) {
            break;
        }

        totalDistance += d;
    }
    return totalDistance;
}

vec3 calculateNormal(vec3 pos) {
    vec3 eps = vec3(0.001, 0.0, 0.0);
    vec3 normal = vec3(
            map(pos + eps.xyy) - map(pos - eps.xyy),
            map(pos + eps.yxy) - map(pos - eps.yxy),
            map(pos + eps.yyx) - map(pos - eps.yyx));
    return normalize(normal);
}

void main() {
    float x = (vUv.x * 16.0) - 8.0;
    float y = (vUv.y * 9.0) - 4.5;
    float fov = 45.0;

    vec3 eye = vec3(0., 0., 1.);
    vec3 forward = vec3(0., 0., -1.);
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 right = cross(forward, up);

    vec3 rayOrigin = eye + (right * x) + (up * y) + (forward * fov);
    vec3 rayDestination = normalize(rayOrigin - eye);

    vec3 light = normalize(vec3(1., 1., 1.));

    float farClippingPlane = 250.0;

    float blackColDistance = castRay(rayOrigin, rayDestination, -0.03);;
    vec4 blackCol = vec4(0.);

    float totalDistance = castRay(rayOrigin, rayDestination, 0.0);
    vec4 color = vec4(1.);
    vec3 pos = rayOrigin + rayDestination * totalDistance;
    vec3 surfaceNormal = calculateNormal(pos);
    float diffusion = 1.5 * clamp(dot(surfaceNormal, light), 0.0, 1.0);
    float timer = clamp((frame - 6573.) / 50., 0., 1.);
    diffusion += 1. - smoothstep(0., 0.8, timer); /* ambient */ 
    diffusion += 0.2;

    vec3 refracted = refract(normalize(pos - eye), surfaceNormal, 1.1);
    vec4 refractedColor = texture2D(tDiffuse, .82 * mod(refracted.xy - 0.5, 1.));

    if(blackColDistance < farClippingPlane) {
        //color = vec4(.1, .0, .1, 1.);
    }

    if(totalDistance < farClippingPlane) {
    }
    color = diffusion * .8 + refractedColor * 0.4;
    //color = vec4(vec3(diffusion), 1.);
    //color = vec4(surfaceNormal, 1.);
    //color = vec4(vec3(refracted), 1.);

    vec4 textureColor = texture2D(tDiffuse, vUv);

    if(blackColDistance > farClippingPlane) {
        color = mix(textureColor, vec4(vec3(0.1, 0., 0.1), 1.), vec4(timer));
    }
    float visibleTimer = clamp((frame - 6573.), 0., 1.);
    color = mix(textureColor, color, vec4(visibleTimer));

    gl_FragColor = color;
}
