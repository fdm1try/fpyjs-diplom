/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor( element ) {
    this.container = element;
    this.inputElement = element.querySelector('input[type="text"]');
    this.registerEvents();
  }

  get userInput(){
    return this.inputElement.value.trim();
  }

  set userInput( value ){
    this.inputElement.value = value;
  }
  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents(){
    this.container.addEventListener('click', (event) => {
      const element = event.target;
      if (element.classList.contains('button')){
        let userInput = this.userInput;
        if (!userInput){
          return;
        }
        if (!/^[1-9]\d*$/.test(userInput)){
          this.userInput = '';
          return alert('Введите ID пользователя VK, целое число не менее 1.');
        }
        if (element.classList.contains('replace')){
          return this.replaceImages(this.userInput);
        }
        if (element.classList.contains('add')){
          return this.addImages(this.userInput);
        }
      }
    })
  }

  replaceImages(vkUserId){
    App.imageViewer.clear();
    this.addImages(vkUserId);
  }

  addImages(vkUserId){
    VK.get(vkUserId, function(photos){
      App.imageViewer.drawImages(photos);
    });
  }

}