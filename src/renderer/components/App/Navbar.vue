<template>
	<v-app-bar app>
		<v-app-bar-nav-icon
			@click.stop="toggleSidebar"
		/>
		
		<v-btn
			v-if="$route.name === 'season'"
			@click="back"
			class="mr-3"
			icon
		>
			<v-icon v-text="'mdi-arrow-left-thick'" />
		</v-btn>
		
		<v-toolbar-title class="headline d-flex align-center">
			<v-icon
				v-if="$route.name !== 'home'"
				large
				color="grey darken-3"
			>
				{{ $store.getters['App/icon'] }}
			</v-icon>
			
			<div
				v-html="$store.state.App.title"
				class="ml-4"
			/>
		</v-toolbar-title>
		
		<v-spacer/>
		
		<template v-if="$route.name === 'movies' || $route.name === 'tv-shows' || $route.name === 'home'">
			<v-search/>
			
			<v-spacer/>
			
		</template>
		
		<v-app-bar-nav-icon
			v-if="$route.name === 'movies' || $route.name === 'tv-shows'"
			@click.stop="toggleTempSidebar"
		/>
	</v-app-bar>
</template>

<script>
  import VSearch from '@/components/App/VSearch'
  import { mapMutations } from 'vuex'
  
  export default {
    name: 'Navbar',
  
    components: { VSearch },
  
    data () {
      return {
        right: false,
        drawerRight: false
      }
    },
  
    methods: {
      ...mapMutations({
        'toggleSidebar': 'App/TOGGLE_SIDEBAR',
        'toggleTempSidebar': 'App/SET_TEMP_SIDEBAR'
      }),
  
      back () {
        return this.$router.push({ name: 'tv', params: { id: this.$store.state.Media.current.id } })
      }
    }
  }
</script>

<style scoped>

</style>
