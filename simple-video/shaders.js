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

    void main() {
        vec2 ratio = vec2(1.0, 1.0);
        if(uTexRes > uWinRes) {
            ratio = vec2(uWinRes / uTexRes, 1.0);
        }
        else {
            ratio = vec2(1.0, uTexRes / uWinRes);
        }
        vec2 texUV = vec2(
            (vUv.x - 0.5) * ratio.x + 0.5,
            (vUv.y - 0.5) * ratio.y + 0.5
        );

        gl_FragColor = texture2D(uTex, texUV);
    }
`;
