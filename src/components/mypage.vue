<template>
  <div>
    <!-- <el-input :value="user.displayName"></el-input> -->
    <el-row>
      <el-col>
        <h3>参加予定のイベント</h3>
        <el-table
          height="250"
          stripe
          style="width: 100%"
          :data="
            events.filter(data => data.state.toLowerCase().includes('join'))
          "
          :filter-method="filterHandlerJoin"
          @row-click="openRegistrationDialog"
        >
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
          <el-table-column prop="date" label="開催日" width="120" sortable>
          </el-table-column>
          <el-table-column prop="name" label="イベント名" width="250">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <h3>参加検討中のイベント</h3>
        <el-table
          height="250"
          stripe
          style="width: 100%"
          :data="
            events.filter(data =>
              data.state.toLowerCase().includes('consideration')
            )
          "
          @row-click="openRegistrationDialog"
        >
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
          <el-table-column prop="date" label="開催日" width="120" sortable>
          </el-table-column>
          <el-table-column prop="name" label="イベント名" width="250">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!--
      <el-row>
        <el-col>
          <h3>参加したイベント</h3>
          <el-table
            height="250"
            stripe
            style="width: 100%"
            :data="
              events.filter(data => data.state.toLowerCase().includes('join'))
            "
          >
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
            <el-table-column prop="date" label="開催日" width="120" sortable>
            </el-table-column>
            <el-table-column prop="name" label="イベント名" width="250">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    -->
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
><script>
import firebase from "firebase";
import moment from "moment";
export default {
  props: ["user"],
  data() {
    return {
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
    //console.log(this.user);
    this.list();
  },
  methods: {
    list() {
      this.events = [];
      var eventsRef = firebase
        .database()
        .ref("users/" + this.user.uid + "/join_list");
      eventsRef.on("value", snapshot => {
        //console.log(snapshot.val());
        for (let k in snapshot.val()) {
          var event = {};
          event.key = k;
          event.state = snapshot.val()[k];
          //console.log(snapshot.val()[k]);
          var eventRef = firebase.database().ref("events/" + k);
          eventRef.on("value", snapshot => {
            Object.assign(event, snapshot.val());
            //console.log(event);
            this.events.push(event);
          });
        }
      });
    },
    openRegistrationDialog(row) {
      //console.log(row);
      this.dialogVisible = true;
      this.row = row;
    },
    filterHandlerJoin(value, row, column) {
      return row.state === "join";
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
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
dt {
  float: left;
  clear: left;
}

dd {
  margin-left: 100px;
}
</style>
