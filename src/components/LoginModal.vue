<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" width="50%">
      <v-card>
        <v-card-title>
          <span class="headline">Join Lobby</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Display Name" v-model="displayName" @keyup.enter="onLogin" required/>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Lobby ID" v-model="lobbyId" @keyup.enter="onLogin" required/>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password" type="password" v-model="password" @keyup.enter="onLogin" required/>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn class="blue--text darken-1" flat @click.native="onClose">Close</v-btn>
          <v-btn class="blue--text darken-1" flat @click.native="onLogin">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
  export default {
    props: ['showDialog'],
    data () {
      return {
        displayName: '',
        lobbyId: '',
        password: ''
      }
    },
    computed: {
      show: {
        get: function () {
          return this.showDialog
        },
        set: function (newValue) {
          this.$emit('update:showDialog', newValue)
        }
      }
    },
    methods: {
      onClose () {
        this.$emit('update:showDialog', false)
        this.lobbyId = ''
        this.password = ''
      },
      onLogin () {
        this.$store.dispatch('auth', {displayName: this.displayName, lobbyId: this.lobbyId, password: this.password})
          .then((res) => {
            this.onClose()
          })
          .catch((err) => {
            console.log('onLogin error', err)
          })
      }
    }
  }
</script>
