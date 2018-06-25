// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { store } from './store'

import App from './App'
import Player from './components/Player'
import Library from './components/Library'
import LobbyDetails from './components/LobbyDetails'
import LoginModal from './components/LoginModal'
import UploadModal from './components/UploadModal'

Vue.use(Vuetify)

Vue.component('copperlane-player', Player)
Vue.component('copperlane-library', Library)
Vue.component('copperlane-lobby', LobbyDetails)
Vue.component('copperlane-login-modal', LoginModal)
Vue.component('copperlane-upload-modal', UploadModal)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
