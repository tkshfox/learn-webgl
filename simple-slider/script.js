import * as THREE from 'three';
import { VERTEX, FRAGMENT } from './shaders.js';

(function ($) {
    var $webgl = $('#webgl');
    var $canvas = $('#canvas', $webgl);
    if (!$webgl.length && !$canvas.lengt) return false;

    var textureLoader = new THREE.TextureLoader();

    function getWindowSize() {
        var width  = $(window).width();
        var height = $(window).innerHeight();
        var aspect = width / height;

        return { width, height, aspect };
    }

    function aspectOf(texture) {
        return texture.image.width / texture.image.height;
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function app(textures) {
        var ws = getWindowSize();

        var count     = textures.length;
        var current   = 0;
        var next      = 0;
        var startTime = 0;
        var isAnimate = false;

        var renderer = new THREE.WebGLRenderer({
            canvas: $canvas[0],
        });
        renderer.setSize(ws.width, ws.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        var scene = new THREE.Scene();

        var camera = new THREE.OrthographicCamera();
        camera.matrixAutoUpdate= false;

        var uniforms = {
            uFrom:    { value: textures[0] },
            uTo:      { value: textures[1] },
            uFromRes: { value: aspectOf(textures[0]) },
            uToRes:   { value: aspectOf(textures[1]) },
            uWinRes:  { value: ws.aspect }
        };
        var geometry = new THREE.PlaneGeometry(2, 2);
        var material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader: VERTEX,
            fragmentShader: FRAGMENT
        });
        var plane = new THREE.Mesh(geometry, material);
        plane.frustumCulled = false;
        scene.add(plane);

        function goTo(index, direction) {
            if (isAnimate || count < 2) return;

            var target = ((index % count) + count) % count;
            if (target === current) return;
        }

        function toNext() {
        }

        function toPrev() {
        }

        function settle() {
            current = next;

            uniforms.uFrom.value = textures[current];
            uniforms.uFromRes.value = aspectOf(textures[current]);
            uniforms.uProgress.value = 0;

            isAnimate = false;
            startAutoplay();
        }

        function navigation() {
            
            var $prev = $('.button-prev', $webgl);
            var $next = $('.button-next', $webgl);
            if (!$prev.length || !$next.length) return;

            $prev.on('click', toPrev);
            $next.on('click', toNext);
        }

        function tick() {
            if (isAnimate) {
                var t = Math.min((now - startTime) / DURATION, 1);
                uniforms.uProgress.value = easeInOutCubic(t);
                if (t >= 1) settle();
            }
            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        }
        tick();

        function onResize() {
            ws = getWindowSize();
            uniforms.uWinRes.value = ws.aspect;
            renderer.setSize(ws.width, ws.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
        $(window).on('resize', onResize);
    }

    async function init() {
        var imgs = $webgl.data('imgs');
        var textures = await Promise.all(imgs.map(function (src) {
            return textureLoader.loadAsync(src);
        }));

        app(textures);
    }

    init();

})(jQuery);
