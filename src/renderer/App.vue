<template>
	<div id="app">
		<v-app id="inspire">
			
			<sidebar/>
			
			<temp-sidebar/>
			
			<navbar />
			
			<v-content class="mb-12">
				<loader v-if="loading"/>
				
				<router-view/>
			</v-content>
			
			<torrent-downloader/>
		</v-app>
	</div>
</template>

<script>
  import Navbar from '@/components/App/Navbar'
  import Sidebar from '@/components/App/Sidebar'
  import TempSidebar from '@/components/App/TempSidebar'
  import Loader from '@/components/App/Loader'
  import TorrentDownloader from './components/TorrentDownloader'
  import { mapState } from 'vuex'
  
  export default {
    name: 'App',
  
    components: { Navbar, Sidebar, TempSidebar, Loader, TorrentDownloader },
  
    computed: {
      ...mapState({
        loading: state => state.Loader.show
      })
    }
  }
</script>
