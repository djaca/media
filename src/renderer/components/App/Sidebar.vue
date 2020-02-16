<template>
	<v-navigation-drawer
		v-model="sidebar"
		temporary
		app
		class="d-flex flex-column justify-space-between"
	>
		<v-list dense>
			<v-list-item
				@click.stop="sidebar = false"
				:to="{name: 'home'}"
				exact
				link
			>
				<v-list-item-content>
					<v-list-item-title v-text="'Home'"/>
				</v-list-item-content>
			</v-list-item>
			
			<template v-for="(link, i) in links">
				<v-list-item
					@click.stop="sidebar = false"
					:to="{name: link.name}"
					:key="i"
					link
				>
					<v-list-item-content>
						<v-list-item-title v-text="link.title"/>
					</v-list-item-content>
				</v-list-item>
			</template>
		</v-list>
		
		<template v-slot:append>
			<v-list dense>
				<v-list-item
					@click.stop="showSettings"
					exact
					link
				>
					<v-list-item-content>
						<v-list-item-title v-text="'Settings'"/>
					</v-list-item-content>
				</v-list-item>
			</v-list>
		</template>
	</v-navigation-drawer>
</template>

<script>
  export default {
    name: 'Sidebar',
  
    data () {
      return {
        links: [
          {
            title: 'Movies',
            name: 'movies'
          },
          {
            title: 'TV Shows',
            name: 'tv-shows'
          }
        ]
      }
    },
  
    computed: {
      sidebar: {
        set (val) {
          this.$store.commit('App/SET_SIDEBAR', val)
        },
        get () {
          return this.$store.state.App.sidebar
        }
      }
    },
  
    methods: {
      showSettings () {
        this.sidebar = false
  
        this.$store.commit('App/SET_SETTINGS', true)
      }
    }
  }
</script>
