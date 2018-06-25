import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import { createSocket } from './client-socket'

Vue.use(Vuex)

const API_ENDPOINT = ''

export const store = new Vuex.Store({
  state: {
    API_ENDPOINT: API_ENDPOINT,     // 'http://localhost:3000' in testing
    songQueue: [],        // List of songs that in the queue.
    songLibrary: [],      // List of all songs in the library.
    socket: null,
    user: null,
    lobby: {
      name: '',
      looping: false,
      playing: false,
      selectedSong: '',
      users: []
    }
  },
  getters: {
    getUser: (state) => state.user,
    getLobby: (state) => state.lobby,
    getSongQueue: (state) => state.songQueue,
    getSongLibrary: (state) => state.songLibrary,
    API: (state) => state.API_ENDPOINT
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setLobby (state, lobby) {
      state.lobby = lobby
    },
    setLobbyName (state, name) {
      state.lobby.name = name
    },
    setLobbyLooping (state, doLoop) {
      state.lobby.looping = doLoop
    },
    setLobbyPlaying (state, doPlay) {
      state.lobby.playing = doPlay
    },
    setLobbySelectedSong (state, songId) {
      state.lobby.selectedSong = songId
    },
    addLobbyUser (state, user) {
      state.lobby.users.push(user)
    },
    removeLobbyUser (state, user) {
      state.lobby.users.splice(state.lobby.users.indexOf(user), 1)
    },
    updateLibrary (state, payload) {
      payload.forEach((song) => {  // TODO: Potential optimization here.
        let librarySong = state.songLibrary.filter(s => (s.id === song.id))
        if (librarySong.length === 0) {
          state.songLibrary.push(song)
        }
      })
    }
  },
  actions: {
    async loadLibrary ({state}) {
      state.socket.emit('library-req')
    },
    async auth ({dispatch, commit, state}, credentials) {
      await axios.post(state.API_ENDPOINT + '/auth', credentials, {withCredentials: true})
      state.socket.emit('auth', credentials)
    },
    async logout ({commit, state}) {
      await axios.post(state.API_ENDPOINT + '/logout', null, {withCredentials: true})
      commit('setUser', null)
    },
    async selectSong ({state}, request) {
      state.socket.emit('lobby-select-song-req', request)
    },
    async playSong ({state}) {
      state.socket.emit('lobby-play-song-req')
    },
    async pauseSong ({state}) {
      state.socket.emit('lobby-pause-song-req')
    },
    async stopSong ({state}) {
      state.socket.emit('lobby-stop-song-req')
    },
    async loopSong ({state}, doLoop) {
      state.socket.emit('lobby-loop-song-req', doLoop)
    }
  }
})

store.state.socket = createSocket(store, API_ENDPOINT)
