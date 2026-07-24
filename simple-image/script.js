import * as THREE from 'three';
import { VERTEX, FRAGMENT } from './shaders.js';

(function ($) {
    var $webgl = $('#webgl');
    var textLoader = new THREE.TextureLoader();

    function getWindowSize() {
        var width = window.innerWidth;
        var height = window.innerHeight;
        var aspect = width / height;

        return { width, height, aspect };
    }

    function app(texture) {
        var windowSize = getWindowSize();

        var renderer = new THREE.WebGLRenderer(  );
        renderer.setSize(windowSize.width, windowSize.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        $webgl[0].appendChild(renderer.domElement);

        var textureAspect = texture.image.width / texture.image.height;

        var scene = new THREE.Scene();

        var camera = new THREE.OrthographicCamera();
        camera.matrixAutoUpdate= false;

        var uniforms = {
            uTexture: {
                value: texture
            },
            uTextureAspect: {
                value: textureAspect
            },
            uScreenAspect: {
                value: windowSize.aspect
            }
        };
        var geometry = new THREE.PlaneGeometry(2, 2);
        var material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: VERTEX,
            fragmentShader: FRAGMENT
        });
        var plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        var light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(1, 1, 1);
        scene.add(light);

        function tick(time) {
            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);

        function onResize() {
            windowSize = getWindowSize();
            uniforms.uScreenAspect.value = windowSize.aspect;
            renderer.setSize(windowSize.width, windowSize.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
        $(window).on('resize', onResize);
    }

    async function init() {
        var texture = await textLoader.loadAsync('./image.jpg');
        app(texture);
    }
    init();

})(jQuery);
