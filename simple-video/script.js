import * as THREE from "three";
import { VERTEX, FRAGMENT } from './shaders.js';

(function ($) {
    function windowSize() {
        var w = $(window).width();
        var h = $(window).height();
        var aspect = w / h;

        return { w, h, aspect };
    }

    function appVideo() {
        var container = $("#video");
        var size = windowSize();

        var scene = new THREE.Scene();
        var camera = new THREE.OrthographicCamera();
        camera.position.z = 1;

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(size.w, size.h);
        container.append(renderer.domElement);

        const video = document.createElement("video");
        video.src = container.data('src');
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.autoplay = true;
        video.play();

        const texture = new THREE.VideoTexture(video);
        texture.colorSpace = THREE.SRGBColorSpace;

        const geo = new THREE.PlaneGeometry(2, 2);
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 1.0 },
                uTex: { value: texture },
                uTexRes: { value: 1.0 },
                uWinRes: { value: size.aspect, },
            },
            vertexShader: VERTEX,
            fragmentShader: FRAGMENT
        });
        const plane = new THREE.Mesh(geo, mat);
        scene.add(plane);

        video.addEventListener('loadedmetadata', () => {
            mat.uniforms.uTexRes.value = video.videoWidth / video.videoHeight;
        });

        function tick(time) {
            mat.uniforms.uTime.value = time / 1000;
            renderer.render(scene, camera);
            requestAnimationFrame(tick);
        }
        tick();

        function onResize() {
            size = windowSize();

            camera.aspect = size.w / size.h;
            renderer.setSize(size.w, size.h);
            camera.updateProjectionMatrix();
            mat.uniforms.uWinRes.value = size.w / size.h;
        }
        $(window).on('resize', onResize);
    }

    function initVideo() {
        appVideo();
    }

    initVideo();

})(jQuery);
