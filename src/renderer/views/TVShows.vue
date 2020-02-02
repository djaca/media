<template>
	<div>
		<cards-row :items="shows"/>
		
		<v-row justify="center">
			<v-col cols="3">
				<v-btn
					@click="fetch"
					block
					large
				>
					Load more
				</v-btn>
			</v-col>
		</v-row>
	</div>
</template>

<script>
  import CardsRow from '../components/CardsRow'
  import { mapState, mapActions } from 'vuex'
  
  export default {
    name: 'TVShows',
  
    components: { CardsRow },
  
    computed: {
      ...mapState({
        shows: state => state.Media.items
      })
    },
  
    methods: {
      ...mapActions({
        fetch: 'Media/fetch',
        get: 'Media/get'
      })
    },
  
    beforeMount () {
      if (this.$store.state.route.from.name === 'movies') {
        this.$store.commit('App/RESET_TYPE')
      }
  
      this.get()
    }
  }
</script>
