<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">欢迎登陆</div>
      <el-form :model="param"
               :rules="rules"
               ref="login"
               label-width="0px"
               class="ms-content">
        <el-form-item prop="loginMobile">
          <el-input v-model="param.loginMobile"
                    size="medium"
                    placeholder="请输入手机号"
                    maxlength="11">
            <el-button slot="prepend"
                       icon="el-icon-lx-people"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password"
                    size="medium"
                    placeholder="请输入密码"
                    v-model="param.password"
                    show-password>
            <el-button slot="prepend"
                       icon="el-icon-lx-lock"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row type="flex">
            <el-col :span="14"
                    class="img-input">
              <el-input v-model="param.code"
                        size="medium"
                        @keyup.enter.native="submitForm()"
                        autocomplete="off"
                        placeholder="请输入验证码"
                        maxlength="6">
                <el-button slot="prepend"
                           icon="el-icon-picture-outline"></el-button>
              </el-input>
            </el-col>
            <el-col :span="6"
                    class="img-box">
              <img :src="imgCode"
                   @click="getImgCode()">
            </el-col>
          </el-row>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary"
                     @click="submitForm()"
                     :loading="loginLoading">登录</el-button>
        </div>
        <p class="login-tips"><a href="javascript:void(0);"
             @click="forgetPwd()">忘记密码</a></p>
      </el-form>
    </div>
    <!-- 忘记密码 -->
    <el-dialog title="忘记密码"
               width="40%"
               :visible.sync="forgetVisible">
      <el-form :model="forgetForm"
               :rules="rules"
               ref="forget"
               label-width="120px">

        <el-form-item label="手机号"
                      prop="loginMobile"
                      class="form-item">
          <el-row type="flex">
            <el-col :span=12>
              <el-input size="medium"
                        v-model="forgetForm.loginMobile"
                        autocomplete="off"
                        placeholder="请填写手机号"
                        maxlength="11"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="验证码"
                      prop="smsCode">
          <el-row type="flex">
            <el-col :span="12"
                    class="code-input">
              <el-input size="medium"
                        v-model="forgetForm.smsCode"
                        autocomplete="off"
                        placeholder="请填写验证码"
                        maxlength="6"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button class="send-btn grid-content"
                         type="primary"
                         @click="sendCode()"
                         :disabled="sendable">{{
                                sendText
                            }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="新密码"
                      prop="password"
                      class="form-item">
          <el-row type="flex">
            <el-col :span=12>
              <el-input size="medium"
                        v-model="forgetForm.password"
                        autocomplete="off"
                        type="password"
                        placeholder="新密码（8-20数字字母组合）"
                        maxlength="20"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="确认密码"
                      prop="repassword"
                      class="form-item">
          <el-row type="flex">
            <el-col :span=12>
              <el-input size="medium"
                        v-model="forgetForm.repassword"
                        autocomplete="off"
                        type="password"
                        placeholder="确认密码"
                        maxlength="20"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <!-- <p class="form-tips">注意：密码修改后需要重新登录系统</p> -->
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   size="medium"
                   @click="forgetSubmit()"
                   :loading="forgetSubmitLoading">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { login, send, queryImgCode, forget } from '../../api/index';
import md5 from 'md5';
export default {
  data: function () {
    let checkPhone = (rule, value, callback) => {
      let reg = /^(1)\d{10,10}$/;
      if (!value) {
        return callback(new Error('手机号不能为空'));
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error('请输入11位手机号'));
        } else {
          callback();
        }
      }, 1000);
    };
    let checkCode = (rule, value, callback) => {
      let reg = /^\d{6,6}$/;
      if (!value) {
        return callback(new Error('验证码不能为空'));
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error('请输入6位手机验证码'));
        } else {
          callback();
        }
      }, 1000);
    };
    let checkImg = (rule, value, callback) => {
      let reg = /^\d{4,4}$/;
      if (!value) {
        return callback(new Error('验证码不能为空'));
      }
      setTimeout(() => {
        if (!reg.test(value)) {
          callback(new Error('请输入4位图片验证码'));
        } else {
          callback();
        }
      }, 1000);
    };
    let validatePass = (rule, value, callback) => {
      // let reg = /^(?=.*[a-zA-Z])(?=.*\d)[^]{8,20}$/;
      let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/;
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (!reg.test(value)) {
          callback(new Error('请输入8-20数字字母组合'));
        } else {
          if (this.forgetForm.repassword !== '') {
            this.$refs.forget.validateField('repassword');
          }
          callback();
        }
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.forgetForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      param: {
        loginMobile: '',
        password: '',
        sess: '',
        code: ''
      },
      imgCode: '', //图片验证码
      loginLoading: false,
      rules: {
        loginMobile: [{ required: true, validator: checkPhone, trigger: 'blur' }],
        password: [{ required: true, validator: validatePass, trigger: 'blur' }],
        repassword: [{ required: true, validator: validatePass2, trigger: 'blur' }],
        smsCode: [{ required: true, validator: checkCode, trigger: 'blur' }],
        code: [{ required: true, validator: checkImg, trigger: 'blur' }]
      },
      sendText: '获取短信验证码',
      sendable: false,
      forgetVisible: false,
      forgetForm: {
        loginMobile: '',
        smsCode: '',
        password: '',
        repassword: ''
      },
      forgetSubmitLoading: false,
      timer: null
    };
  },
  created () {
    this.getImgCode()
  },
  methods: {
    submitForm () {
      this.$refs.login.validate(valid => {
        if (valid) {
          this.loginLoading = true;
          login({ ...this.param, password: md5(this.param.password) }).then(res => {
            this.loginLoading = false;
            this.getImgCode()
            if (res.error_code == 0) {
              this.$message.success('登录成功');
              localStorage.setItem('userInfo', JSON.stringify(res.data));
              this.$router.push('/');
            } else {
              this.$message.error(res.error_msg || '登陆失败');
            }
          });
        } else {
          this.$message.error('请输入手机号和密码');
          console.log('error submit!!');
          return false;
        }
      });
    },
    //获取图片验证码
    getImgCode () {
      queryImgCode().then(res => {
        if (res.error_code == 0) {
          this.imgCode = res.data.smallUrl;
          this.param.sess = res.data.sess;
        }
      })
    },
    forgetPwd () {
      this.forgetForm.loginMobile = this.param.loginMobile;
      this.forgetVisible = true;
    },
    sendCode () {
      this.$refs.forget.validateField('loginMobile', valid => {
        console.log(valid);
        if (!valid) {
          send({ loginMobile: this.forgetForm.loginMobile })
            .then(res => {
              if (res.error_code == 0) {
                this.countDown();
              } else {
                this.$message.error(res.error_msg || '发送失败');
              }
            })
            .catch(error => {
              if (error.request.readyState == 4 && error.request.status == 0) {
                //我在这里重新请求
                console.log('timeoput')
              }
            });
        }
      });
    },
    countDown () {
      let t = 60;
      this.sendable = true;
      this.sendText = t + 's后重新获取';
      this.timer = setInterval(() => {
        if (t === 0) {
          clearInterval(this.timer)
          this.sendText = '获取短信验证码';
          this.sendable = false;
        } else {
          --t;
          this.sendText = t + 's后重新获取';
        }
      }, 1000);
    },
    forgetSubmit () {
      this.$refs.forget.validate(valid => {
        if (valid) {
          this.forgetSubmitLoading = true;
          delete this.forgetForm.repassword;
          forget({ ...this.forgetForm, password: md5(this.forgetForm.password) }).then(res => {
            if (res.error_code == 0) {
              this.$message.success('密码提交成功');
              this.forgetSubmitLoading = false;
              clearInterval(this.timer)
              this.sendText = '获取短信验证码';
              this.sendable = false;
              this.$refs.forget.resetFields();
              this.forgetVisible = false;
            } else {
              this.forgetSubmitLoading = false;
              this.$message.error(res.error_msg || '提交失败');
            }
          })
        }
      })
    }
  }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.png);
    background-repeat: no-repeat;
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 420px;
    margin: -190px 0 0 -210px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 40px 40px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.form-tips {
    font-size: 12px;
    line-height: 30px;
    margin-left: 80px;
}

.login-tips a {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}

/* .form-item {
    width: 65%;
} */

/* .send-btn {
    margin-left: 60px;
} */
.img-input {
    margin-right: 15px;
}

.img-box {
    height: 36px;
}
.code-input {
    margin-right: 40px;
}
</style>
