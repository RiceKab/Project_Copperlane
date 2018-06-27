<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" width="70%">
      <v-card>
        <v-card-title>
          <span class="headline">Upload Audio</span>
        </v-card-title>
        <v-card-text>
          <v-form id="uploadFormId" ref="uploadForm" enctype="multipart/form-data"
                  method="post">
            <v-text-field v-model="name" label="Name" name="name" required/>
            <v-btn raised @click="selectFile">
              <v-icon left>file_upload</v-icon>
              Select Audio File
            </v-btn>
            <p v-if="this.selectedFile">Selected file: {{ this.selectedFile.name }}</p>
            <input type="file" accept="audio/*" style="display: none" ref="fileInput" name="audiofile"
                   @change="fileInputChanged"/>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn class="blue--text darken-1" flat @click.native="closeForm">Cancel</v-btn>
          <v-btn class="blue--text darken-1" flat @click.native="submitForm">Upload</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
  import axios from 'axios'

  export default {
    props: ['showDialog'],
    data () {
      return {
        name: '',
        selectedFile: null
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
      },
      API () { return this.$store.getters.API }
    },
    methods: {
      selectFile () {
        this.$refs.fileInput.click()
      },
      fileInputChanged (evt) {
        this.selectedFile = evt.target.files[0]
      },
      clearForm () {
        this.$refs.uploadForm.reset()
        this.selectedFile = null
      },
      closeForm () {
        this.clearForm()
        this.$emit('update:showDialog', false)
      },
      submitForm (data) {
        if (this.selectedFile && this.name) {
          let formData = new FormData()
          formData.append('name', this.name)
          formData.append('file', this.selectedFile)
          axios.post(this.API + 'audio/upload', formData, {withCredentials: true})
            .then((response) => {
              let newSong = response.data
              this.$store.commit('addLibrary', newSong)
              this.$store.dispatch('broadcastNewSong', newSong)
              this.onClose()
            })
            .catch((err) => {
              console.log('Failed to upload file', err)
            })
        } else {
          console.log('bad submission')
        }
      },
      onClose () {
        this.$emit('update:showDialog', false)
        this.name = ''
        this.selectedFile = null
      }
    }
  }
</script>
