<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <link rel="stylesheet" href="../css/style.css">
  <script defer src="https://use.fontawesome.com/releases/v5.0.9/js/all.js"
          integrity="sha384-8iPTk2s/jMVj81dnzb/iFR2sdA7u06vHJyyLlAd4snFpCl/SnyUjRrbdJsw1pGIl"
          crossorigin="anonymous"></script>

</head>
<body>
<div id="wrapper">
  <header>
    <ul <?php if (empty($_GET['path'])):?> style="visibility:hidden" <?php endif;?>>
      <li>
        <a href="/main.php" class="header-text">
          <span><i class="fas fa-home"></i></span>Домой
        </a>
      </li>
      <li>
        <a href="<?php GetPreviousPath() ?>" class="header-text">
          <span><i class="fas fa-chevron-circle-left"></i></span>Назад
        </a>
      </li>
    </ul>

    <p class="header-text">
      Ваш текущий путь: <i class="fas fa-folder-open"></i> <?php  echo $pathForUser; ?>
    </p>
  </header>