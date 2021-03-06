<?php

define("ROOT", 'main/');
/*получает путь к файлу*/
function GetPath(){
  if($_GET['path'] === '../'){
    header("Location: permission.php");
  }
  if($_GET['path'] === 'home' or $_GET['path']==='/'){
    header("Location: main.php");
  }
  if(empty($_GET['path'])){
    return '';
  }else{
    $path = filter_var($_GET['path'], FILTER_SANITIZE_STRING) . '/';
    return $path;
  }
}

function GetPathForAjax(){
  $fullUrl = $_SERVER['HTTP_REFERER'];
  $str = parse_url($_SERVER['HTTP_REFERER'], PHP_URL_QUERY);
  parse_str($str, $result);
  return $result['path'];
}

function ShowPathForUser(){
  $path = $_GET['path'];
  if($path == ''){
    return 'home/';
  }else{
    $pathForUser = 'home/'. $path;
    return $pathForUser;
  }
}

function checkFile($path){
  if(!file_exists($path)){
    return false;
  }else{
    return true;
  }
}

function getDirectoriesList(){
  $path = GetPath();
  $directoriesList = array();
  if(!checkFile(ROOT . $path)){
    header("Location: error.php");
  }else{
    $list = array_diff(scandir(ROOT.$path ), array('..', '.'));
    foreach ($list as $item){
      if (is_dir(ROOT.$path.$item)){//если это папка добавляем ее в список
        $directoriesList[] = $item;
      }
    }
  }
  return $directoriesList;
}

function getFilesList(){
  $path = GetPath();
  $filesList = array();
  if(!checkFile(ROOT . $path)){
    header("Location: error.php");
  }else{
    $list = array_diff(scandir(ROOT.$path), array('..', '.'));
    foreach ($list as $item){
      if (!is_dir(ROOT.$path.$item)){//если это файл добавляем его в список
        $filesList[] = $item;
      }
    }
  }
  return $filesList;
}

function getIcon($file){
  $fileInfo = pathinfo(ROOT.$file);
  $fileExtension = $fileInfo['extension'];

  $textFiles = array('doc', 'docx', 'txt', 'odf');
  $webFiles = array('php', 'css', 'html', 'js', 'py');

  if (in_array($fileExtension, $textFiles )){
    return '<i class="fas fa-file-word"></i>';
  }elseif(in_array($fileExtension, $webFiles )){
    return '<i class="fas fa-file-code"></i>';
  }elseif($fileExtension = 'jpg' or 'jpeg' or 'png' or 'gif'){
    return '<i class="fas fa-file-image"></i>';
  }
}

function CheckIfEmptyDir($path = '/'){
  if(file_exists(ROOT.$path)){
    $result = array_diff(scandir(ROOT.$path), array('..', '.'));
    if(empty($result)){
      return true;
    }
  }
}

function GetPreviousPath(){
  $path = GetPath();
  if(dirname($path) == '.') {
    echo '/main.php';
  }else{
    echo '/main.php?path=' . dirname($path);
  }
}

function ShowFileContent(){
  $path = $_GET['path'];
  $pathinfo = pathinfo($path);
  $fileExtension = $pathinfo['extension'];

  if($fileExtension == 'jpg' or 'jpeg' or 'png' or 'gif'){
    include_once 'openImage.php';
  }elseif ($fileExtension == 'txt' or 'docx') {
    $content = file_get_contents($path);
    include_once 'openTextDoc.php';
  }
}

function deleteFile($name){
  $fullPath = ROOT.$name;
  if(file_exists($fullPath)) {
    if (is_dir($fullPath)) {
      if(CheckIfEmptyDir($name)){
        rmdir($fullPath);
        echo 'success';
      }else{
        echo 'ne';
      }
    }elseif (is_file($fullPath)) {
      unlink($fullPath);
      echo 'success';
    }
  }
}

function deleteAllFolderContent($name){
  if(file_exists(ROOT.$name)){
    if(is_dir(ROOT.$name)){
      deleteDirectory($name);
    }
    echo 'success';
  }else{
    echo 'error';
  }
  
}

function deleteDirectory($name){

  $list = array_diff(scandir(ROOT.$name), array('..', '.'));

  foreach ($list as $file) {
    if(is_dir(ROOT.$name.'/'.$file)){
      if(CheckIfEmptyDir(ROOT.$name.'/'.$file)){
        rmdir(ROOT.$name.'/'.$file);
      }else{
        deleteDirectory($name.'/'.$file);
      }
    }if(is_file(ROOT.$name.'/'.$file)){
      unlink(ROOT.$name.'/'.$file);
    }
  }
  rmdir(ROOT.$name);
}

function createFolder($folderName){

  $folderName = strip_tags($folderName);
  $folderName = filter_var($folderName, FILTER_SANITIZE_STRING);
  // получаем путь где нужно создать папку/файл
  $path = GetPathForAjax();
  if(!file_exists(ROOT.$path. '/'. $folderName) && mkdir(ROOT.$path. '/'. $folderName)){
    sendResponse($path, $folderName);
  }else{
    echo 'error';
  }
  
}

function sendResponse($path, $folderName){

  $folderPlace = defineFolderPlace($path, $folderName);

  if($path == ''){
    $fullPath = $folderName;
  }else{
    $fullPath = $path.'/'.$folderName;
  }

  $response = [
    'path' => $fullPath,
    'folderPlace' => $folderPlace
  ];

  echo json_encode($response);
}

function defineFolderPlace($path, $folderName){
  // добавить все папки в этом пути в массив
  // по переменной $folderName определить ее место в массиве

  $filesList = array_diff(scandir(ROOT.$path), array('..', '.'));
  $foldersList = array();

  foreach ($filesList as $file) {
    if(is_dir(ROOT.$path.'/'.$file)){
      $foldersList[] = $file;
    }
  }

  $filesReindexed = array_values($foldersList);
  $place = array_search($folderName, $filesReindexed);
  return $place;
}