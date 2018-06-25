<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12>
        <v-tooltip left :open-delay=0 :close-delay=0>
          <v-btn slot="activator" icon outline color="teal" @click.stop="refreshLibrary">
            <v-icon color="teal">refresh</v-icon>
          </v-btn>
          <span>Refresh Song Library</span>
        </v-tooltip>
        <v-text-field v-model="searchString" label="Search" prepend-icon="search"/>
        <v-list>
          <v-list-tile v-for="(song, index) in songLibrary" v-if="filterSong(song)" :key="song.id">
            <v-list-tile-content>
              <v-list-tile-title v-text="song.name"/>
            </v-list-tile-content>
            <!--<v-list-tile-action>-->
            <!--<v-tooltip left :open-delay=0 :close-delay=0>-->
            <!--<v-btn slot="activator" icon outline color="teal">-->
            <!--<v-icon color="teal">play_arrow</v-icon>-->
            <!--</v-btn>-->
            <!--<span>Play now</span>-->
            <!--</v-tooltip>-->
            <!--</v-list-tile-action>-->
            <v-list-tile-action>
              <v-tooltip left :open-delay=0 :close-delay=0>
                <v-btn slot="activator" icon outline color="teal" @click.stop="addToQueue(index)"
                       :disabled="songQueue.includes(song)">
                  <v-icon color="teal" v-if="songQueue.includes(song)">playlist_add_check</v-icon>
                  <v-icon color="teal" v-else>playlist_add</v-icon>
                </v-btn>
                <span v-if="songQueue.includes(song)">Song is in queue</span>
                <span v-else>Add to queue</span>
              </v-tooltip>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  export default {
    data () {
      return {
        searchString: ''
      }
    },
    computed: {
      songLibrary () { return this.$store.getters.getSongLibrary },
      songQueue () { return this.$store.getters.getSongQueue }
    },
    watch: {},
    methods: {
      addToQueue (index) {
        this.songQueue.push(this.songLibrary[index])
      },
      filterSong (song) {
        return song.name.toLowerCase().includes(this.searchString.toLowerCase())
      },
      refreshLibrary () {
        this.$store.dispatch('loadLibrary')
      }
    }
  }
</script>
