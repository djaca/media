import { ipcRenderer } from "electron"
<template>
	<v-dialog
		max-width="600"
		v-model="show"
		persistent
	>
		<v-card>
			<v-card-title
				v-text="'Settings'"
				class="headline"
			/>
			<v-card-text>
				<v-switch
					@change="val => $vuetify.theme.dark = val"
					style="max-width: 150px"
					label="Dark mode"
					v-model="isDark"
					inset
				/>
				
				<div class="d-flex align-center">
					<v-text-field
						v-model="directory"
						class="mr-2"
						disabled
						dense
					></v-text-field>
					<v-btn @click="openFoldersDialog" icon>
						<v-icon>mdi-folder</v-icon>
					</v-btn>
				</div>
			</v-card-text>
			<v-card-actions>
				<v-spacer />

				<v-btn
					@click="cancel"
					text
				>
					Cancel
				</v-btn>

				<v-btn
					@click="save"
					text
				>
					Save
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  
  const { dialog } = require('electron').remote
  
  export default {
    name: 'Settings',
  
    data () {
      return {
        isDark: false,
        directory: ''
      }
    },
  
    computed: {
      ...mapState({
        isDarkTheme: state => state.Settings.isDark
      }),
  
      ...mapGetters({
        folderPath: 'Settings/folderPath'
      }),

      show: {
        set (val) {
          this.$store.commit('App/SET_SETTINGS', val)
        },
        get () {
          return this.$store.state.App.settings
        }
      }
    },
  
    methods: {
      ...mapActions({
        saveSettings: 'Settings/save'
      }),
  
      openFoldersDialog () {
        const dirPath = dialog.showOpenDialogSync({
          title: 'Choose folder',
          properties: ['openDirectory'],
          defaultPath: this.folderPath
        })
  
        if (dirPath) {
          this.directory = dirPath[0]
        }
      },
  
      save () {
        this.show = false
  
        this.saveSettings({ path: this.directory, isDark: this.isDark })
      },
  
      cancel () {
        this.show = false
  
        setTimeout(() => {
          this.isDark = this.isDarkTheme
  
          this.directory = this.folderPath
  
          this.$vuetify.theme.dark = this.isDarkTheme
        }, 250)
      }
    },
  
    beforeMount () {
      this.directory = this.folderPath

      this.isDark = this.isDarkTheme
    }
  }
</script>
