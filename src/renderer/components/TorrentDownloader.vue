<template>
	<div
		class="v-dialog__content v-dialog__content--active"
		style="z-index:202;"
		role="document"
		tabindex="-1"
	>
		<transition name="bottom-sheet-transition">
			<div
				class="v-dialog v-dialog--active v-dialog--persistent v-bottom-sheet v-bottom-sheet--inset"
				style="max-width:70%;margin-bottom:0"
				v-if="show"
			>
				<v-card tile>
					<v-progress-linear
						v-if="!fetchingMetadata"
						:value="remaining"
						class="my-0"
						height="3"
					></v-progress-linear>
					
					<v-list>
						<v-list-item>
							<v-list-item-avatar
								height="100%"
								v-if="img"
								tile
							>
								<v-img :src="img"></v-img>
							</v-list-item-avatar>
							
							<v-list-item-content v-if="fetchingMetadata">
								<v-list-item-title>Fetching metadata</v-list-item-title>
							</v-list-item-content>
							
							<template v-else>
								<v-list-item-content>
									<v-list-item-title v-text="title"/>
									
									<v-list-item-subtitle
										v-text="subtitleText"
										v-if="subtitleText"
									/>
								</v-list-item-content>
								
								<v-spacer/>
								
								<v-list-item-content>
									<v-list-item-subtitle v-text="torrentSize"/>
									<v-list-item-subtitle v-text="downloadingSpeed"/>
								</v-list-item-content>
								
								<v-spacer/>
							</template>
							
							<v-list-item-icon>
								<v-btn
									v-if="remaining > 5"
									@click="play"
									x-large
									icon
								>
									<v-icon>mdi-play</v-icon>
								</v-btn>
							</v-list-item-icon>
							
							<v-list-item-icon>
								<v-btn
									@click="stopDownloading"
									x-large
									icon
								>
									<v-icon>mdi-stop</v-icon>
								</v-btn>
							</v-list-item-icon>
						</v-list-item>
					</v-list>
				</v-card>
			</div>
		</transition>
	</div>
</template>

<script>
  import { mapState, mapMutations, mapGetters } from 'vuex'
  import torrentStream from 'torrent-stream'
  import prettyBytes from 'pretty-bytes'
  
  export default {
    name: 'TorrentDownloader',
  
    data () {
      return {
        fetchingMetadata: false,
        engine: null,
        timer: null,
        size: null,
        speed: null,
        downloaded: null,
        title: null,
        img: null
      }
    },
  
    computed: {
      ...mapState({
        show: state => state.App.torrentDownloader,
        current: state => state.Torrents.current,
        media: state => state.Media.current
      }),
  
      ...mapGetters({
        folderPath: 'Settings/folderPath'
      }),
  
      isMovie () {
        if (this.current) {
          return !this.current.episode
        }
  
        return true
      },
  
      subtitleText () {
        if (!this.isMovie) {
          return `S${this.current.season <= 9 ? `0${this.current.season}` : this.current.season}E${this.current.episode <= 9 ? `0${this.current.episode}` : this.current.episode}`
        }
  
        return null
      },
  
      downloadingSpeed () {
        return this.speed ? `${prettyBytes(this.speed, { bits: true })}/s` : '0 kbit/s'
      },
  
      torrentSize () {
        if (this.size) {
          return prettyBytes(this.size)
        }
  
        return ''
      },
  
      remaining () {
        if (this.downloaded && this.size) {
          return ((this.downloaded / this.size) * 100)
        }
  
        return 0
      },
  
      subtitle () {
        return this.$store.getters['Subtitles/subtitle'](this.current.id)
      }
    },
  
    methods: {
      ...mapMutations({
        showDownloader: 'App/SET_SHOW_TORRENT'
      }),
  
      startDownloading () {
        this.fetchingMetadata = true
  
        this.showDownloader(true)
  
        this.img = `https://image.tmdb.org/t/p/w500/${this.media.img}`
  
        this.title = this.media.title
  
        this.engine = torrentStream(this.current.magnet, { path: this.folderPath })
  
        this.engine.on('ready', () => {
          const file = this.engine.files.sort((a, b) => b.length - a.length)[0]
  
          this.$store.commit('Torrents/ADD_FILE_PATH', `${this.folderPath}/${file.path}`)
  
          file.createReadStream()
  
          this.size = file.length
  
          this.timer = setInterval(() => {
            this.speed = this.engine.swarm.downloadSpeed()
            this.downloaded = this.engine.swarm.downloaded
          }, 1000)
        })
  
        this.engine.on('torrent', () => {
          this.fetchingMetadata = false
  
          this.$store.commit('Torrents/ADD_ITEM', this.current)
        })
  
        this.engine.on('idle', () => {
          this.$store.commit('Snackbar/setSnack', 'Torrent downloaded successfully')
  
          this.showDownloader(false)

          this.clear()
        })
      },
  
      stopDownloading () {
        this.showDownloader(false)
  
        this.$store.commit('Torrents/REMOVE_ITEM', this.current.id)
  
        this.$store.commit('Torrents/SET_IS_DOWNLOADING', false)
  
        this.$store.commit('Torrents/SET_CURRENT', null)
  
        this.$store.commit('Snackbar/setSnack', {snack: 'Torrent download stopped', color: ''})
  
        this.clear()
      },
  
      clear () {
        if (this.engine) {
          this.engine.destroy()
        }
  
        if (this.timer) {
          clearInterval(this.timer)
        }
  
        this.engine = null
  
        this.timer = null
  
        this.size = null
  
        this.speed = null
  
        this.downloaded = null
  
        this.title = null
  
        this.img = null
      },
  
      play () {
        if (this.subtitle) {
          this.$electron.shell.openItem(this.subtitle.path)
        }
  
        this.$electron.shell.openItem(this.current.path)
      }
    },
  
    mounted () {
      this.$store.watch(state => state.Torrents.isDownloading, () => {
        if (this.$store.state.Torrents.isDownloading) {
          return this.startDownloading()
        }

        this.clear()
      })
    }
  }
</script>
