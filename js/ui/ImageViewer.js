/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor( element ) {
    this.container = element;
    this.buttons = {
      selectAll: element.querySelector('.button.select-all'),
      showUploadedFiles: element.querySelector('.button.show-uploaded-files'),
      send: element.querySelector('.button.send')
    }
    this.imagesListContainer = document.createElement('div');
    element.querySelector('.images-list').appendChild(this.imagesListContainer);
    this.items = this.imagesListContainer.getElementsByClassName('image-wrapper');
    this.selectedImages = this.imagesListContainer.getElementsByClassName('selected');
    this.previewImage = element.querySelector('.image');
    this.previewImage.dataset.default = this.previewImage.src;
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents(){
    this.imagesListContainer.addEventListener('click', (event) => {
      if(event.target.parentElement.classList.contains('image-wrapper')){
        event.stopPropagation();
        if (event.detail === 2){
          this.previewImage.src = event.target.src;
        } else {
          event.target.classList.toggle('selected');
          this.checkButtonText();
        }
      }
    });

    this.buttons.selectAll.addEventListener('click', () => {
      let select = this.selectedImages.length === 0;
      for (let item of this.items){
        let img = item.getElementsByTagName('img')[0];
        img.classList[select ? 'add' : 'remove']('selected');
      }
      this.checkButtonText();
    });

    this.buttons.send.addEventListener('click', (event) => {
      let modal = App.getModal('fileUploader');
      let photos = Array.from(this.selectedImages).map(img => img.src);
      modal.showImages(photos);
      modal.open();
    });

    this.buttons.showUploadedFiles.addEventListener('click', (event) => {
      let modal = App.getModal('filePreviewer');
      modal.open();
      Yandex.getUploadedFiles((error, response) => {
        if (error){
          alert(`${error}`);
          return modal.close();
        }
        modal.showImages(response.items.filter((item) => item.media_type === 'image'));
      })
    })
  }

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    this.imagesListContainer.innerHTML = '';
  }

  /**
   * Отрисовывает изображения.
  */
  drawImages(images) {
    for (let image of images) {
      const wrapper = document.createElement('div');
      wrapper.classList.add('four', 'wide', 'column', 'ui', 'medium', 'image-wrapper');
      const img = document.createElement('img');
      img.src = image;
      img.onerror = () => wrapper.remove();
      wrapper.appendChild(img);
      this.imagesListContainer.appendChild(wrapper);
    }
    this.checkButtonText();
  }

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText(){
    if (this.items.length){
      this.buttons.selectAll.classList.remove('disabled');
    } else {
      this.buttons.selectAll.classList.add('disabled');
    }
    if (this.selectedImages.length){
      this.buttons.send.classList.remove('disabled');
      this.buttons.selectAll.textContent = 'Снять выделение';
    } else {
      this.buttons.send.classList.add('disabled');
      this.buttons.selectAll.textContent = 'Выбрать всё';
    }
  }
}