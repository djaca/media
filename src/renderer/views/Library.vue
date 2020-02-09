<template>
	<div>
		<cards-row :items="items"/>
		
		<v-row justify="center">
			<v-col cols="3">
				<v-btn
					v-text="'Load more'"
					@click="fetch"
					block
					large
				/>
			</v-col>
		</v-row>
	</div>
</template>

<script>
  import CardsRow from '@/components/CardsRow'
  import { mapState, mapActions } from 'vuex'
  
  export default {
    name: 'Library',
  
    components: { CardsRow },
  
    computed: {
      ...mapState({
        items: state => state.Media.items,
        currentMedia: state => state.App.currentMedia
      })
    },
  
    methods: {
      ...mapActions({
        fetch: 'Media/fetch',
        get: 'Media/get'
      })
    },
  
    watch: {
      currentMedia (val, oldVal) {
        if (val !== oldVal) {
          this.get()
        }
      }
    },
  
    beforeMount () {
      this.get()
    }
  }
</script>
