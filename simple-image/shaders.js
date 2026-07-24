
export const VERTEX = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`;

export const FRAGMENT = `
    uniform sampler2D uTexture;
    uniform float uTextureAspect;
    uniform float uScreenAspect;
    varying vec2 vUv;

    vec2 getCover(vec2 uv, float textureAspect, float screenAspect) {
        vec2 ratio = vec2(
            min(screenAspect / textureAspect, 1.0),
            min(textureAspect / screenAspect, 1.0)
        );
        return vec2(
            (vUv.x - 0.5) * ratio.x + 0.5,
            (vUv.y - 0.5) * ratio.y + 0.5
        );
    }

    void main() {
        vec2 textureUv = getCover(vUv, uTextureAspect, uScreenAspect);
        vec4 color = texture2D(uTexture, textureUv);
        gl_FragColor = color;
    }
`;
