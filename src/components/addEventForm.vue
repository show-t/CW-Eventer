<template>
  <el-form ref="form" :model="event" label-width="120px" size="mini">
    <el-form-item label="イベント名" required>
      <el-input v-model="event.name"></el-input>
    </el-form-item>
    <el-form-item label="開催日" required>
      <el-col :span="11">
        <el-date-picker
          type="date"
          placeholder="Pick a date"
          v-model="event.date"
          style="width: 100%;"
        ></el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="開場時間">
      <el-col :span="11">
        <el-time-picker
          type="fixed-time"
          placeholder="Pick a time"
          v-model="event.openedTime"
          style="width: 100%;"
        ></el-time-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="開演時間">
      <el-col :span="11">
        <el-time-picker
          type="fixed-time"
          placeholder="Pick a time"
          v-model="event.startedTime"
          style="width: 100%;"
        ></el-time-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="閉演時間">
      <el-col :span="11">
        <el-time-picker
          type="fixed-time"
          placeholder="Pick a time"
          v-model="event.closedTime"
          style="width: 100%;"
        ></el-time-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="開催場所">
      <el-input v-model="event.place"></el-input>
    </el-form-item>
    <el-form-item label="関連リンク">
      <el-input v-model="event.link"></el-input>
    </el-form-item>
    <el-form-item label="詳細" prop="desc">
      <el-input type="textarea" v-model="event.desc"></el-input>
    </el-form-item>
    <el-form-item label="ハッシュタグ">
      <el-input v-model="event.tag"></el-input>
    </el-form-item>
    <el-form-item size="large">
      <el-button type="primary" @click="onSubmit">追加</el-button>
      <el-button @click="clear">キャンセル</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import firebase from "firebase";
import moment from "moment";
export default {
  data() {
    return {
      event: {
        name: "",
        date: "",
        openedTime: "",
        startedTime: "",
        closedTime: "",
        place: "",
        link: "",
        desc: "",
        tag: ""
      }
    };
  },
  methods: {
    onSubmit() {
      if (
        this.event.name == "" ||
        this.event.date == "" ||
        this.event.openedTime > this.event.startedTime ||
        this.event.startedTime > this.event.closedTime
      ) {
        this.$notify({
          title: "Error",
          message: "Invalid data",
          type: "error"
        });
        return;
      }
      var date = moment(this.event.date).format("YYYY-MM-DD");
      var openedTime = moment(this.event.openedTime).format("HH:mm");
      var startedTime = moment(this.event.startedTime).format("HH:mm");
      var closedTime = moment(this.event.closedTime).format("HH:mm");
      var eventRef = firebase.database().ref("events");
      eventRef.push(
        {
          name: this.event.name,
          date: date,
          openedTime: openedTime,
          startedTime: startedTime,
          closedTime: closedTime,
          place: this.event.place,
          link: this.event.link,
          desc: this.event.desc,
          tag: this.event.tag
        },
        error => {
          if (error) {
            this.$notify({
              title: "Error",
              message: "イベントの追加に失敗しました",
              type: "error"
            });
          } else {
            this.$notify({
              title: "イベント追加",
              message: "イベントを追加しました",
              type: "success"
            });
            this.clear();
          }
        }
      );
    },
    clear() {
      this.event = {
        name: "",
        date: "",
        openedTime: "",
        startedTime: "",
        closedTime: "",
        place: "",
        region: ""
      };
    }
  }
};
</script>
