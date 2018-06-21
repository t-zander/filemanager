window.addEventListener('load', initGeneralMenu);
// CF - create file
let generalMenuShown = false;
let newFolderPopUpShown = false;

function initGeneralMenu(){
  
  console.log('инициализация общего меню');

  let menuArea = document.getElementById('menuArea');
  menuArea.addEventListener('contextmenu', showGeneralMenu);
}

function showGeneralMenu(e){
  console.log('проверка и показ общего меню');
  
  e.preventDefault();
  e.stopPropagation();

  if(!generalMenuShown){
    createGeneralMenu(e);
    addListenersToGMOptions();
    generalMenuShown = true;
    document.addEventListener('click', hideGeneralMenu)
  }else{
    generalMenuShown = false;
  }
}

function createGeneralMenu(e){
  console.log('создает общее меню');

  let menuArea = document.getElementById('menuArea');
  let generalMenuDiv = document.createElement('div');
  generalMenuDiv.id = 'generalMenu';

  let list = document.createElement('ul');
  let options = ['создать папку', 'создать файл', 'изменить вид'];
  let attributes = ['createFolder', 'createFile', 'changeLayout'];
  let topPosition = e.clientY;
  let leftPosition = e.clientX;

  for(let i = 0; i < options.length; i ++){
    let li = document.createElement('li');
    li.innerHTML = options[i];
    li.dataset.option = attributes[i];
    list.appendChild(li);
  }


  generalMenuDiv.appendChild(list);
  generalMenuDiv.classList.add('menu');
  menuArea.appendChild(generalMenuDiv);

  generalMenuDiv.style.cssText = 'top: ' + topPosition + 'px;' 
                     + 'left: ' + leftPosition + 'px;'
}

function addListenersToGMOptions(){
  console.log('функция добавление листенера на опции общего меню');
  let generalMenuOptions = document.querySelectorAll('#generalMenu > ul > li');
  for(let i = 0; i < generalMenuOptions.length; i ++){
    generalMenuOptions[i].addEventListener('click', function(e){
      e.stopPropagation();

      let option = e.target.getAttribute('data-option');
      defineGMRequest(option);
      hideGeneralMenu(e);
    });
  }
}


function defineGMRequest(option){
  switch (option) {
    case 'createFolder':
    //показать поп ап где пользователь введет имя нового файла
      showNewFilePopUp();
      break;
  }
}

function showNewFilePopUp(){
  console.log('функция показа поп ап, где вводится имя новой папки');
  if(!newFolderPopUpShown){
    createNewFolderPopUp();
    addListToNFolPopUpOptions();
    document.addEventListener('click', hideNewFolderPopUp)
    newFolderPopUpShown = true;
  }
}

function createNewFolderPopUp(){
  console.log('функция создания pop up меню где вводится имя папки');
  let menuArea = document.getElementById('menuArea');

  let popUp = document.createElement('div');
  popUp.id = 'newFolderPopUpMenu';
  popUp.classList.add('popUpDiv');
  
  let form = document.createElement('form');
  form.id = 'newFileForm';

  let input = document.createElement('input');
  input.placeholder = 'введите имя папки';
  input.type = 'text';
  input.classList.add('popUpInput');

  let createBtn = document.createElement('button');
  createBtn.classList.add('popUpButton');
  createBtn.innerHTML = 'Создать';
  createBtn.setAttribute('data-popUpOption', 'createFolder');
  createBtn.type = 'button';

  let cancelBtn = document.createElement('button');
  cancelBtn.classList.add('popUpButton');
  cancelBtn.innerHTML = 'Отмена';
  cancelBtn.setAttribute('data-popUpOption', 'cancel');
  cancelBtn.type = 'button';

  form.appendChild(input);
  form.appendChild(createBtn);
  form.appendChild(cancelBtn);
  
  popUp.appendChild(form);
  
  menuArea.appendChild(popUp);
  let leftPosition = (screen.width - popUp.offsetWidth) / 2;
  let topPosition = (document.querySelector('header')).offsetHeight;

  popUp.style.cssText = 'top : ' + topPosition + 'px; left:' + leftPosition + 'px;';
}

function addListToNFolPopUpOptions(){
  console.log('добавление ивент листенера на поп ап элементы');

  let popUpDiv = document.getElementById('newFolderPopUpMenu');
  popUpDiv.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  let popUpForm = document.getElementById('newFileForm');
  popUpForm.addEventListener('click', function(e) {
    e.stopPropagation();
  });

  let buttons = document.querySelectorAll('#newFileForm > button');
  for(let i =0; i < buttons.length; i++){
    buttons[i].addEventListener('click', function(e){
      let option = e.target.getAttribute('data-popupoption');
      definePopUpRequest(option);
    });
  }
}

function definePopUpRequest(option){
  switch (option) {
    case 'createFolder':
      validateInput();
      break;
    case 'cancel':
      hideNewFolderPopUp();
      break;
  }
}

function validateInput() {
  console.log('валидация инпута');
  let input = document.querySelector('#newFileForm > input');
  let filesList = document.querySelectorAll('#menuArea > ul > li > a');
  
  let namesList = [];
  for(let i = 0; i < filesList.length; i++){
    namesList.push(filesList[i].getAttribute('data-fileName'));
  }

  console.log(namesList);
  if(checkEmptyString(input)){
    
    if(checkIfFileExists(input, namesList)){
      console.log('такой папки нет создаем');
      createFolderRequest(input.value);
      hideNewFolderPopUp();
    }
  }
}

function checkEmptyString(input){
  if( (input.value).trim() === '') {
      console.log('пустая строка');
      // изменить рамку на красную
      // изменить текст плейсхолдера
      input.classList.add('popUpInputError');
      input.placeholder = 'заполните поле';

      input.onfocus = function(){
        input.classList.remove('popUpInputError');
        input.placeholder = 'введите имя файла';
      };
    return false;
  }else{
    return true;
  } 
}

function checkIfFileExists(input, namesList){
  let fileExists = namesList.includes(input.value);
  if(fileExists){

    input.classList.add('popUpInputError');
    input.value = '';
    input.placeholder = 'такой файл уже существует';
    

    input.onfocus = function(){
        input.classList.remove('popUpInputError');
        input.placeholder = 'введите имя файла';
    };
    return false;
  }else{
    return true;
  }
}

function createFolderRequest(folderName) {
  console.log('отправить запрос на создание файла');

  let xhr = new XMLHttpRequest();
  xhr.open('GET', 'createFolder.php?folderName='+folderName);
  xhr.send();

  xhr.onreadystatechange = function(){
    if(xhr.readyState === 4 && xhr.status === 200){
      let response = xhr.responseText;

      if(response === 'error'){
        console.log('Ошибка при создании папки. Попробуйте еще раз');
      }else {
        insertFolder(response, folderName);
        // если папка была пустая и динамически добавили новую папку нужно убрать надпись
        hideWarning();
      }
    }
  }
}

function insertFolder(response, folderName){
  let folderInfo = JSON.parse(response);
  let folderPath = folderInfo.path;
  let folderPosition = folderInfo.folderPlace;

  let menuArea = document.getElementById('menuArea');
  let li = document.createElement('li');
  let a = document.createElement('a');
  let i = document.createElement('i');
  let ulFolders = document.getElementById('foldersList');
  let pos = ulFolders.children[folderPosition];
  console.log(pos);

  a.href = '/main.php?path=' + folderPath;
  a.classList.add('dropDown');
  a.setAttribute('data-filename', folderPath);
  
  a.classList.add('dropDown');
  
  i.className = 'fas fa-folder';

  a.appendChild(i);
  a.innerHTML += ' ' + folderName;
  li.appendChild(a);

  

  ulFolders.insertBefore(li, pos);

  a.addEventListener('contextmenu', showMenu);  
}

function hideWarning(){
  let warning = document.querySelector('#menuArea > h4');
  
  if(warning){
    warning.remove();
  }
}

function hideNewFolderPopUp(){
  if(newFolderPopUpShown){

    let newFolderPopUpDiv = document.getElementById('newFolderPopUpMenu');
    console.log('прячет поп ап куда вводится имя файла');

    newFolderPopUpDiv.remove();
    document.removeEventListener('click', hideNewFolderPopUp);
    newFolderPopUpShown = false;   
  }
}


function hideGeneralMenu(e) {

  if(generalMenuShown){
  let generalMenu = document.getElementById('generalMenu');
    if(generalMenu !== e.target){
    console.log('прячет общее меню');

    generalMenu.remove();
    document.removeEventListener('click', hideGeneralMenu);
    generalMenuShown = false;
    }
  }
}
