<template>
	<v-row justify="center">
		<v-tabs>
			<template v-for="(item, i) in items">
				<v-tab
					@change="setMediaType(item.mediaType)"
					:key="i"
				>
					{{ item.title }}
					
					<v-icon right>
						mdi-numeric-{{ item.items.length }}-circle-outline
					</v-icon>
				</v-tab>
				
				<v-tab-item
					style="min-height: 270px"
					:key="i"
				>
					<v-container fluid>
						<cards-row :items="item.items"/>
					</v-container>
				</v-tab-item>
			</template>
		</v-tabs>
	</v-row>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import CardsRow from '../components/CardsRow'
  
  export default {
    name: 'Home',
  
    components: { CardsRow },
  
    computed: {
      ...mapGetters({
        movies: 'Favorites/movies',
        shows: 'Favorites/shows'
      }),
  
      items () {
        return [
          {
            title: 'Movies',
            items: this.movies,
            mediaType: 'movie'
          },
          {
            title: 'TV Shows',
            items: this.shows,
            mediaType: 'tv'
          }
        ]
      }
    },
  
    methods: {
      ...mapMutations({
        setMediaType: 'App/SET_MEDIA',
        setTitle: 'App/SET_TITLE'
      })
    },
  
    mounted () {
      this.setMediaType(this.items[0].mediaType)
  
      this.setTitle('Favorites')
    }
  }
</script>
