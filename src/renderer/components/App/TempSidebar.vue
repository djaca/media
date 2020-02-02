<template>
	<v-navigation-drawer
		v-model="drawer"
		temporary
		fixed
		right
	>
		<v-list dense>
			<template v-for="(type, i) in types">
				<v-list-item
					:input-value="isActive(type.name)"
					@click.stop="to(type)"
					:key="i"
				>
					<v-list-item-content>
						<v-list-item-title v-text="type.text"/>
					</v-list-item-content>
				</v-list-item>
			</template>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  
  export default {
    name: 'TempSidebar',
  
    computed: {
      ...mapState({
        current: state => state.App.type,
        tempSidebar: state => state.App.tempSidebar
      }),

      ...mapGetters({
        types: 'App/types'
      }),
  
      drawer: {
        set (val) {
          this.setDrawer(val)
        },
        get () {
          return this.tempSidebar
        }
      }
    },
  
    methods: {
      ...mapMutations({
        setDrawer: 'App/SET_TEMP_SIDEBAR'
      }),
  
      ...mapActions({
        setType: 'App/setType',
        fetch: 'Media/get'
      }),
  
      to (type) {
        this.drawer = false
  
        this.setType(type)
          .then(() => {
            this.fetch()
          })
      },
  
      isActive (name) {
        if (this.current) {
          return this.current.name === name
        }
      }
    },
  
    watch: {
      '$route' (to, from) {
        if (to.name !== from.name) {
          this.$store.commit('App/RESET_TYPE')
        }
      }
    }
  }
</script>
