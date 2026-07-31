
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
    uniform float uFromZoom;
    uniform float uToZoom;
    uniform float uProgress;
    uniform float uDirection;
    varying vec2 vUv;

    vec2 cover(vec2 uv, float ta, float re) {
        vec2 ratio = re < ta ? vec2(re / ta, 1.0) : vec2(1.0, ta / re);
        return (uv - 0.5) * ratio + 0.5;
    }

    vec2 zoom(vec2 uv, float scale) {
        return (uv - 0.5) / scale + 0.5;
    }

    void main() {
        vec4 from = texture2D(uFrom, zoom(cover(vUv, uFromRes, uWinRes), uFromZoom));
        vec4 to   = texture2D(uTo,   zoom(cover(vUv, uToRes,   uWinRes), uToZoom));
        gl_FragColor = mix(from, to, uProgress);
    }
`;
