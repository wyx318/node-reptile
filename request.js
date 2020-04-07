// 本项目用到的插件库     1、 require请求库  2、iconv-lite JS转换库   3 .puppeteer 强大的爬虫库
// npm 插件库 require请求库 已经废弃不更新了
const request = require('request');
// iconv-lite JS转换库
var iconv = require('iconv-lite');
//请求库 服务端请求库 类似于jquery  最主要的爬虫库
const cheerio = require('cheerio');
// fs保存数据 模块
const fs = require('fs');
//将请求库 封装一下
const requestPromise = (url) => {
  return new Promise((resolve, reject) => {
    request(url, {encoding: null}, function (error, response, body) {
      //判断是不是请求成功
      if (response.statusCode === 200) {
        //转码
        const bufs = iconv.decode(body, 'gb2312');
        const html = bufs.toString('utf8');
        resolve(html)
      } else {
        reject(error)
      }
    });
  })
};

//获取数据
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

//解析数据  精准查找爬取内容
const getMovieDetail = async (url) => {
  const html = await requestPromise(host + url);
  const $ = cheerio.load(html);
  // console.log(html);
  //爬取具体内容
  const movie = {
    //具体操作 再要选中的元素上 右击 copy selector  复制选择器 电影名称
    name: $('#header > div > div.bd2 > div.bd3 > div.bd3l > div.co_area2 > div.title_all > h1 > font').text(),
    //电影详情
    desc: $('#Zoom > span > p:nth-child(1)').text(),
    //电影封面图片地址
    picture: $('#Zoom > span > p:nth-child(1) > img').attr('src')
  };
  //文件保存
  fs.appendFile('./public/index.js', JSON.stringify(movie), function () {
    console.log('执行完成');
  });
  console.log(movie);
};
//获取所有的页数
const arr = [];
for (let i = 1; i < 225; i++) {
  // arr.push(`${host}/html/gndy/oumei/list_7_${i}.html`)
  //一下请求所有数据
  getList(`${host}/html/gndy/oumei/list_7_${i}.html`);
}
console.log(arr);
//执行异步操作 等一个getList 执行 完毕之后 在继续执行操作 arr.reduce 累积完成，
arr.reduce((rs, url) => {
  return rs.then(() => {
    return new Promise(async (resolve) => {
      await getList(url);
      resolve()
    })
  })
}, Promise.resolve());
