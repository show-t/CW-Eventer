<template>
  <div>
    <el-input
      placeholder="キーワードで絞り込み"
      prefix-icon="el-icon-search"
      v-model="keyword"
    >
    </el-input>

    <el-table
      height="250"
      stripe
      style="width: 100%"
      :data="
        events.filter(
          data =>
            !keyword ||
            data.name.toLowerCase().includes(keyword.toLowerCase()) ||
            data.place.toLowerCase().includes(keyword.toLowerCase())
        )
      "
      @row-click="openRegistrationDialog"
    >
      <template slot="header" slot-scope="scope">
        <el-input v-model="keyword" size="mini" placeholder="Type to search" />
      </template>
      <el-table-column type="expand">
        <template slot-scope="scope">
          <p>
            <b>{{ scope.row.name }}</b>
          </p>
          <dl>
            <dt>開催会場：</dt>
            <dd>{{ scope.row.place }}</dd>
            <dt>開場時刻：</dt>
            <dd>{{ scope.row.openedTime }}</dd>
            <dt>開演時刻：</dt>
            <dd>{{ scope.row.startedTime }}</dd>
            <dt>閉演時刻：</dt>
            <dd>{{ scope.row.closedTime }}</dd>
            <dt>関連リンク：</dt>
            <dd>
              <a :href="scope.row.link">{{ scope.row.link }}</a>
            </dd>
            <dt v-if="scope.row.tag">ハッシュタグ</dt>
            <dd v-if="scope.row.tag">#{{ scope.row.tag }}</dd>
            <dt>詳細：</dt>
            <dd>{{ scope.row.disc }}</dd>
          </dl>
        </template>
      </el-table-column>
      <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
      <el-table-column prop="date" label="開催日" width="120" sortable>
      </el-table-column>
      <el-table-column prop="name" label="イベント名" width="180">
      </el-table-column>
      <el-table-column prop="place" label="会場" width="180"> </el-table-column>
      <!--
        <el-table-column>
          <template slot-scope="scope">
            <el-button class="el-icon-edit" type="text" size="small"
              >Edit</el-button
            >
          </template>
        </el-table-column>
      -->
      <el-table-column>
        <template slot-scope="scope">
          <el-button
            class="el-icon-delete"
            type="text"
            size="small"
            @click.native.prevent="deleteEvent(scope.$index, events);"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="参加登録" :visible.sync="dialogVisible">
      <el-select v-model="state" placeholder="Select">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogVisible = false;
            state = 'non-join';
          "
          >キャンセル</el-button
        >
        <el-button type="primary" @click="regist">登録</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  props: ["user"],
  data() {
    return {
      keyword: "",
      events: [],
      dialogVisible: false,
      state: null,
      row: null,
      options: [
        {
          value: "join",
          label: "参加"
        },
        {
          value: "consideration",
          label: "検討中"
        },
        {
          value: "non-join",
          label: "不参加"
        }
      ]
    };
  },
  created() {
    this.list();
  },
  methods: {
    deleteEvent(index, events) {
      //console.log("delete")
      var eventsRef = firebase.database().ref("events");
      eventsRef.child(events[index].key).remove();
      this.$notify.info({
        title: "削除",
        message: "イベントを削除しました"
      });
      events.splice(index, 1);
      this.list();
    },
    list() {
      this.events = [];
      var eventsRef = firebase.database().ref("events");
      eventsRef.on("value", snapshot => {
        for (let k in snapshot.val()) {
          var event = snapshot.val()[k];
          event.key = k;
          this.events.push(event);
          //console.log(_this.events);
        }
      });
    },
    openRegistrationDialog(row) {
      //console.log(row);
      this.dialogVisible = true;
      this.row = row;
    },
    regist() {
      this.dialogVisible = false;
      var joinRef = firebase
        .database()
        .ref("users/" + this.user.uid + "/join_list/" + this.row.key);
      if (this.state === "non-join") {
        joinRef.remove();
        this.$notify.info({
          title: "削除",
          message: "参加登録を解除しました"
        });
      } else {
        joinRef.set(this.state, error => {
          if (error) {
            this.$notify({
              title: "Error",
              message: "参加登録に失敗しました",
              type: "error"
            });
          } else {
            this.$notify({
              title: "参加登録",
              message: "参加登録しました",
              type: "success"
            });
            this.clear();
          }
        });
      }

      this.state = null;
    }
  }
};
</script>

<style>
dt {
  float: left;
  clear: left;
}

dd {
  margin-left: 80px;
}
</style>
