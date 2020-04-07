# node-reptile
###node.js爬虫小项目 
本项目采用以下几个node库

- ```require请求库 ```
 类似http(请注意目前此库 已经不更新)
 
 - ```iconv-lite JS转换库```
对请求的文件格式进行转码
```

var iconv = require('iconv-lite');
//转码
const bufs = iconv.decode(body, 'gb2312');
const html = bufs.toString('utf8');
```

- ```cheerio``` 服务端请求库 类似于jquery  本项主要的爬虫库
```

//获取数据
const cheerio = require('cheerio');
const url = '/html/gndy/oumei/list_7_2.html';
const host = 'https://www.ygdy8.net';
//最后封装一下 请求目标网页上所有页数 采用异步方式 获取每一个单页面
const getList = async (url) => {
  const html = await requestPromise(url);
  const $ = cheerio.load(html);
//查找需要的内容 逐一分解
  $('.co_content8 ul table tbody tr:nth-child(2) td:nth-child(2) b a:nth-child(2)').each((i, item) => {
    getMovieDetail($(item).attr('href'));
  });
};
```
- 
