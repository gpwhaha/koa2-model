var COS = require('cos-nodejs-sdk-v5');
// var cos = new COS({
//     SecretId: 'AKIDEEo7j4azX6PkobfV9ZZOzLQbdZNHRQ5V',
//     SecretKey: 'hBuVt3xlXKrdDWaOxVnuktmQoyzkqjPU'
// });
// cos.putBucket({
//   Bucket: 'gpw-9708-1304091163',
//   Region: 'ap-nanjing'
// }, function(err, data) {
//   console.log(err || data);
// });
// cos.getBucket({
//   Bucket: 'gpw-9708-1304091163', /* 必须 */
//   Region: 'ap-nanjing',     /* 必须 */
//   Prefix: 'images/',           /* 非必须 */
// }, function(err, data) {
//   console.log(err || data.Contents);
// });
// cos.putObject({
//   Bucket: 'gpw-9708-1304091163', /* 必须 */
//   Region: 'ap-nanjing',    /* 必须 */
//   Key: 'exampleobject',              /* 必须 */
//   StorageClass: 'STANDARD',
//   Body: fs.createReadStream('./exampleobject'), // 上传文件对象
//   onProgress: function(progressData) {
//       console.log(JSON.stringify(progressData));
//   }
// }, function(err, data) {
//   console.log(err || data);
// });

const cosUtil = {
  cos: null,

  Bucket: 'gpw-9708-1304091163',  // 存储桶名称
  Region: 'ap-nanjing',   // 存储桶区域
  Prefix: '/images',   // 路径前缀

  // 初始化配置
  init(config) {
      if(config){
          this.Bucket = config.Bucket || this.Bucket;
          this.Region = config.Region || this.Region;
          this.Prefix = config.Prefix || this.Prefix;
      }

      // 下面两个密钥，需要在腾讯云获取
      this.cos = new COS({
          SecretId: 'AKIDEEo7j4azX6PkobfV9ZZOzLQbdZNHRQ5V',   // 密钥id
          SecretKey: 'hBuVt3xlXKrdDWaOxVnuktmQoyzkqjPU'  // 密钥key
      });
  },

  putObject(param, callback) {
      return new Promise((resolve, reject) => {
          this.cos.putObject({
              Bucket: this.Bucket, /* 必须 */
              Region: this.Region,    /* 必须 */
              Key: param.key,              /* 必须 */
              Body: param.buffer, /* 必须 */
          }, function (err, data) {
              if (err) {
                  reject(err);
                  console.log('err:',err)
                  return;
              }
              resolve(data)
              console.log('URL:',data)
          });
      })
  }
}


module.exports = cosUtil