
export const VERTEX = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`;

export const FRAGMENT = `
    uniform sampler2D uFrom;
    uniform sampler2D uTo;
    uniform float uFromRes;
    uniform float uToRes;
    uniform float uWinRes;
    varying vec2 vUv;

    vec2 cover(vec2 uv, float ta, float re) {
        vec2 ratio = re < ta ? vec2(re / ta, 1.0) : vec2(1.0, ta / re);
        return (uv - 0.5) * ratio + 0.5;
    }

    void main() {
        vec2 textureUv = cover(vUv, uFromRes, uWinRes);
        vec4 color = texture2D(uFrom, textureUv);
        gl_FragColor = color;
    }
`;
