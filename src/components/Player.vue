<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs12 md7 text-xs-right>
        <v-btn outline icon class="teal--text" @click.native="togglePause" :disabled="!canControl">
          <v-icon v-if="paused">play_arrow</v-icon>
          <v-icon v-else>pause</v-icon>
        </v-btn>
        <!--<v-btn outline icon class="teal&#45;&#45;text" @click.native="stopRequest" :disabled="!canControl">-->
          <!--<v-icon>stop</v-icon>-->
        <!--</v-btn>-->
        <v-btn outline icon color="teal" @click.native="toggleLoop" :disabled="!canControl">
          <v-icon v-if="looping === false">replay</v-icon>
          <v-icon v-else>repeat_one</v-icon>
        </v-btn>
        <v-btn outline icon class="teal--text" @click.native="mute()">
          <v-icon v-if="muted === false">volume_up</v-icon>
          <v-icon v-else>volume_off</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs4 md5 text-xs-left>
        <v-slider v-model="volume" thumb-label class="volumeSlider"/>
      </v-flex>
      <v-flex xs12>
        <v-slider @click.native="seek()" v-model="promille" :max="1000" :disabled="loaded === false"/>
        <p>{{ currentTime }} / {{ duration }}</p>
        <v-divider/>
        <v-list>
          <v-list-tile v-for="(song, index) in songQueue" :key="index" v-model="selectedSong === song.id">
            <v-list-tile-content>
              <v-list-tile-title v-text="song.name"/>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-tooltip left :open-delay=0 :close-delay=0>
                <v-btn slot="activator" icon outline color="teal" @click.stop="selectRequest(song)">
                  <v-icon color="teal">play_arrow</v-icon>
                </v-btn>
                <span>Play now</span>
              </v-tooltip>
            </v-list-tile-action>
            <v-list-tile-action>
              <v-tooltip right :open-delay=0 :close-delay=0>
                <v-btn slot="activator" icon outline color="teal" @click.stop="removeFromQueue(index)">
                  <v-icon color="teal">delete</v-icon>
                </v-btn>
                <span>Remove from queue</span>
              </v-tooltip>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<style>
  .volumeSlider {
    padding-top: 9px;
    padding-left: 16px;
  }
</style>
<script>
  import { Howl, Howler } from 'howler'

  const formatTime = (second) => {
    return second ? new Date(second * 1000).toISOString().substr(11, 8) : '00:00:00'
  }
  export default {
    mounted () {
      this.init()
    },
    beforeDestroy () {
      if (this.songObj) this.songObj.stop()
    },
    data () {
      return {
        muted: false,
        loaded: false,
        isPaused: false,
        promille: 0,
        currentTime: '--:--:--',
        totalDuration: 0,
        songObj: null,
        volume: 50,
        trackInterval: null
      }
    },
    computed: {
      duration () { return this.songObj ? formatTime(this.songObj.duration()) : '--:--:--' },
      lobby () { return this.$store.getters.getLobby },
      playing () { return this.lobby.playing },
      paused () { return !this.playing },
      looping () { return this.lobby.looping },
      selectedSong () { return this.lobby.selectedSong },
      user () { return this.$store.getters.getUser },
      songQueue () { return this.$store.getters.getSongQueue },
      canControl () { return this.loaded && this.user && this.user.access >= 3 }  // 3 == OWNER
    },
    watch: {
      volume (newVolume, oldVolume) {
        Howler.volume(newVolume / 100.0)
      },
      selectedSong (newSongId, oldSong) {
        console.log('song watched prop in Player', newSongId, oldSong)
        if (newSongId) this.play(newSongId)
      },
      looping (doLoop) {
        if (this.songObj) this.songObj.loop(doLoop)
      },
      playing (doPlay) {
        if (this.songObj) {
          doPlay ? this.songObj.play() : this.songObj.pause()
        }
      }
    },
    methods: {
      init: function () {
        Howler.volume(this.volume / 100.0)
      },
      selectRequest (song) {
        this.$store.dispatch('selectSong', {songId: song.id, doPlay: true})
      },
      stopRequest () {
        this.$store.dispatch('stopSong')
      },
      toggleLoop () {
        this.$store.dispatch('loopSong', !this.looping)
      },
      togglePause () {
        this.paused ? this.$store.dispatch('playSong') : this.$store.dispatch('pauseSong')
      },
      play (songId) {
        let song = this.$store.state.songLibrary.filter(s => s.id === songId)[0]
        if (song) {
          this.activeSongKey = song.id
          const sources = song.sources.map(src => this.$store.getters.API + src)
          if (this.songObj) this.songObj.stop()
          this.songObj = new Howl({
            src: sources,
            loop: this.looping,
            html5: true,
            onload: this._handleOnLoad,
            onloaderror: this._handleOnLoadError,
            onplay: this._handleOnPlay,
            onplayerror: this._handleOnPlayError,
            onend: this._handleOnEnd,
            onpause: this._handleOnPause,
            onstop: this._handleOnStop
          })
        } else {
          console.log('Song not found in library?')
        }
      },
      seek () {
        this.songObj.seek(this.songObj.duration() / 1000 * this.promille)
      },
      mute () {
        this.muted = !this.muted
        Howler.mute(this.muted)
      },
      trackSong () {
        if (this.trackInterval) {
          clearInterval(this.trackInterval)
        }
        this.trackInterval = setInterval(() => {
          this.currentTime = formatTime(parseInt(this.songObj.seek()))
          this.promille = this.songObj.seek() / this.songObj.duration() * 1000
        }, 125)
      },
      removeFromQueue (index) {
        this.songQueue.splice(index, 1)
      },
      _handleOnLoad () {
        this.loaded = true
        this.trackSong()
        if (this.playing) this.songObj.play()
      },
      _handleOnPlay () {
        this.isPaused = false
      },
      _handleOnEnd () {
        if (!this.looping) this.isPaused = true
      },
      _handleOnPause () {
        this.isPaused = true
      },
      _handleOnStop () {
        this.isPaused = true
      },
      _handleOnLoadError (id, err) {
        console.log('Error loading song. Error code:', err)
      },
      _handleOnPlayError (id, err) {
        console.log('Error playing song. Error code:', err)
      }
    }
  }
</script>
