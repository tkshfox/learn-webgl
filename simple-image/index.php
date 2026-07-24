<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Learn webgl</title>

    <link rel="stylesheet" href="style.css?<?= time() ?>">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
	<script type="importmap">
    {
        "imports": {
            "three": "https://cdn.jsdelivr.net/npm/three@0.185.0/build/three.module.js",
            "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.185.0/examples/jsm/"
        }
    }
    </script>
</head>
<body>
    <div id="webgl"></div>

    <script type="module" src="script.js?<?= time() ?>"></script>
</body>
</html>
