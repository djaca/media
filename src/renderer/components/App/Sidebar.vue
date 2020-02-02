<template>
	<v-navigation-drawer
		v-model="sidebar"
		temporary
		app
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
    }
  }
</script>
