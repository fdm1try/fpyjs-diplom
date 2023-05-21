/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {

  constructor( element ) {
    super(element);
    this.imagesListContainer = this.container.getElementsByClassName('content')[0];
    this.items = this.container.getElementsByClassName('image-preview-container');
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents(){
    this.element[0].addEventListener('click', (event) => {
      let classList = event.target.classList;
      if (classList.contains('x') || classList.contains('close')){
        return this.close();
      } else if (classList.contains('send-all')){
        this.sendAllImages();
      } else if (event.target.closest('.ui.action.input') && (classList.contains('button') || classList.contains('upload'))){
        let imageContainer = event.target.closest('.image-preview-container');
        return this.sendImage(imageContainer);
      }
    })
  }

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    this.imagesListContainer.innerHTML = images.reverse().map(this.getImageHTML).join('\n');
  }

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `
    <div class="image-preview-container">
      <img src='${item}' />
      <div class="ui action input">
        <input type="text" placeholder="Путь к файлу">
        <button class="ui button"><i class="upload icon"></i></button>
      </div>
    </div>
    `
  }

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    Array.from(this.items).forEach((item) => this.sendImage(item));
  }

  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    let actions = imageContainer.getElementsByClassName('action')[0];
    let input = actions.getElementsByTagName('input')[0];
    if (input.value === ''){
      return actions.classList.add('error');
    }
    let button = actions.getElementsByTagName('button')[0];
    actions.classList.remove('error');
    input.classList.add('disabled');
    button.classList.add('disabled');
    let imageURL = imageContainer.getElementsByTagName('img')[0].src;
    Yandex.uploadFile(input.value, imageURL, (error, response) => {
      if (error) {
        actions.classList.add('error');
        alert(`${error}`);
        input.classList.remove('disabled');
        button.classList.remove('disabled');
      } else {
        imageContainer.remove();
        if (!this.items.length){
          this.close();
        }
      }
    });
  }
}