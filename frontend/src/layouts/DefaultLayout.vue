<template>
  <v-app>
    <v-app-bar>
      <v-container class="align-center">
        <v-app-bar-title>Todo App</v-app-bar-title>
        <v-spacer></v-spacer>
        <v-btn to="/">Aktif Görevler</v-btn>
        <v-btn to="/completed">Tamamlanan Görevler</v-btn>
        <v-btn to="/groups">Gruplar</v-btn>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts"></script>
