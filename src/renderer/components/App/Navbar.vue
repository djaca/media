<template>
	<v-app-bar app>
		<v-app-bar-nav-icon
			@click.stop="toggleSidebar"
		/>
		
		<!-- Make this as component -->
		<v-btn
			v-if="$route.name === 'season'"
			@click="back"
			icon
		>
			<v-icon>mdi-arrow-left-thick</v-icon>
		</v-btn>
		
		<v-toolbar-title class="headline d-flex align-center">
			<v-icon
				v-if="$route.name !== 'home'"
				large
				light
			>
				{{ $store.getters['App/icon'] }}
			</v-icon>
			
			<div
				v-html="$store.state.App.title"
				class="ml-4"
			/>
		</v-toolbar-title>
		
		<v-spacer/>
		
		<template v-if="$route.name === 'movies' || $route.name === 'tv-shows'">
			<v-search/>
			
			<v-spacer/>
			
			<v-app-bar-nav-icon @click.stop="toggleTempSidebar"/>
		</template>
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
