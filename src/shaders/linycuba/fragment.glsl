uniform float frame;
uniform sampler2D tDiffuse;
uniform float lineAmount;
uniform float lightAmount;

varying vec2 vUv;
varying vec4 globalPosition;

varying vec3 vNormal;

void main() {
    vec2 uv = vUv;
    vec3 white = vec3(1.);
    vec3 pink = vec3(255., 73., 130.) / 255.;
    vec3 green = vec3(119., 225., 93.) / 255.;
    vec3 gray = vec3(55., 60., 63.) / 255.;
    vec4 color = vec4(white * lightAmount, 1.);
    vec3 lineColor = pink;
    vec3 directionalLight = normalize(vec3(1.));
    if(frame >= 10267.) {
        color.rgb = mix(white, green, pow((frame - 10267.) / (10329. - 10267.), .25));
    }
    if(frame >= 10329. - 0.1) {
        float light = 0.5 + dot(vNormal, directionalLight) * 0.5;
        color.rgb = pink * light;
        lineColor = gray * light;
    }

    float lineWidth = 0.1 * lineAmount;

    if(uv.x < lineWidth) {
        color = vec4(lineColor, 1.);
    }

    if(uv.x > 1. - lineWidth) {
        color = vec4(lineColor, 1.);
    }

    if(uv.y > 1. - lineWidth) {
        color = vec4(lineColor, 1.);
    }

    if(uv.y < lineWidth) {
        color = vec4(lineColor, 1.);
    }


    gl_FragColor = color;
}
