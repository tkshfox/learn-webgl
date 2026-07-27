import * as THREE from 'three';
import { VERTEX, FRAGMENT } from './shaders.js';

(function ($) {
    var $webgl = $('#webgl');
    var textLoader = new THREE.TextureLoader();

    function getWindowSize() {
        var width  = $(window).width();
        var height = $(window).innerHeight();
        var aspect = width / height;

        return { width, height, aspect };
    }

    function app(texture) {
        var ws = getWindowSize();

        var renderer = new THREE.WebGLRenderer(  );
        renderer.setSize(ws.width, ws.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        $webgl.append(renderer.domElement);

        var textureAspect = texture.image.width / texture.image.height;

        var scene = new THREE.Scene();

        var camera = new THREE.OrthographicCamera();
        camera.matrixAutoUpdate= false;

        var uniforms = {
            uTex: { value: texture },
            uTexAspect: { value: textureAspect },
            uResolution: { value: ws.aspect }
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

        function tick() {
            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        }
        tick();

        function onResize() {
            ws = getWindowSize();
            uniforms.uResolution.value = ws.aspect;
            renderer.setSize(ws.width, ws.height);
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
