<template>
	<v-dialog
		transition="dialog-bottom-transition"
		@input="val => $emit('show', val)"
		:value="show"
		hide-overlay
		fullscreen
	>
		<v-card v-if="this.items">
			<v-toolbar dark>
				<v-btn
					@click="$emit('show', false)"
					icon
					dark
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
				
				<v-toolbar-title>
					{{ mediaTitle }} <span class="body-2" v-if="currentMedia === 'tv'">{{ season }} / {{ episode }}</span>
				</v-toolbar-title>
			</v-toolbar>
			<v-tabs
				v-model="tab"
				fixed-tabs
				dark
			>
				<v-tab href="#tab-1">
					Torrents
				</v-tab>
				<v-tab href="#tab-2">
					Subtitles
				</v-tab>
				
				<v-tab-item
					value="tab-1"
				>
					<v-card-text>
						<v-expansion-panels v-model="panel" multiple>
							<v-expansion-panel
								:readonly="!!items.popcorn"
								:disabled="!items.popcorn"
							>
								<v-expansion-panel-header>Popcorn Time</v-expansion-panel-header>
								<v-expansion-panel-content>
									<v-chip
										v-for="(item, i) in items.popcorn"
										@click="downloadTorrent(item.url)"
										class="mr-4"
										:key="i"
									>
										<v-tooltip
											open-delay="500"
											bottom
										>
											<template v-slot:activator="{ on }">
												<span v-on="on">{{ i }}</span>
											</template>
											<div>
												<div>{{ item.filesize }}</div>
												<div v-if="currentMedia === 'movie'">{{ item.seed }} / {{ item.peer }}</div>
												<div v-else>{{ item.seeds }} / {{ item.peers }}</div>
											</div>
										</v-tooltip>
									</v-chip>
								</v-expansion-panel-content>
							</v-expansion-panel>
							
							<v-expansion-panel :disabled="fetchingTPB || !items.tpb">
								<v-expansion-panel-header>The Pirate Bay</v-expansion-panel-header>
								<v-expansion-panel-content>
									<v-chip
										v-for="(item, i) in items.tpb"
										@click="downloadTorrent(item.url)"
										class="mr-4"
										:key="i"
									>
										<v-tooltip
											open-delay="500"
											bottom
										>
											<template v-slot:activator="{ on }">
												<span v-on="on">{{ item.meta.resolution || item.meta.quality || item.meta.group }}</span>
											</template>
											<div>
												<div>{{ item.title }}</div>
												<div>{{ item.size }}</div>
												<div>{{ item.seeders }} / {{ item.leechers }}</div>
											</div>
										</v-tooltip>
									</v-chip>
								</v-expansion-panel-content>
							</v-expansion-panel>
						</v-expansion-panels>
					</v-card-text>
				</v-tab-item>
				
				<v-tab-item
					value="tab-2"
				>
					<v-card
						flat
						tile
					>
						<v-card-text>Subtitles</v-card-text>
					</v-card>
				</v-tab-item>
			</v-tabs>
		</v-card>
	</v-dialog>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  
  export default {
    name: 'TorrentsDialog',
  
    props: ['show', 'episode'],
  
    data () {
      return {
        tab: null,
        panel: [],
        items: null,
        fetchingTPB: true
      }
    },
  
    computed: {
      ...mapState({
        currentMedia: state => state.App.currentMedia,
        mediaTitle: state => state.Media.current.title,
        season: state => state.Media.season.season_number,
        releaseDate: state => state.Media.current.releaseDate
      }),
  
      ...mapGetters({
        torrents: 'Media/torrents'
      })
    },
  
    methods: {
      ...mapActions({
        download: 'Torrents/download'
      }),
  
      getTorrents () {
        this.setPopcornTorrents()
  
        this.setTPBTorrents()
      },
  
      setPopcornTorrents () {
        if (this.torrents.popcorn) {
          if (this.currentMedia === 'tv') {
            let torrents = this.torrents.popcorn[this.episode]
  
            if (torrents) {
              this.panel = [0]
  
              this.items.popcorn = torrents.torrents
  
              return
            }
  
            this.items.popcorn = null
  
            return
          }
  
          this.panel = [0]
  
          this.items.popcorn = this.torrents.popcorn
        }
      },
  
      setTPBTorrents () {
        let query = this.currentMedia === 'tv'
          ? `${this.mediaTitle} S${this.season <= 9 ? `0${this.season}` : this.season}E${this.episode <= 9 ? `0${this.episode}` : this.episode}`
          : `${this.mediaTitle}`
  
        this.$store.dispatch('Media/searchTorrents', query)
          .then(data => {
            if (data.length > 0) {
              this.items.tpb = data.filter(item => item.meta.resolution || item.meta.quality || item.meta.group)
            }
  
            this.fetchingTPB = false
          })
          .catch(() => (this.fetchingTPB = false))
      },
  
      downloadTorrent (magnet) {
        this.$emit('show', false)
  
        this.$nextTick(() => {
          if (this.currentMedia === 'tv') {
            this.download({magnet, episode: this.episode})
  
            return
          }
  
          this.download({magnet})
        })
      }
    },
  
    watch: {
      show (val) {
        if (val) {
          this.panel = []
  
          this.items = {
            popcorn: null,
            tpb: null
          }
  
          this.getTorrents()
        }
      }
    }
  }
</script>

<style scoped>

</style>
