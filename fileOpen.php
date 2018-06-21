<?php
  include_once 'func/functions.php';
  $path = GetPath();
  $pathForUser = ShowPathForUser();
?>
<?php include_once 'inc/header.php'; ?>
<section class="file-content">
  <?php ShowFileContent() ?>
</section>
<?php include_once 'inc/footer.php'; ?>
