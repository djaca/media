<template>
	<div v-if="media">
		<v-container fluid>
			<v-row>
				<v-col
					cols="2"
				>
					<v-img
						:src="getMainImg(media.img)"
						height="400px"
					/>
					
					<v-btn
						@click="toggleAddRemove"
						:text="exists"
						class="mt-5"
						block
						dark
					>
						<span v-text="favoritesBtn"/>
					</v-btn>
					
					<v-btn
						@click.stop="videosDialog = true"
						class="mt-5"
						block
						dark
					>
						Trailer
					</v-btn>
					
					<v-btn
						@click.stop="openTorrentsDialog"
						:disabled="!hasTorrents"
						v-if="isMovie"
						class="mt-5"
						block
						dark
					>
						Torrents
					</v-btn>
					
					<v-btn
						v-if="isMovie && hasTorrent"
						class="mt-5"
						block
						dark
					>
						Play
					</v-btn>
				</v-col>
				
				<v-col
					cols="9"
					offset="1"
				>
					<div class="mb-3">
						<span
							class="display-2"
							v-text="media.title"
						/>&nbsp;
						<span
							v-text="media.releaseDate.substring(0, 4)"
							class="title text--secondary"
						/>
					</div>
					
					<v-row align="center">
						<v-col class="d-flex align-center justify-space-between">
							<div>
								<v-progress-circular
									:value="media.votes* 10"
									:rotate="-90"
									color="lime"
									:size="60"
									:width="7"
								>
									{{ media.votes * 10 }} %
								</v-progress-circular>
								
								<span
									style="line-height: 1rem"
									class="ml-2"
								>
									User score
								</span>
							</div>
							
							<div class="d-flex justify-space-between align-center">
								<v-chip class="mr-12">
									<v-avatar left>
										<v-icon>mdi-av-timer</v-icon>
									</v-avatar>
									
									{{ formatRuntime(media.runtime) }}
								</v-chip>
								
								<div>
									<v-chip
										v-for="(genre, i) in media.genres"
										v-text="genre"
										class="ma-2"
										:key="i"
									/>
								</div>
							</div>
							
							<v-chip
								color="success"
								label
							>
								<v-avatar left>
									<v-icon>mdi-checkbox-marked-circle</v-icon>
								</v-avatar>
								
								{{ media.status }}
							</v-chip>
						</v-col>
					</v-row>
					
					<v-row class="my-5">
						<v-col
							cols="8"
							xl="7"
						>
							{{ media.overview}}
						</v-col>
					</v-row>
					
					<v-row no-gutters>
						<v-col class="d-flex">
							<v-card
								v-for="(actor, i) in media.cast.slice(0, 5)"
								max-width="100px"
								height="100%"
								class="mr-4"
								:key="i"
							>
								<v-img :src="getCastImg(actor.profile_path)"/>
								
								<div class="caption pa-2">
									<div>{{ actor.name }}</div>
								
									<div class="grey--text">{{ actor.character }}</div>
								</div>
							</v-card>
						</v-col>
					</v-row>
				</v-col>
			</v-row>
			
			<cards-row
				:items="media.seasons"
				v-if="media.seasons"
				title="Seasons"
				class="mt-12"
				season
			/>
			
			<cards-row
				:items="media.recommendations"
				title="Recommendations"
				class="mt-12"
			/>
			
			<cards-row
				:items="media.similar"
				class="mt-12 mb-5"
				title="Similar"
			/>
		</v-container>
		
		<videos-dialog
			@show="val => videosDialog = val"
			:items="media.videos"
			:show="videosDialog"
		/>
		
		<torrents-dialog
			@show="val => torrentsDialog = val"
			:show="torrentsDialog"
			:items="torrents"
			v-if="isMovie"
		/>
	</div>
</template>

<script>
  import CardsRow from '../components/CardsRow'
  import VideosDialog from '../components/VideosDialog'
  import TorrentsDialog from '../components/TorrentsDialog'
  import { mapState, mapGetters, mapActions } from 'vuex'
  
  export default {
    name: 'Media',
  
    components: { CardsRow, VideosDialog, TorrentsDialog },
  
    data () {
      return {
        torrentsDialog: false,
        videosDialog: false
      }
    },
  
    computed: {
      ...mapState({
        media: state => state.Media.current,
        mediaType: state => state.App.currentMedia,
        torrents: state => state.Media.torrents
      }),
  
      ...mapGetters({
        exists: 'Favorites/exists'
      }),
  
      isMovie () {
        return this.mediaType === 'movie'
      },
  
      favoritesBtn () {
        return `${this.exists ? 'remove from' : 'add to'} favorites`
      },
  
      hasTorrents () {
        return !!this.torrents
      },
  
      hasTorrent () {
        return !!this.$store.state.Torrents.items.find(t => t.id === this.media.id)
      }
    },
  
    methods: {
      ...mapActions({
        fetch: 'Media/getCurrent',
        toggleAddRemove: 'Favorites/toggleAddRemove'
      }),
  
      formatRuntime (runtime) {
        return `${Math.floor(runtime / 60)}h ${runtime % 60}m`
      },
  
      getMainImg (img) {
        return `https://image.tmdb.org/t/p/w500${img}`
      },
  
      getCastImg (img) {
        return `https://image.tmdb.org/t/p/w138_and_h175_face${img}`
      },
  
      openTorrentsDialog () {
        this.torrentsDialog = true
      }
    },
  
    watch: {
      '$route': 'fetch'
    },
  
    beforeMount () {
      this.fetch()
    }
  }
</script>
