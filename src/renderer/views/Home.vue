<template>
	<v-row justify="center">
		<v-container fluid>
			<cards-row :items="shows"/>
		</v-container>
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
        shows: 'Favorites/shows'
      })
    },
  
    methods: {
      ...mapMutations({
        setTitle: 'App/SET_TITLE',
        setMediaType: 'App/SET_MEDIA'
      })
    },
  
    mounted () {
      this.setTitle('Favorites')
  
      this.setMediaType('tv')
    }
  }
</script>
