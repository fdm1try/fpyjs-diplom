/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */
class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';

  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken(){
    let token = window.localStorage.getItem('YANDEX_DISK_TOKEN');
    if (!token){
      token = prompt('Укажите токен от яндекс диска:');
      window.localStorage.setItem('YANDEX_DISK_TOKEN', token);
    }
    return token;
  }

  static resetToken(){
    window.localStorage.removeItem('YANDEX_DISK_TOKEN');
  }

  static #awaitOperation(id, callback) {
    const url = `${this.HOST}/operations/${id}`;
    const check = () => {
      createRequest({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': `OAuth ${this.getToken()}`
        }, callback: (error, response) => {
          if (error){
            return callback(error);
          }
          switch (response.status){
            case 'in-progress':
              return setTimeout(check, 500);
            default:
              return callback(error, response);
          }
        }
      })
    }
    check();
  }

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback){
    createRequest({
      method: 'POST',
      url: `${this.HOST}/resources/upload`,
      data: {
        path: path,
        url: url
      },
      headers: {
        'Authorization': `OAuth ${this.getToken()}`
      }, 
      callback: (error, response) => {
        if (error){
          if ('error' in error && error.error === 'UnauthorizedError'){
            alert('Ошибка авторизации, токен не действителен.');
            this.resetToken();
            return this.removeFile(path, callback);
          }
          return callback(error);
        }
        let operationId = response.href.slice(response.href.lastIndexOf('/') + 1);
        return this.#awaitOperation(operationId, callback);
      }
    })
  }

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback){
    createRequest({
      method: 'DELETE',
      url: `${this.HOST}/resources`,
      data: {
        path: path
      },
      headers: {
        'Authorization': `OAuth ${this.getToken()}`
      }, 
      callback: (error, response) => {
        if (error && 'error' in error && error.error === 'UnauthorizedError'){
          alert('Ошибка авторизации, токен не действителен.');
          this.resetToken();
          return this.removeFile(path, callback);
        }
        return callback(error, response);
      }
    })
  }

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback){
    createRequest({
      method: 'GET',
      url: `${this.HOST}/resources/files`,
      data: {
        limit: 1000
      },
      headers: {
        'Authorization': `OAuth ${this.getToken()}`
      }, 
      callback: (error, response) => {
        if (error && 'error' in error && error.error === 'UnauthorizedError'){
          alert('Ошибка авторизации, токен не действителен.');
          this.resetToken();
          return this.getUploadedFiles(callback);
        }
        return callback(error, response);
      }
    })
  }

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(url){
    let a = document.createElement('a');
    Object.assign(a, {
      target: '_blank',
      href: url,
      rel: 'noopener noreferrer'
    });
    a.click();
  }
}
