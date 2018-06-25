<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <h3>Lobby: {{ user.lobbyId }}</h3>
        <v-list>
          <v-list-tile v-for="(lobbyUser, index) in lobbyUsers" :key="index">
            <template v-if="lobbyUser.access >= 3">
              <v-list-tile-content>
                <v-list-tile-title v-text="`${lobbyUser.displayName}  (Owner)`"/>
              </v-list-tile-content>
            </template>
            <template v-else>
              <v-list-tile-content>
                <v-list-tile-title v-text="`${lobbyUser.displayName}`"/>
              </v-list-tile-content>
            </template>
            <!--<v-list-tile-action>-->
            <!--<v-tooltip left :open-delay=0 :close-delay=0>-->
            <!--<v-btn slot="activator" icon outline color="teal">-->
            <!--<v-icon color="teal">play_arrow</v-icon>-->
            <!--</v-btn>-->
            <!--<span>Play now</span>-->
            <!--</v-tooltip>-->
            <!--</v-list-tile-action>-->
            <!--<v-list-tile-action>-->
            <!--<v-tooltip left :open-delay=0 :close-delay=0>-->
            <!--<v-btn slot="activator" icon outline color="teal" @click.stop="addToQueue(index)"-->
            <!--:disabled="songQueue.includes(song)">-->
            <!--<v-icon color="teal" v-if="songQueue.includes(song)">playlist_add_check</v-icon>-->
            <!--<v-icon color="teal" v-else>playlist_add</v-icon>-->
            <!--</v-btn>-->
            <!--<span v-if="songQueue.includes(song)">Song is in queue</span>-->
            <!--<span v-else>Add to queue</span>-->
            <!--</v-tooltip>-->
            <!--</v-list-tile-action>-->
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    props: {},
    data () {
      return {}
    },
    computed: {
      lobby () { return this.$store.getters.getLobby },
      lobbyUsers () { return this.lobby.users },
      selectedSong () { return this.lobby.selectedSong },
      user () { return this.$store.getters.getUser }
    },
    watch: {},
    methods: {}
  }
</script>
