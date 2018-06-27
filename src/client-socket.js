import io from 'socket.io-client'

export const createSocket = (store, socketEndpoint) => {
  const socket = io(socketEndpoint)
  socket.on('connect', () => {
    console.log('client socket connected')
  })
  socket.on('disconnect', () => {
    console.log('client socket disconnected')
  })
  socket.on('req-error', (message) => {
    console.log('socket error: ' + message)
  })
  socket.on('auth-ok', (data) => {
    store.commit('setUser', data)
    // store.dispatch('loadLibrary')  // Server already sends this upon auth.
  })
  socket.on('library', (data) => {
    store.dispatch('updateLibrary', data)
  })
  socket.on('library-add', (newSong) => {
    store.commit('addLibrary', newSong)
  })
  socket.on('lobby-state', (lobby) => {
    store.commit('setLobby', lobby)
  })
  socket.on('lobby-select', (songId) => {
    store.commit('setLobbySelectedSong', songId)
  })
  socket.on('lobby-play', () => {
    store.commit('setLobbyPlaying', true)
  })
  socket.on('lobby-pause', () => {
    store.commit('setLobbyPlaying', false)
  })
  socket.on('lobby-stop', () => {
    // Unsupported endpoint? Really serves the same purpose as pause for us. Since we don't care about synced times.
    // console.log('TODO lobbystop')
  })
  socket.on('lobby-loop', (doLoop) => {
    store.commit('setLobbyLooping', doLoop)
  })
  socket.on('lobby-joined', (user) => {
    store.commit('addLobbyUser', user)
  })
  socket.on('lobby-left', (user) => {
    store.commit('removeLobbyUser', user)
  })
  return socket
}
