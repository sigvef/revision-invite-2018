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
    vec4 color = vec4(white * lightAmount, 1.);

    float lineWidth = 0.1;

    if(uv.x < lineWidth) {
        color = vec4(pink, 1.);
    }

    if(uv.x > 1. - lineWidth) {
        color = vec4(pink, 1.);
    }

    if(uv.y > 1. - lineWidth) {
        color = vec4(pink, 1.);
    }

    if(uv.y < lineWidth) {
        color = vec4(pink, 1.);
    }


    gl_FragColor = color;
}
