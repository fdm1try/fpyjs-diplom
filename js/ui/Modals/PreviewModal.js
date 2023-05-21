/**
 * Класс PreviewModal
 * Используется как обозреватель загруженных файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor( element ) {
    super(element);
    this.content = this.container.getElementsByClassName('content')[0];
    this.loader = this.content.getElementsByTagName('i')[0];
    this.items = this.content.getElementsByClassName('image-preview-container');
    this.registerEvents();
  }

  set loaderActive(active){
    this.loader.classList[active ? 'add' : 'remove']('icon', 'spinner', 'loading');
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    this.container.addEventListener('click', (event) => {
      if (event.target.classList.contains('x')){
        return this.close();
      }
    });
    this.content.addEventListener('click', (event)=> {
      if (event.target.classList.contains('delete')){
        event.target.classList.add('disabled');
        this.loaderActive = true;
        const imageContainer = event.target.closest('.image-preview-container');        
        Yandex.removeFile(event.target.dataset.path, (error, response) => {
          if (!error){
            imageContainer.remove();
            this.loaderActive = false;
          } else {
            alert(`${error}`);
            event.target.classList.remove('disabled');
          }          
        })
      } else if (event.target.classList.contains('download')){
        Yandex.downloadFileByUrl(event.target.dataset.file);
      }
    });
  }


  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    for (let item of this.items){
      item.remove();
    }
    let html = data.reverse().map((item) => this.getImageInfo(item)).join('\n');
    this.content.insertAdjacentHTML('beforeend', html);    
    this.loaderActive = false;
  }

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    let month = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ][date.getMonth()];
    return `${date.getDate()} ${month} ${date.getFullYear()} г. в ${date.getHours()}:${date.getMinutes()}`;
  }

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    return `
    <div class="image-preview-container">
      <img src="${item.preview}" referrerpolicy="no-referrer"/>
      <table class="ui celled table">
      <thead>
        <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
      </thead>
      <tbody>
        <tr><td>${item.name}</td><td>${this.formatDate(new Date(item.created))}</td><td>${(item.size / 1024).toFixed(2)} Кб</td></tr>
      </tbody>
      </table>
      <div class="buttons-wrapper">
        <button class="ui labeled icon red basic button delete" data-path="${item.path}">
          Удалить
          <i class="trash icon"></i>
        </button>
        <button class="ui labeled icon violet basic button download" data-file="${item.file}">
          Скачать
          <i class="download icon"></i>
        </button>
      </div>
    </div>
    `;
  }
}
