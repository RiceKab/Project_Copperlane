<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-toolbar color="teal">
        <v-toolbar-title class="white--text">Project Copperlane</v-toolbar-title>
        <v-spacer/>
        <v-toolbar-items>
          <v-btn dark flat @click.stop="showLogin = true">Join Lobby</v-btn>
          <v-btn dark flat @click.stop="showUpload = true">Upload Song</v-btn>
        </v-toolbar-items>
        <!--<v-toolbar-title class="white&#45;&#45;text">Room #xyz</v-toolbar-title>-->
      </v-toolbar>
      <v-flex xs12 sm6>
        <v-card style="text-align: center" flat>
          <v-card-text>
            <copperlane-player />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6>
        <v-card style="text-align: center" flat v-if="user">
          <v-card-text>
            <copperlane-lobby/>
          </v-card-text>
        </v-card>
        <v-divider v-if="user" />
        <v-card style="text-align: center" flat>
          <v-card-text>
            <copperlane-library />
          </v-card-text>
        </v-card>
      </v-flex>
      <copperlane-login-modal :show-dialog.sync="showLogin" />
      <copperlane-upload-modal :show-dialog.sync="showUpload" />
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    mounted () {},
    data () {
      return {
        showLogin: false,
        showUpload: false
      }
    },
    computed: {
      user () { return this.$store.getters.getUser }
    },
    methods: {}
  }
</script>
