import * as THREE from 'three';
import { VERTEX, FRAGMENT } from './shaders.js';

(function ($) {

    var $webgl = $('#webgl');
    var $canvas = $('#canvas', $webgl);
    if (!$webgl.length && !$canvas.length) return false;

    const DURATION = 1000;
    const INTERVAL = 4000;

    var textureLoader = new THREE.TextureLoader();

    function getWindowSize() {
        var width  = $(window).width();
        var height = $(window).height();
        var aspect = width / height;

        return { width, height, aspect };
    }

    function aspectOf(texture) {
        return texture.image.width / texture.image.height;
    }

    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function app(textures, options) {
        var ws = getWindowSize();

        var count     = textures.length;
        var current   = 0;
        var next      = 0;
        var startTime = 0;
        var fromStart = performance.now();
        var isAnimate = false;
        var timerId   = null;

        var renderer = new THREE.WebGLRenderer({
            canvas: $canvas[0],
        });
        renderer.setSize(ws.width, ws.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        var scene = new THREE.Scene();

        var camera = new THREE.OrthographicCamera();
        camera.matrixAutoUpdate= false;

        var uniforms = {
            uFrom:      { value: textures[0] },
            uFromRes:   { value: aspectOf(textures[0]) },
            uTo:        { value: null },
            uToRes:     { value: 1 },
            uWinRes:    { value: ws.aspect },
            uFromZoom:  { value: 1 },
            uToZoom:    { value: 1 },
            uProgress:  { value: 0 },
            uDirection: { value: 1 },
        };
        var geometry = new THREE.PlaneGeometry(2, 2);
        var material = new THREE.ShaderMaterial({ uniforms, vertexShader: VERTEX, fragmentShader: FRAGMENT });
        var plane = new THREE.Mesh(geometry, material);
        plane.frustumCulled = false;
        scene.add(plane);

        function stopAutoplay() {
            if (timerId === null) return;

            clearTimeout(timerId);
            timerId = null;
        }

        function startAutoplay() {
            if (count < 2) return;

            stopAutoplay();
            timerId = setTimeout(toNext, INTERVAL);
        }

        function goTo(index, direction) {
            if (isAnimate || count < 2) return;

            var target = ((index % count) + count) % count;
            if (target === current) return;

            if (direction === undefined) {
                direction = target > current ? 1 : -1;
            }

            stopAutoplay();
            next = target;

            uniforms.uTo.value = textures[next];
            uniforms.uToRes.value = aspectOf(textures[next]);
            uniforms.uDirection.value = direction || 1;
            uniforms.uProgress.value = 0;

            updatePagination(next);

            startTime = performance.now();
            isAnimate = true;
        }

        function toNext() {
            goTo(current + 1, 1);
        }

        function toPrev() {
            goTo(current - 1, -1);
        }

        function settle() {
            current = next;

            uniforms.uFrom.value = textures[current];
            uniforms.uFromRes.value = aspectOf(textures[current]);
            uniforms.uProgress.value = 0;

            fromStart = startTime;

            isAnimate = false;
            startAutoplay();
        }

        function buildNavigation() {
            if (options && options.navigation !== true) return;

            var $prev = $('<button class="button-prev"></button>');
            var $next = $('<button class="button-next"></button>');
            $prev.on('click.prev', toPrev);
            $next.on('click.next', toNext);

            $webgl.append($prev).append($next);
        }

        var $bullets = $();
        function buildPagination() {
            if (options && options.pagination !== true) return;
            if (count < 2) return;

            var $pagi = $('<div class="pagination"></div>');

            for (var i = 0; i < count; i++) {
                $pagi.append(
                    $('<button class="pagination-bullet"></button>')
                        .data('index', i)
                );
            }

            $pagi.on('click', '.pagination-bullet', function () {
                goTo($(this).data('index'));
            });

            $webgl.append($pagi);
            $bullets = $pagi.find('.pagination-bullet');

            updatePagination(current);
        }

        function updatePagination(index) {
            if (!$bullets.length) return;

            $bullets
                .removeClass('is-active')
                .eq(index)
                .addClass('is-active');
        }

        function zoomAt(elapsed) {
            return 1 + 0.12 *  Math.min(elapsed / (INTERVAL + DURATION * 2), 1);
        }

        function tick() {
            var now = performance.now();

            if (isAnimate) {
                var t = Math.min((now - startTime) / DURATION, 1);

                uniforms.uProgress.value = easeInOutCubic(t);
                uniforms.uToZoom.value = zoomAt(now - startTime);

                if (t >= 1) settle();
            }
            uniforms.uFromZoom.value = zoomAt(now - fromStart);

            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        }
        tick();
        startAutoplay();
        buildNavigation();
        buildPagination();
        updatePagination(current);

        function onResize() {
            ws = getWindowSize();
            uniforms.uWinRes.value = ws.aspect;
            renderer.setSize(ws.width, ws.height);
        }

        $canvas.on('click', toNext);
        $(document).on('visibilitychange', function () {
            if (document.hidden) { stopAutoplay(); }
            else { startAutoplay(); }
        });
        $(window).on('resize', onResize);

    }

    async function init() {
        var imgs = $webgl.data('imgs');
        var options = $webgl.data('options');

        var textures = await Promise.all(imgs.map(function (src) {
            return textureLoader.loadAsync(src);
        }));
        app(textures, options);
    }

    init();

})(jQuery);
