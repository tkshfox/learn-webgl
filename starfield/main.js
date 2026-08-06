gsap.registerPlugin(ScrollTrigger, SplitText);

$(function () {

    const settings = {
        starCount: 1000,
        palette: ['#7CF5FF', '#8CE0FF', '#9D7CFF', '#C77CFF', '#FF7CE8', '#FF6FB5'],
        paletteWeights: [0.3, 0.22, 0.16, 0.13, 0.11, 0.08],
        holeRadius: 50,
        reachScale: 1.25,

        minStreakLength: 25,
        maxStreakLength: 350,
        minStreakWidth: 2.5,
        maxStreakWidth: 3.5,

        layers: 4,
        glowRadius: 300,
        glowSoftness: 3,
        acceleration: 1.5,
        tailFade: 0.25,
        restingFill: 0.25,
    };

    var canvas = $('#canvas')[0];
    var ctx = canvas.getContext('2d');

    var width, height, centerX, centerY, maxDistance, pixelRatio;
    var stars = [];
    var scrollProgress = 0;

    function hexToRgb(hex) {
        var clean = hex.replace('#', '');
        return [
            parseInt(clean.slice(0, 2), 16),
            parseInt(clean.slice(2, 4), 16),
            parseInt(clean.slice(4, 6), 16),
        ];
    }

    function pickWeightedColor() {
        var roll = Math.random();
        for (let i = 0; i < settings.palette.length; i++) {
            roll -= settings.paletteWeights[i];
            if (roll <= 0) {
                return hexToRgb(settings.palette[i]);
            }
        }

        return hexToRgb(settings.palette[0]);
    }

    function createStars() {
        stars = [];
        for (var i = 0; i < settings.starCount; i++) {
            var angle = Math.random() * Math.PI * 2;
            stars.push({
                dirX: Math.cos(angle),
                dirY: Math.sin(angle),
                offset: Math.random(),
                length: random(settings.minStreakLength, settings.maxStreakLength),
                width: random(settings.minStreakWidth, settings.maxStreakWidth),
                color: pickWeightedColor(),
            });
        }
    }

    function random(min, max) {
        return min + Math.random() * (max - min);
    }

    function resizeCanvas() {
        pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        centerX = width / 2;
        centerY = height / 2;
        maxDistance = Math.hypot(width / 2, height / 2) * settings.reachScale;
    }

    function drawStarfield() {
        ctx.clearRect(0, 0, width, height);
        ctx.lineCap = "round";

        var filled =
            settings.restingFill + scrollProgress * (1 - settings.restingFill);
        var speed = Math.pow(filled, 1 / settings.acceleration);

        for (var star of stars) {
            var travel = (speed * settings.layers + star.offset) % 1;

            var headDistance =
                settings.holeRadius + travel * (maxDistance - settings.holeRadius);

            var streakLength = star.length * (0.2 + travel * 0.8);
            var tailDistance = Math.max(
                settings.holeRadius,
                headDistance - streakLength
            );

            var tailX = centerX + star.dirX * tailDistance;
            var tailY = centerY + star.dirY * tailDistance;
            var headX = centerX + star.dirX * headDistance;
            var headY = centerY + star.dirY * headDistance;

            var opacity = 1;
            if (headDistance < settings.glowRadius) {
                var t =
                    (headDistance - settings.holeRadius) /
                    (settings.glowRadius - settings.holeRadius);
                opacity = Math.pow(Math.max(0, t), settings.glowSoftness);
            }
            if (opacity <= 0.01) continue;

            var [r, g, b] = star.color;
            var gradient = ctx.createLinearGradient(tailX, tailY, headX, headY);
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
            gradient.addColorStop(settings.tailFade, `rgba(${r}, ${g}, ${b}, ${opacity})`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${opacity})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = star.width * (0.5 + travel * 0.9);
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(headX, headY);
            ctx.stroke();

        }
    }

    createStars();
    resizeCanvas();
    drawStarfield();

    ScrollTrigger.create({
        trigger: '.starfield',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: function (self) {
            scrollProgress = self.progress;
            drawStarfield();
        },
    });

    $(window).on('resize', function () {
        resizeCanvas();
        drawStarfield();
        ScrollTrigger.refresh();
    });

});
