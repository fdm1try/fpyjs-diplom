/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    let params = new URLSearchParams(options.data);
    options.url += `?${params}`;
    xhr.responseType = 'json';
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === xhr.DONE){
            if (xhr.status < 200 || xhr.status >= 300){
                let error = xhr.response ? xhr.response : new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
                return options.callback(error);
            }
            options.callback(null, xhr.response);
        }
    });
    try {
        xhr.open(options.method, options.url);
        if (options.headers){
            for (let header in options.headers){
                xhr.setRequestHeader(header, options.headers[header]);
            }
        }        
        xhr.send();
    } catch (error) {
        options.callback(error);
    }
};
