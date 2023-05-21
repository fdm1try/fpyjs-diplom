/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */
const VK_PHOTO_SIZE_TYPES = ['s', 'm', 'o', 'p', 'q', 'r', 'x', 'y', 'z'];
class VK {
  static ACCESS_TOKEN = '';
  static lastCallback;

  /**
   * Получает изображения
   * */
  static get(id = '', callback){
    if (!this.ACCESS_TOKEN){
      this.ACCESS_TOKEN = prompt('Укажите токен доступа VK:');
    }
    let script = document.createElement('script');
    const params = new URLSearchParams({
      'owner_id': id,
      'album_id': 'profile',
      count: 1000,
      state: id,
      rev: 1,
      v: '5.131',
      'access_token': this.ACCESS_TOKEN,
      callback: 'VK.processData'
    });
    script.src = `https://api.vk.com/method/photos.get?${params}`;
    this.lastCallback = callback;
    this.lastCallback.scriptNode = script;
    document.getElementsByTagName("head")[0].appendChild(script);
  }


  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result){
    if (result.error){
      alert(`VK API ERROR ${result.error.error_code}: ${result.error.error_msg}`);
    } else {
      const photos = result.response.items.map((item) => {
        return item.sizes.reduce((largest, size) => {
          if (!largest || largest.type === size.type) return size;
          const isLargest = VK_PHOTO_SIZE_TYPES.indexOf(size.type) - VK_PHOTO_SIZE_TYPES.indexOf(largest.type);
          return isLargest ? size : largest;
        }).url;
      });
      this.lastCallback(photos);
    }
    if (this.lastCallback.scriptNode){
      this.lastCallback.scriptNode.remove();
    }
    this.lastCallback = () => {};
  }
}


/*
https://oauth.vk.com/authorize?client_id=51453402&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=friends&response_type=token&v=5.131
*/