<template>
  <div id="pay">
    <div class="title" ref="title">
      <img class="title_img" v-if="pay_type==1" :src="title_img_zfb" alt />
      <img class="title_img" v-if="pay_type==2" :src="title_img_wx" alt />
    </div>
    <div class="header mt10 pb20" ref="header">
      <p class="total pt10 mb10">¥ {{totalPrice}}</p>
      <!--  <p v-else>请刷新页面,重新获取支付二维码</p>-->

      <p class="expire_desc mb5">请在有效期内完成支付</p>
      <div id="qrcode" class="qrcode mt10" ref="qrcode">
        <!--  <img v-if="radio == 2" class="icons" :src="img_wx" alt="微信小图标" />
        <img v-if="radio == 1" class="icons" :src="img_zhifubao" alt="支付宝小图标" />-->
      </div>
      <p class="expire_time">过期时间: {{expire_time}}</p>
      <p class="order">订单号: {{order}}</p>
      <div class="expire_show mt10">
        <span>00时</span>
        <span class="mide_time">{{min}}分</span>
        <span>{{sec}}秒</span>
      </div>
    </div>
    <!-- <p v-if="!payState" class="mt10">正在加载中...</p> -->
    <div class="footer mt10 pt10" ref="footer">
      <div class="scan_type mt20">
        <p class="scan_wrap mr10">
          <img class="scan_img" :src="scan_img" alt="scan code" />
        </p>
        <p class="ml10" v-if="pay_type==1">打开支付宝【扫一扫】</p>
        <p v-if="pay_type==2">打开微信【扫一扫】</p>
      </div>

      <div class="mt20 mb20">
        <el-button type="success" @click="jump">点击入群</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
export default {
  name: "index",
  data() {
    return {
      title: "欢迎来到创业联盟",
      title_img_zfb: require("../../static/zhifubaozhifu.jpeg"),
      title_img_wx: require("../../static/wx88.jpg"),
      img_src: require("../../static/demoimg.png"),
      flag: true,
      payState: false,
      totalPrice: 199,
      payWay: "alipay" /* alipay:支付宝 wechat:微信 mipay:第三方聚合支付方式*/,
      pay_type: "2" /* 1:支付宝 2:微信 */,
      img_wx: require("../../static/wx55.png"),
      scan_img: require("../../static/scan.png"),
      img_zhifubao: require("../../static/logo_alipay.png"),
      qrcode: "" /* 后台返回的支付二维码链接 */,
      expire_time: "" /* 二维码过期时间 */,
      order: "" /* 订单号 */,
      min: "" /*  倒计时:分 */,
      sec: "" /*  倒计时:秒 */
    };
  },
  watch: {
    pay_type(newVal, oldVal) {
      if (newVal == "1") {
        // 支付宝支付
        this.pay_type = "1";
        this.$refs.qrcode.innerHTML = "";
        this.getPayInfos({ type: newVal });
      } else {
        // 微信支付
        this.pay_type = "2";
        this.$refs.qrcode.innerHTML = "";
        this.getPayInfos({ type: newVal });
      }
    }
  },
  created() {
    var body = document.getElementsByTagName("body")[0];
    body.setAttribute("class", "bodyBackColor");
    var type = this.$route.params.type;
    this.pay_type = type;
    var user_info = JSON.parse(sessionStorage.getItem("domain"));
    user_info.type = type;

    debugger;
    this.getPayInfos(user_info);
  },
  mounted() {
    var expire_time = "2020-05-22 18:20:23";
    /* this.countdown(expire_time); */
  },
  //当离开页面时，清除倒计时
  beforeDestroy() {
    clearInterval(this._interval);
  },

  methods: {
    /**
     * 跳转到扫描二维码界面（需要先判断用户是否已经支付完成）
     */
    jump() {
      var order = sessionStorage.getItem("order");
      var data = {
        order
      };
      this.$http /* 生产环境的地址 */
        .post("http://www.hbwjshan.com:8001/index/getInfos", data)
        .then(res => {
          debugger;
          var result = res.data;
          if (result.code == 1) {
            // 付款成功 将状态存入sessitionStorage
            sessionStorage.setItem("state",1);
            this.$router.push("/admin");
          } else {
            // 付款失败
            this.$message({
              message: "扫码支付成功后,才能进群哦!",
              center: true,
              type: "error"
            });
          }
        })
        .catch(err => {
           this.$message({
              message: "网络错误,请刷新页面!",
              center: true,
              type: "error"
            });
          console.log(err)
        });
    },
    /**
     * 自动设置footer 高度
     */
    auto_set_footer_height() {
      var total_height = document.body.offsetHeight;
      var title_height = this.$refs.title.offsetHeight;
      var header_height = this.$refs.header.offsetHeight;
      var set_margin_height = 40;

      this.$refs.footer.style.height =
        total_height - title_height - header_height - set_margin_height + "px";
    },
    /**
     * 倒计时
     * params: expire_time : 2020-03-23 18:50:23
     */
    countdown(expire_time) {
      /* 生成倒计时 */
      const end = Date.parse(new Date(expire_time));
      const now = Date.parse(new Date());
      const msec = end - now;
      let min = parseInt((msec / 1000 / 60) % 60);
      let sec = parseInt((msec / 1000) % 60);
      this.min = min > 9 ? min : "0" + min;
      this.sec = sec > 9 ? sec : "0" + sec;
      if (this.min == 0 && this.sec == 0) {
        clearInterval(this._interval);
        return;
      } else {
        this._interval = setTimeout(() => {
          this.countdown(expire_time);
        }, 1000);
      }
    },
    /**
     * 生成二维码
     */
    crateQrcode() {
      this.qr = new QRCode("qrcode", {
        width: 200,
        height: 200, // 高度
        text: this.qrcode // 二维码内容
        // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        // background: '#f0f'
        // foreground: '#ff0'
      });
    },
    getPayInfos(data) {
      this.$http /* 生产环境的地址 */
        .post("http://www.hbwjshan.com:8001/index/getInfos", data)
        
        /*  开发环境地址 */
        .then(res => {
          var res_data = res.data;
          if (res_data.code == 1) {
            // 成功
            this.payState = true;
            this.totalPrice = res_data.data.pay_price / 100;
            this.payWay = res_data.data.pay_way;
            this.order = res_data.data.order_sn;
            this.expire_time = res_data.data.expire_at;
            this.qrcode = res_data.data.qr;
            sessionStorage.setItem("order", res_data.data.out_order_sn);
            this.$refs.qrcode.innerHTML = ""; /* 清除已有的二维码 */
            var that = this;
            this.$nextTick(() => {
              that.crateQrcode();
              that.auto_set_footer_height();
            });
            clearInterval(that._interval);
            this.countdown(res_data.data.expire_at);
          } else {
            this.payState = true;
            this.totalPrice = 0;
          }
        })
        .then(err => {
          console.log(err);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#pay {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .title {
    width: 100%;
    margin: 0 auto;
    background-color: #ffffff;
    .title_img {
      width: 100px;
      height: 50px;
    }
  }
  .header {
    width: 100%;
    background-color: #fff;

    .qrcode {
      width: 200px;
      height: 200px;
      margin: 0 auto;
      position: relative;
      .icons {
        position: absolute;
        top: 40%;
        left: 40%;
        right: 40%;
        bottom: 40%;
        width: 40px;
        height: 40px;
        color: green;
      }
    }
    .total {
      font-size: 30px;
      margin: 0 auto;
      margin-bottom: 10px;
    }
    .expire_desc,
    .expire_time {
      color: green;
      font-size: 14px;
      text-align: center;
    }

    .expire_time {
      color: #db5155;
    }
    .order {
      text-align: center;
      font-size: 14px;
    }
    .expire_show {
      display: flex;
      justify-content: center;
      span {
        padding: 3px 5px;
        background: #7FBE50;
        color: #fff;
        font-size: 14px;
        border-radius: 5px;
      }
      .mide_time {
        margin: 0 15px;
      }
    }
    p {
      text-align: center;
    }
  }
}

.footer {
  width: 100%;
  background-color: #fff;
  .scan_type {
    display: flex;
    justify-content: center;
    align-items: center;
    /* border-top: 1px dashed #ccc; */
    /* padding-top: 30px; */
    .scan_wrap {
      .scan_img {
        width: 40px;
        height: 40px;
      }
    }

    p {
      font-size: 18px;
    }
  }
  span {
    display: inline-block;
    font-size: 40px;
    color: green;
  }
}
.el-radio__label {
  font-size: 28px !important;
}
</style>
