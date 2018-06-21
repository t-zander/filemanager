// показать меню
// при клике на пункт меню
// спрятать меню
// выполнить какое то действие
window.addEventListener('load', initMenu);

let currentItem = null; // выбранный пункт меню

function initMenu(){
  // console.log("функция добавление ивента на клик по меню");
  document.addEventListener('click', function(){
    hideMenu();
  });

  // let listElements = document.querySelectorAll("#menu>li>a");  - ошибка
  let listElements = document.querySelectorAll("#menu>li");

  //добавить листенер для клика по элементу списка
  for(let i = 0; i < listElements.length; i ++){
    listElements[i].addEventListener('contextmenu', function(event){
      event.stopPropagation();
      event.preventDefault();
      showMenu(event.target);
    });
  }
}

function createMenu(){
  let menu = document.createElement("div");
  menu.id = 'contextMenu';
  let list = document.createElement("ul");

  let options = ['удалить', 'переименовать'];

  //добавить li в ul
  for (let i = 0; i < options.length; i ++){
    let li = document.createElement("li");
    li.innerHTML = options[i];
    list.appendChild(li);
  }

  // что бы меню не пряталось при клике на него
  menu.addEventListener('click', function(event){
    event.stopPropagation();
  });

  menu.appendChild(list);
  document.body.appendChild(menu);

  return menu;
}

function getMenu(){
  let menu;
  menu = document.getElementById("contextMenu");
  if(menu){
    return menu;
  } else {
    return createMenu();
  }
}

function showMenu(item){
  if(item !== currentItem){
    if(item !== null) hideMenu();
    currentItem = item;
    console.log(['функция показа контекстного меню', item.firstChild.nodeValue]);

    let menu = getMenu();
  }
}

/*function sendRequest() {
  console.log("функция выполняется при клике на опцию");
}*/

function hideMenu(){
  if(currentItem){
    let menu = getMenu();

    if(menu){
      console.log("hide menu function, hides menu");
      menu.remove();
      /*document.removeEventListener("click", hideMenu);*/
    }

    currentItem = null;
  }
}

