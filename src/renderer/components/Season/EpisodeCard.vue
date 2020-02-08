<template>
	<v-card
		:class="{'watched': isWatched}"
		:raised="!isWatched"
		height="100%"
	>
		<v-list-item>
			<v-list-item-content>
				<v-list-item-title class="title">
					<v-tooltip
						open-delay="500"
						bottom
					>
						<template v-slot:activator="{ on }">
							<span
								v-text="item.name"
								v-on="on"
							/>
						</template>
						<span v-text="item.name"/>
					</v-tooltip>
				</v-list-item-title>
			</v-list-item-content>
		</v-list-item>
		
		<v-img
			height="160"
			:src="img"
		/>
		
		<v-card-text class="mb-12">
			<div class="d-flex justify-space-between">
				<v-chip
					class="caption"
					small
				>
					Episode {{ item.episode_number }}
				</v-chip>
				
				<v-chip
					class="caption"
					small
				>
					{{ item.air_date }}
				</v-chip>
			</div>
			
			<div class="my-9 caption">
				{{ item.overview }}
			</div>
		</v-card-text>
		
		<v-card-actions>
			<v-btn
				@click="$emit('show-torrents-dialog')"
				:disabled="isWatched"
				text
			>
				Torrents
			</v-btn>
			
			<v-btn
				@click="toggleWatch"
				icon
			>
				<v-icon>
					{{ icon }}
				</v-icon>
			</v-btn>
			
			<v-btn
				v-if="hasTorrent"
				@click="open"
				icon
			>
				<v-icon>
					mdi-play
				</v-icon>
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  
  export default {
    name: 'EpisodeCard',
  
    props: ['item'],
  
    computed: {
      ...mapGetters({
        watched: 'Favorites/isWatched',
        torrents: 'Media/torrents'
      }),
  
      isWatched () {
        return this.watched(this.item.episode_number)
      },
  
      icon () {
        return `mdi-eye${this.isWatched ? '-off' : ''}`
      },
  
      img () {
        if (this.item.still_path) {
          return `https://image.tmdb.org/t/p/w500/${this.item.still_path}`
        }
  
        return 'https://fakeimg.pl/293x160/424242/?retina=1&text=no image'
      },
  
      torrent () {
        return this.$store.getters['Torrents/torrent'](this.item.id)
      },
  
      hasTorrent () {
        return !!this.torrent
      },
  
      subtitle () {
        return this.$store.getters['Subtitles/subtitle'](this.item.id)
      },
  
      hasSubtitle () {
        return !!this.subtitle
      }
    },
  
    methods: {
      ...mapActions({
        toggleWatchUnwatch: 'Favorites/toggleWatchUnwatch'
      }),
  
      toggleWatch () {
        this.toggleWatchUnwatch(this.item.episode_number)
      },
  
      open () {
        if (this.hasSubtitle) {
          console.log(this.torrent.path, this.subtitle.path)
        }
      }
    }
  }
</script>

<style scoped>
	.watched {
		opacity: .5;
	}
	
	.v-card {
		position: relative;
	}
	
	.v-card__actions {
		position: absolute;
		bottom: 0
	}
</style>
