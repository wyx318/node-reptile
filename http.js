const http = require('http');

http.get('http://www.baidu.com', function (response) {
  response.setEncoding('utf8')
//有个on方法 请求成功返回数据
  response.on('data', function (res) {
    console.log(res);
  })
});
