<?php
  include_once 'func/functions.php';
  $directoriesList = getDirectoriesList();
  $filesList = getFilesList();
  $path = GetPath();
  $pathForUser = ShowPathForUser();
?>
<!--HEADER-->
<?php include_once 'inc/header.php'; ?>
<!--END OF HEADER-->
<section id="menuArea" class="listing">
  <?php if(CheckIfEmptyDir($path)): ?>
  <h4>В этой папке ничего нет</h4>
  <?php endif; ?>
  <ul id="foldersList">
  <!--ВЫВОДИМ ВСЕ ПАПКИ-->
    <?php foreach ($directoriesList as $directory): ?>
    <li class="folder">
      <a class="dropDown" data-fileName="<?php echo $path.$directory; ?>"
         href="/main.php?path=<?php echo $path.$directory; ?>">
        <i class="fas fa-folder"></i>
        <?php echo $directory; ?>
      </a>
    </li>
    <?php endforeach; ?>
  </ul>
  <!--ВЫВОДИМ ВСЕ ФАЙЛЫ-->
  <ul id="filesList">
    <?php foreach ($filesList as $file): ?>
    <li class="file">
      <a data-fileName="<?php echo $path.$file; ?>" class="dropDown" href="/fileOpen.php?path=<?php echo $path.$file; ?>">
        <?php echo getIcon($file); ?>
        <?php echo $file; ?>
      </a>
    </li>
    <?php endforeach; ?>
  </ul>
</section>
<?php include_once 'inc/footer.php'; ?>