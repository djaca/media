<template>
	<v-row justify="center">
		<v-container fluid>
			<cards-row :items="items"/>
		</v-container>
	</v-row>
</template>

<script>
  import { mapMutations } from 'vuex'
  import CardsRow from '../components/CardsRow'
  
  export default {
    name: 'Home',
  
    components: { CardsRow },
  
    computed: {
      items () {
        return this.$store.getters[`Favorites/${this.$store.state.App.sortRule.by}`](this.$store.state.App.sortRule.order)
      }
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
