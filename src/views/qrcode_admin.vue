<template>
  <div id="qrcode_admin">
    <div class="header">
      <p class="title mb15">请用微信扫描下方二维码添加好友</p>
      <p class="desc">
        并在发送添加朋友申请处填入信息:
        <span class="importInfo">我爱创业</span>
      </p>
      <p class="mt15 demo">示例:</p>
      <p>
        <img class="demo_img" src="http://img.hbwjshan.com/image/pay_user/mask_info.png" alt />
      </p>
    </div>
    <div class="qrcode">
      <img src="http://img.hbwjshan.com/image/pay_user/wangjiashan_qrcode.jpg" alt />
    </div>
    <div class="footer mt20">
        <p>添加好友发送成功后,系统会自动邀请你入群 .</p>
    </div>
  </div>
</template>

<script>
/* http://img.hbwjshan.com/image/pay_user/wangjiashan_qrcode.jpg */
/* http://img.hbwjshan.com/image/pay_user/mask_info.png */
export default {
  name: "qrcode_admin",
  data() {
    return {};
  },
  created(){
      var state = sessionStorage.getItem("state");
      if (state != 1){
          // 未支付或未支付成功
        this.$router.push("／")
      }
  },
};
</script>

<style lang="scss" scoped>
#qrcode_admin {
  padding: 10px 15px;
  .header {
    margin-top: 30px;
    .importInfo {
      font-size: 18px;
      color: #ff0000;
      font-weight: bold;
    }
    .demo {
      font-size: 14px;
      text-align: left;
    }
    .demo_img {
      width: 300px;
      height: auto;
    }
    .title {
      text-align: center;
      font-size: 18px;
      color: green;
      font-weight: bold;
    }
    .desc {
      text-align: left;
      font-size: 16px;
    }
  }
  .qrcode {
    margin: 0 auto;
    img {
      width: 300px;
      height: 300px;
    }
  }
  .footer{
      
      font-size:14px;
      color:#ccc;
  }
}
</style>