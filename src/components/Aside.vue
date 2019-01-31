<template>
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-openeds="['1']">
      <el-submenu index="1">
        <template slot="title"
          ><i class="el-icon-message"></i>イベント</template
        >
        <el-menu-item-group>
          <el-menu-item @click="addEvent">イベント追加</el-menu-item>
          <el-menu-item @click="showEvents">イベント一覧</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title"
          ><i class="el-icon-menu"></i>ユーザー</template
        >
        <el-menu-item-group>
          <el-menu-item index="1-1">マイページ</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<style>
.el-aside {
  color: #333;
}
</style>
