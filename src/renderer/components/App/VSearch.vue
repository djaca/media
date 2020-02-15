<template>
	<v-autocomplete
		prepend-inner-icon="mdi-magnify"
		:item-value="parseItemValue"
		:search-input.sync="query"
		@click:clear="clearItems"
		placeholder="Search..."
		:loading="loading"
		item-text="title"
		v-model="select"
		:items="items"
		append-icon=""
		hide-selected
		hide-no-data
		hide-details
		single-line
		clearable
		rounded
		dense
		solo
	>
		<template v-slot:item="data">
			<v-list-item-avatar
				max-height="55px"
				height="55px"
				tile
			>
				<img :src="data.item.img ? `https://image.tmdb.org/t/p/w500/${data.item.img}` : 'https://fakeimg.pl/134x202/303030/?retina=1&text=no image'">
			</v-list-item-avatar>
			
			<v-list-item-content>
				<v-list-item-title>
					<span v-text="data.item.title"/>
					
					<span
						v-text="`(${data.item.year})`"
						class="text--secondary"
					/>
				</v-list-item-title>
				
				<v-list-item-subtitle v-html="data.item.type"/>
			</v-list-item-content>
		</template>
	</v-autocomplete>
</template>

<script>
  import { search } from '@/api/TMDb'
  import { debounce } from 'lodash'
  
  export default {
    name: 'VSearch',
  
    data () {
      return {
        query: '',
        select: null,
        loading: false,
        items: []
      }
    },
  
    methods: {
      search: debounce(function (v) {
        this.loading = true
  
        search(v)
          .then(data => (this.items = data))
          .catch(err => (console.log(err)))
          .finally(() => (this.loading = false))
      }, 500),
  
      parseItemValue (val) {
        return {
          id: val.id,
          type: val.type
        }
      },
  
      goTo ({ id, type }) {
        this.$router.push({ name: type, params: { id } })
      },
  
      clearItems () {
        this.items = []

        this.select = null
      }
    },
  
    watch: {
      query (val) {
        val && val !== this.select && val.length > 2 && this.search(val)
      },
  
      select (val) {
        if (val) {
          this.goTo(val)
        }
      }
    }
  }
</script>

<style scoped>

</style>
