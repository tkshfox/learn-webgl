export const VERTEX = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`;

export const FRAGMENT = `
    uniform sampler2D uTex;
    uniform float uTime;
    uniform float uTexRes;
    uniform float uWinRes;
    varying vec2 vUv;

    vec2 getRatio(float texRes, float winRes) {
        return
            (texRes > winRes) ?
                vec2(winRes / texRes, 1.0) :
                vec2(1.0, texRes / winRes);
    }

    vec2 getCover(vec2 uv, vec2 ratio) {
        return (uv - 0.5) * ratio + 0.5;
    }

    void main() {
        vec2 ratio = getRatio(uTexRes, uWinRes);
        vec2 texUV = getCover(vUv, ratio);

        gl_FragColor = texture2D(uTex, texUV);
    }
`;
