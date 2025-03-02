<template>
  <v-app>
    <v-layout>
      <v-app-bar color="primary">
        <v-app-bar-title>Todo App</v-app-bar-title>
        <v-spacer></v-spacer>

        <v-btn to="/" variant="text">Aktif Görevler</v-btn>
        <v-btn to="/completed" variant="text">Tamamlanan Görevler</v-btn>
        <v-btn to="/groups" variant="text">Gruplar</v-btn>

        <v-spacer></v-spacer>
      </v-app-bar>

      <v-main>
        <v-container fluid>
          <v-row justify="center">
            <v-col>
              <router-view></router-view>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts"></script>

<style>
.v-btn {
  margin: 0 4px;
}

.v-main {
  background-color: #f8f9fa;
}

.v-container {
  max-width: 100% !important;
}
</style>
