<template>
	<v-dialog
		transition="dialog-bottom-transition"
		@input="val => $emit('show', val)"
		:value="show"
		hide-overlay
		fullscreen
	>
		<v-card v-if="torrentProviders">
			<v-toolbar>
				<v-btn
					@click="$emit('show', false)"
					icon
				>
					<v-icon>mdi-close</v-icon>
				</v-btn>
				
				<v-toolbar-title>
					{{ mediaTitle }}
					<span class="body-2" v-if="currentMedia === 'tv'">{{ season }} / {{ item.episode_number }}</span>
				</v-toolbar-title>
			</v-toolbar>
			<v-tabs
				v-model="tab"
				fixed-tabs
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
								:readonly="!!torrentProviders.popcorn"
								:disabled="!torrentProviders.popcorn"
							>
								<v-expansion-panel-header>Popcorn Time</v-expansion-panel-header>
								<v-expansion-panel-content>
									<v-chip
										v-for="(item, i) in torrentProviders.popcorn"
										:disabled="torrentExists(item.url)"
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
							
							<v-expansion-panel :disabled="fetchingTPB || !torrentProviders.tpb">
								<v-expansion-panel-header>The Pirate Bay</v-expansion-panel-header>
								<v-expansion-panel-content>
									<v-chip
										v-for="(item, i) in torrentProviders.tpb"
										:disabled="torrentExists(item.url)"
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
				
				<v-tab-item value="tab-2">
					<v-card
						flat
						tile
					>
						<v-card-text>
							<v-simple-table>
								<template v-slot:default>
									<thead>
									<tr>
										<th class="text-left">Name</th>
										<th class="text-left"></th>
										<th class="text-left">Lang</th>
										<th class="text-left">Author</th>
										<th class="text-left">Count</th>
									</tr>
									</thead>
									<tbody>
									<tr v-for="subtitle in subtitles" :key="subtitle.id">
										<td>{{ subtitle.versions }}</td>
										<td>
											<v-btn
												@click="downloadSubtitle(item.id, subtitle.id)"
												v-if="!subtitleExists(subtitle.id)"
												text
												icon
											>
												<v-icon>mdi-download-outline</v-icon>
											</v-btn>
											
											<v-btn
												@click="openSubtitle()"
												v-else
												text
												icon
											>
												<v-icon>mdi-open-in-new</v-icon>
											</v-btn>
										</td>
										<td>{{ subtitle.language }}</td>
										<td>{{ subtitle.author }}</td>
										<td>{{ subtitle.downloads }}</td>
									</tr>
									</tbody>
								</template>
							</v-simple-table>
						</v-card-text>
					</v-card>
				</v-tab-item>
			</v-tabs>
		</v-card>
	</v-dialog>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import { searchTorrents } from '@/api/thePirateBay'
  
  export default {
    name: 'TorrentsDialog',
  
    props: ['show', 'item'],
  
    data () {
      return {
        tab: null,
        panel: [],
        torrentProviders: null,
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
        torrents: 'Media/torrents',
        cc: 'Media/subtitles'
      }),
  
      subtitles () {
        if (this.currentMedia === 'tv') {
          return this.cc(this.item.episode_number)
        }
  
        return this.cc()
      },
  
      subtitle () {
        return this.$store.getters['Subtitles/subtitle'](this.item.id)
      },
  
      isMovie () {
        return this.currentMedia !== 'tv'
      }
    },
  
    methods: {
      ...mapActions({
        searchTorrents: 'Media/searchTorrents'
      }),
  
      getTorrents () {
        this.setPopcornTorrents()
  
        this.setTPBTorrents()
      },
  
      setPopcornTorrents () {
        if (this.torrents.popcorn) {
          if (!this.isMovie) {
            let torrents = this.torrents.popcorn[this.item.episode_number]
  
            if (torrents) {
              torrents = torrents.torrents
  
              this.panel = [0]
  
              if (torrents.hasOwnProperty(0)) {
                delete torrents[0]
              }
  
              this.torrentProviders.popcorn = torrents
  
              return
            }
  
            this.torrentProviders.popcorn = null
  
            return
          }
  
          this.panel = [0]
  
          this.torrentProviders.popcorn = this.torrents.popcorn
        }
      },
  
      async setTPBTorrents () {
        try {
          let items = await searchTorrents(this.getQueryText())
  
          if (items.length > 0) {
            this.torrentProviders.tpb = items.filter(item => item.meta.resolution || item.meta.quality || item.meta.group)
          }
        } catch (err) {
          console.log(err)
        }
  
        this.fetchingTPB = false
      },
  
      getQueryText () {
        let query = this.mediaTitle
  
        if (!this.isMovie) {
          query += ` S${this.season <= 9 ? `0${this.season}` : this.season}E${this.item.episode_number <= 9 ? `0${this.item.episode_number}` : this.item.episode_number}`
        }
  
        return query
      },
  
      downloadTorrent (magnet) {
        this.$emit('show', false)
  
        let data = { id: this.item.id, magnet }
  
        if (this.currentMedia === 'tv') {
          data.season = this.item.season_number
  
          data.episode = this.item.episode_number
        }
  
        this.$nextTick(() => {
          this.$store.dispatch('Torrents/download', data)
        })
      },
  
      torrentExists (url) {
        let torrent = this.$store.getters['Torrents/torrent'](this.item.id)
  
        if (torrent) {
          return torrent.magnet === url
        }
      },
  
      downloadSubtitle (id, urlId) {
        this.$store.dispatch('Subtitles/download', { id, urlId })
      },
  
      subtitleExists (id) {
        if (this.subtitle) {
          return this.subtitle.urlId === id
        }
      },
  
      openSubtitle () {
        this.$electron.shell.openItem(this.subtitle.path)
      }
    },
  
    watch: {
      show (val) {
        if (val) {
          this.panel = []
  
          this.torrentProviders = {
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
