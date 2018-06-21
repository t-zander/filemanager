// prevent default context menu
document.addEventListener('contextmenu', function(e){
  e.preventDefault();
});

// МЕНЮ УДАЛИТЬ ПЕРЕИМЕНОВАТЬ 
window.addEventListener('load', initMenu); 

// defines whether menu is shown or hidden
let menuShown = false;
// defines whether pop up is shown or not
let popUpShown = false;
// called when window is loaded 
function initMenu() {
  console.log('инициализация меню');
  let filesList = document.getElementsByClassName("dropDown");

  for(let i = 0; i < filesList.length; i ++){
    filesList[i].addEventListener("contextmenu", showMenu);
  }
}

// called by showMenu function - creates context menu
function createMenu(top, left) {
  console.log('функция создания меню');
  let menuArea = document.getElementById('menuArea');
  let menu = document.createElement('div');
  menu.id = 'contextMenu';
  let list = document.createElement('ul');

  let options = ['удалить', 'переименовать', 'переместить'];
  let attributes = ['deleteItem', 'renameItem', 'moveItem'];
  //добавить li в ul
  for (let i = 0; i < options.length; i ++){
    let li = document.createElement('li');
    li.innerHTML = options[i];
    li.dataset.option = attributes[i];
    list.appendChild(li);
  }
  
  menu.appendChild(list);
  menu.classList.add('menu');
  menuArea.appendChild(menu);
  
  menu.style.cssText = 'top: ' + top + 'px; ' + 'left: ' + left + 'px;';
  document.addEventListener('click', hideMenu);
}

// checks if menu is shown or not, if not creates it and shows 
function showMenu(e){
  e.preventDefault();
  e.stopPropagation();

  console.log('проверка существования меню');
  let top = e.clientY;
  let left = e.clientX;
  let currentItem = e.target;
  if(!menuShown && !popUpShown){
    // calls create menu function
    createMenu(top, left);
    // add listeneres to options (delete, rename)
    /**
      adds listener onclick to contextmenu options, argument = file which was clicked
    */
    addListenersToOptions(currentItem);
    menuShown = true;
  }else{
    menuShown = false;
  }
}

function addListenersToOptions(currentItem){

  console.log('добавление листенера на опции');
  let options = document.querySelectorAll('#contextMenu > ul > li');
  for(let i = 0; i < options.length; i++){
    options[i].addEventListener('click', function(){
      let option = this.getAttribute('data-option');
      defineRequest(currentItem, option);
    })
  }
}

function defineRequest(currentItem, option){
  switch(option){
    case 'deleteItem':
      sendDeleteRequest(currentItem);
      break;
    case 'renameItem':
      showPopUp();
      break;
  }
}

function sendDeleteRequest(currentItem){
  console.log('функция отправить request на удаление файла');
  let fileName = currentItem.getAttribute('data-filename');

  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'ajaxHandler.php?fileName='+fileName);
  xhr.send();

  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4 && xhr.status === 200){
      let result = xhr.responseText;

      if(result === 'success'){
        deleteFileFromList(currentItem);
      }else if(result === 'ne'){
        console.log('папка не пуста');
        showPopUp(currentItem);
      }
    }
  }
}
// if folder is empty
function deleteFileFromList(item){
  console.log('удаляю файл');
  item.remove();

  let filesList = document.querySelectorAll('#menuArea > ul > li > a');
  if(filesList.length === 0){
    insertWarning();
  }
}

function insertWarning(){
  let menuArea = document.getElementById('menuArea');
  let h4 = document.createElement('h4');
  
  h4.innerHTML = 'В этой папке ничего нет';

  menuArea.appendChild(h4);
}

function showPopUp(currentItem){

  if(!popUpShown){
    createPopUp();
    addPopUpOptionsListener(currentItem);
    document.addEventListener('click', hidePopUpMenu);
    popUpShown = true;
  }
}

function createPopUp(){
  console.log('функция создания pop up меню');

  let menuArea = document.getElementById('menuArea');

  let popUp = document.createElement('div');
  popUp.id = 'popUpMenu';
  popUp.classList.add('popUpDiv');
  let header = document.createElement('h3');
  header.innerHTML = 'Папка не пуста. Все равно удалить?';

  let yesBtn = document.createElement('button');
  yesBtn.classList.add('popUpButton');
  yesBtn.innerHTML = 'Да';
  yesBtn.setAttribute('data-popUpOption', 'deleteAll');

  let noBtn = document.createElement('button');
  noBtn.classList.add('popUpButton');
  noBtn.innerHTML = 'Отмена';
  noBtn.setAttribute('data-popUpOption', 'cancel');

  popUp.appendChild(header);
  popUp.appendChild(yesBtn);
  popUp.appendChild(noBtn);
  
  menuArea.appendChild(popUp);
  let leftPosition = (screen.width - popUp.offsetWidth) / 2;
  let topPosition = (document.querySelector('header')).offsetHeight;

  popUp.style.cssText = 'top : ' + topPosition + 'px; left:' + leftPosition + 'px;';
}

function addPopUpOptionsListener(currentItem){
  console.log('добавление листенера на кнопки поп ап меню');
  let popUpBtns = document.querySelectorAll('.popUpButton');
  
  for(let i = 0; i < popUpBtns.length; i++){
    popUpBtns[i].addEventListener('click', function(){
      let option = this.getAttribute('data-popUpOption');
      defineAction(currentItem, option);
    });
  }
}

// определяем что нужно сделать (отмена или удалить папку вместе со всем содержимым)
function defineAction(currentItem, option){
  switch (option) {
    case 'deleteAll':
      console.log('будут удалены все папки внутри папки и файлы');
      deleteAllFolderContent(currentItem);
      break;
  }
}

function deleteAllFolderContent(currentItem){
  let fileName = currentItem.getAttribute('data-filename');
  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'deleteAllAjax.php?fileName='+fileName);
  xhr.send();

  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4 && xhr.status === 200){
      let result = xhr.responseText;

      if(result === 'success'){
        deleteFileFromList(currentItem);
      }else{
        alert('произошла ошибка');
      }
    }
  }
}

function hideMenu(e){
  // check if menu is shown
  // check if click was not on menu
  let menu = document.getElementById('contextMenu');
  if(menuShown){
    if(menu !== e.target){
      console.log('функция спрятать меню');
      menu.remove();
      document.removeEventListener('click', hideMenu);
      menuShown = false;
    }
  }
}

function hidePopUpMenu(e) {
  //check if pop up is shown
  let popUpMenu = document.getElementById('popUpMenu');

  if(popUpShown && e.target !== popUpMenu){
    console.log('функция спрятать pop up меню');
    popUpMenu.remove();
    document.removeEventListener('click', hidePopUpMenu);
    popUpShown = false;
  }
}