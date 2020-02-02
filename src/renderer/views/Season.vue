<template>
	<v-row v-if="season">
		<v-col
			v-for="(episode, i) in season.episodes"
			:key="i"
			cols="2"
		>
			<episode-card
				@show-torrents-dialog="openTorrentsDialog(episode.episode_number)"
				:item="episode"
			/>
		</v-col>
		
		<torrents-dialog
			@show="val => torrentsDialog = val"
			:show="torrentsDialog"
			:episode="episode"
		/>
	</v-row>
</template>

<script>
  import EpisodeCard from '../components/Season/EpisodeCard'
  import TorrentsDialog from '../components/TorrentsDialog'
  import { mapActions, mapState } from 'vuex'
  
  export default {
    name: 'Season',
  
    components: { TorrentsDialog, EpisodeCard },
  
    data () {
      return {
        torrentsDialog: false,
        episode: null
      }
    },
  
    computed: {
      ...mapState({
        season: state => state.Media.season,
        tvShow: state => state.Media.current,
        torrents: state => state.Media.torrents
      })
    },
  
    methods: {
      ...mapActions({
        fetch: 'Media/getSeason',
        getCurrent: 'Media/getCurrent'
      }),
  
      openTorrentsDialog (episode) {
        this.episode = episode
  
        this.torrentsDialog = true
      }
    },
  
    watch: {
      '$route': 'fetch'
    },
  
    async beforeMount () {
      try {
        if (this.tvShow) {
          await this.fetch()
  
          return
        }
  
        await this.getCurrent()
  
        await this.fetch()
      } catch (err) {
        console.log(err)
      }
    }
  }
</script>
