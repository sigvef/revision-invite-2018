uniform float frame;
uniform sampler2D tDiffuse;
uniform float gridMode;
uniform float lineWidth;
uniform float ballRadius;
uniform float ambientLightIntensity;

varying vec2 vUv;
varying vec4 globalPosition;

varying vec3 vNormal;

void main() {
    vec2 uv = vUv;
    vec3 white = vec3(1.);
    vec4 color = vec4(white, 0.1);

    vec3 diffuseColor = vec3(102., 201., 115.) / 255.;
    vec3 directionalLight = normalize(vec3(1.));

    float gridAmount = 0.;

    if(uv.y < lineWidth) {
        gridAmount = clamp(1. - uv.y / lineWidth, 0., 1.);
    }
    if(uv.x > 1. - lineWidth) {
        gridAmount = clamp((uv.x - 1. + lineWidth) / lineWidth, 0., 1.);
    }
    if(uv.x < uv.y + lineWidth) {
        gridAmount = clamp(1. - (uv.x - uv.y) / lineWidth, 0., 1.);
    }

    if(uv.x < ballRadius) {
        gridAmount = 1.;
    }
    if(uv.y > 1. - ballRadius) {
        gridAmount = 1.;
    }
    if(uv.x > uv.y + 1. - ballRadius) {
        gridAmount = 1.;
    }

    if(gridMode > 0.5) {
        color = vec4(vec3(.5), gridAmount);
    } else {
        float light = 1.;
        light = clamp(dot(vNormal, directionalLight), 0., 1.);
        float specular = pow(light, 16.);
        light = clamp(light, 0., 1.);
        light *= 0.5 + (1. - gridAmount) * 0.5;
        light = clamp(light, 0., 1.);
        light -= gridAmount * ambientLightIntensity * 0.25;
        light += ambientLightIntensity;
        light = clamp(light, 0., 1.);
        color = vec4(diffuseColor * light, 1.);
        color += specular * 0.1;
    }

    gl_FragColor = color;
}
