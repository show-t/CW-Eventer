<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <el-header style="font-size: 12px">
      <el-col :span="11"> <h1 style="margin:0">EVENTER NOTE</h1> </el-col>
      <el-col style="text-align:right;" :span="13">
        <el-popover
          v-if="user"
          placement="top-start"
          :title="user.displayName"
          width="200"
          trigger="hover"
          :content="user.email"
        >
          <img :src="user.photoURL" class="image" />
          <p>{{ user.email }}</p>
          <el-button slot="reference">{{ user.displayName }}</el-button>
        </el-popover>
        <span>&nbsp;&nbsp;</span>
        <el-button plain round @click="signout();" v-if="user"
          >ログアウト</el-button
        >
        <el-button plain round @click="signin();" v-else>ログイン</el-button>
      </el-col>
    </el-header>
    <el-container style="height: 800px; border: 1px solid #eee">
      <!-- <my-aside props></my-aside> -->
      <el-aside width="30%" style="background-color: rgb(238, 241, 246)">
        <el-menu
          :default-openeds="['1', '2']"
          :collapse="isCollapse"
          class="el-menu-vertical-demo"
        >
          <el-submenu index="1">
            <template slot="title"
              ><i class="el-icon-menu"></i>
              <span slot="title">イベント情報</span></template
            >
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="addEvent"
                >イベント追加</el-menu-item
              >
              <el-menu-item index="1-2" @click="showEvents"
                >イベント一覧</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"
              ><i class="el-icon-menu"></i
              ><span slot="title">ユーザー情報</span></template
            >
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="showMyPage"
                >マイページ</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <add-event-form v-if="mainState == 0"></add-event-form>
          <event-list :user="user" v-else-if="mainState == 1"></event-list>
          <my-page :user="user" v-else></my-page>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
</style>

<script>
import firebase from "firebase";
import MyAside from "../components/Aside.vue";
import AddEventForm from "../components/addEventForm.vue";
import EventList from "../components/EventList.vue";
import MyPage from "../components/mypage.vue";
export default {
  components: {
    MyAside,
    AddEventForm,
    EventList,
    MyPage
  },
  data() {
    return {
      user: null,
      mainState: 99,
      isCollapse: false
    };
  },
  async mounted() {
    this.user = await this.auth();
    //console.log(this.user.displayName);
  },
  methods: {
    addEvent() {
      this.mainState = 0;
    },
    showEvents() {
      this.mainState = 1;
    },
    showMyPage() {
      this.mainState = 99;
    },
    signin() {
      const googleProvider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(googleProvider)
        .then(obj => {
          //console.log(obj.user.displayName);
          this.$notify.info({
            title: "ログイン",
            message: "ログインしました"
          });
          //this.user = this.auth();
          this.auth().then(user => {
            this.user = user;
          });
          //console.log(this.user);
        })
        .catch(error => {
          console.log(error.messagge);
        });
    },
    signout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.user = null;
        });
    },
    auth() {
      return new Promise((resolve, reject) => {
        firebase.auth().onAuthStateChanged(user => {
          resolve(user);
        });
      });
    }
  }
};
</script>
