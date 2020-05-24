<template>
  <div id="index">
    <div class="box" ref="box">
      <div class="header" ref="header">{{title}}</div>
      <div class="part1 mb10">
        <p class="group_title">群主&ensp;{{owner}}</p>
        <p class="group_desc pl15 pr15">{{owner_desc}}</p>
      </div>
      <div class="part2 mb10">
        <p class="group_title">社群介绍</p>
        <p
          class="group_desc pl15 pr15"
          :class="{'group_desc_control':flag==1}"
          ref="desc"
        >{{group_desc}}</p>
        <p class="show_and_hidden" v-if="flag==2" @click="operate">收起</p>
        <p class="show_and_hidden" v-if="flag==1" @click="operate">点击展开</p>
      </div>
      <div class="part3 mb10">
        <div class="notice">
          <p class="notice_title">付费须知</p>
          <p class="price pr10">¥ {{now_price}}</p>
          <div style="clear: both;"></div>
        </div>

        <p
          class="notice_desc pl15 pr15"
          v-for="(item,i) in notice_list"
          :key="i"
        >{{i+1}}.&emsp;{{item}}</p>
      </div>
      <div class="part4 mb10">
        <p class="leave_msg">为了更好的与您进行沟通和指导,请正确输入您的手机号码.</p>

        <el-input v-model="phone" type="number" placeholder="请输入您的手机号码"></el-input>
      </div>
      <div class="part5 mt10">
        <p class="select_type mb10">请选择支付方式:</p>
        <el-radio v-model="radio" label="1">支付宝</el-radio>
        <el-radio v-model="radio" label="2">微信</el-radio>
      </div>
    </div>

    <div class="footer" ref="footer" v-show="hidshow">
      <div class="price_desc">
        <span class="pay_price">¥ {{now_price}}</span>
        <span class="old_price">¥ {{old_price}}</span>
        <p class="expire_time">有效期 1 年</p>
      </div>
      <div :plain="true" class="btn_in" @click="add_in">立即加入</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      title: "创业联盟",
      host: "" /* 当前访问地址的主机号 */,
      domain: "" /* 当前访问地址的端口号/域名 */,
      flag: 0 /* 0:不显示，1：展开  2：收起 */,
      owner: "资深自媒体达人",
      now_price: 1 /* 单位为元 */,
      old_price: 1 /*  单位为元 */,
      phone: "",
      radio:"1",/* 1:支付宝  2:微信*/
      owner_desc: "5年互联网自媒体经验,年入千万,曾带领百名学员实现月入10万。",
      group_desc:
        "创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，引流，变现创业，营销，引流，变现 营销，引流，变现 创业，营销，引流，变现创业，营销，引流，变现",
      notice_list: [
        "创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，",
        "创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，试试测试",
        "创业，营销，引流，变现 创业，营销，引流，变现 创业，营销，试试测试"
      ],
      docmHeight: document.documentElement.clientHeight, //默认屏幕高度
      showHeight: document.documentElement.clientHeight, //实时屏幕高度
      hidshow: true //显示或者隐藏footer
    };
  },
  created() {
    debugger;
    var search  = window.location.search;
    
    var host = window.location.host;
    this.domain = window.location.port;
  },
  watch: {
    showHeight: function() {
      if (this.docmHeight > this.showHeight) {
        this.hidshow = false;
      } else {
        this.hidshow = true;
      }
    }
  },
  mounted() {
    // window.onresize监听页面高度的变化
    window.onresize = () => {
      return (() => {
        this.showHeight = document.body.clientHeight;
      })();
    };
    var str_length = this.$refs.desc.innerHTML.length;
    if (str_length > 300) {
      this.flag = 1;
    } else {
      this.flag = 0;
    }
  },
  methods: {
    /**
     * 展开，收起的切换
     */
    operate() {
      if (this.flag == 1) {
        this.flag = 2;
        var total_height = document.body.offsetHeight;
        var footer_height = this.$refs.footer.offsetHeight;
        var page_user_height = total_height - footer_height;
        var box_height = this.$refs.box.offsetHeight;
        this.$refs.box.style.height = total_height - footer_height - 30 + "px";
      } else if (this.flag == 2) {
        this.flag = 1;
      }
    },
    /**
     * 立即加入
     */
    add_in() {
      var phone = this.phone.trim();
      if (!phone) {
        this.$message({
          message: "手机号码不能为空,新正确输入!",
          center: true,
          type: "error"
        });
        return false;
      }
      if (!/^1[3456789]\d{9}$/.test(phone)) {
        this.$message({
          message: "手机号码不正确,请检查后重新输入!",
          center: true,
          type: "error"
        });
        return false;
      }
      /* 将当前用户信息存入sessionStorate 后面用于判断 */
      var user_info = {
        domain: this.domain,
        phone: this.phone,
        price: this.now_price
      };
      sessionStorage.setItem("domain", JSON.stringify(user_info));
      this.$router.push("/pay/" + this.radio);
    }
  }
};
</script>
<style>
#index .part4 .el-input {
  text-align: left;
}
</style>

<style lang="scss" scoped>
#index {
  .box {
    overflow: hidden;
    overflow-y: auto;
    padding: 10px 5px 0 5px;
    overflow: auto;
    .group_title {
      text-align: left;
      padding: 10px 0;
      font-size: 16px;
    }

    .header {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
    }
    .group_desc {
      text-align: left;
      /* max-height: 400px; */
    }
    .part2 {
      border-top: 1px dashed #ccc;
      .group_desc_control {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        overflow: hidden;
      }
      .show_and_hidden {
        color: #5d7790;
        text-align: left;
        padding-left: 22px;
        margin-top: 10px;
      }
    }
    .part3 {
      margin-bottom: 10px;
      border-top: 1px dashed #ccc;
      .notice {
        padding: 10px 0;
        height: 24px;
        line-height: 24px;
        .notice_title {
          float: left;
          text-align: left;
          font-size: 16px;
        }
        .price {
          float: right;
          font-size: 14px;
          color: #e38664;
        }
      }
      .notice_desc {
        text-align: left;
      }
    }
    .part4 {
      margin: 15px 5px 10px 5px;
      padding-top: 10px;
      border-top: 1px dashed #ccc;
      input {
        border-color: #ff0000;
      }
      el-input {
        width: 80%;
        text-align: center;
      }
      .leave_msg {
        text-align: left;
        margin-bottom: 10px;
      }
    }
    .part5{
      .select_type{
        color:#ccc;
        font-size:14px;
        text-align:left;
      }
    }
  }
  .footer {
    width: 100%;
    position: fixed;
    bottom: 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #ccc;
    padding: 5px 0;
    .price_desc {
      float: left;
      margin-left: 20px;
      .pay_price {
        color: #e38664;
        margin-right: 5px;
        font-size: 16px;
        font-weight: bold;
      }
      .old_price {
        color: #ccc;
        display: inline-block;
        font-size: 10px;
        text-decoration: line-through;
      }
      p {
        margin: 5px 5px 0 0;
      }
    }
    .btn_in {
      float: right;
      border-radius: 5px;
      background-color:#7FBE50;
      /* background-color: #54b69b; */
      
      height: 30px;
      color: #fff;
      text-align: center;
      margin-right: 20px;
      padding: 2px 15px;
      line-height: 30px;
    }
  }
}
</style>