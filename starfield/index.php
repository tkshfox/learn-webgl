<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>starfield | tkshfox</title>
	<link rel="stylesheet" href="style.css?<?= time() ?>">

	<!-- jQuery -->
	<script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>

	<!-- GSAP & ScrollTrigger & SplitText -->
	<script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/gsap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/ScrollTrigger.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15/dist/SplitText.min.js"></script>
</head>
<body>

    <section class="intro">
        <h1>Buckle Up</h1>
    </section>

    <section class="starfield">
        <canvas id="canvas"></canvas>

        <div class="starfield-text">
            <p>The whole galaxy opens up</p>
            <p>Leaving the known world behind</p>
            <p>And then everything goes still</p>
        </div>
    </section>

    <section class="outro">
        <div class="outro-text">
            <p>We're Home</p>
        </div>
    </section>

    <script src="main.js?<?= time() ?>"></script>
</body>
</html>
