<template>
	<div id="app">
		<v-app id="inspire">
			
			<sidebar/>
			
			<temp-sidebar/>
			
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
				
				<template v-if="$route.name === 'movies' || $route.name === 'tv-shows'">
					<v-spacer/>
					
					<v-app-bar-nav-icon @click.stop="toggleTempSidebar"/>
				</template>
			</v-app-bar>
			
			<v-content class="mb-12">
				<v-container fluid>
					<loader v-if="loading"/>

					<router-view/>
				</v-container>
			</v-content>
			
			<torrent-downloader />
		</v-app>
	</div>
</template>

<script>
  import Sidebar from '@/components/App/Sidebar'
  import TempSidebar from '@/components/App/TempSidebar'
  import Loader from '@/components/App/Loader'
  import TorrentDownloader from './components/TorrentDownloader'
  import { mapState, mapMutations } from 'vuex'
  
  export default {
    name: 'App',
  
    components: { Sidebar, TempSidebar, Loader, TorrentDownloader },
  
    data () {
      return {
        right: false,
        drawerRight: false
      }
    },
  
    computed: {
      ...mapState({
        loading: state => state.Loader.show
      })
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
