<template>
	<div v-if="items && items.length > 0">
		<span
			class="headline"
			v-text="title"
			v-if="title"
		/>
		
		<v-row>
			<v-col
				v-for="(item, i) in items"
				:key="i"
				cols="6"
				sm="3"
				md="2"
				lg="1"
			>
				<img-card
					:to="to(item)"
					:image="item.img"
					:text="item.title"
				/>
			</v-col>
		</v-row>
	</div>
</template>

<script>
  import ImgCard from './ImgCard'
  
  export default {
    name: 'CardsRow',
  
    components: { ImgCard },
  
    props: {
      items: {
        type: Array,
        required: true
      },
      title: {
        type: String,
        required: false
      },
      season: {
        type: Boolean,
        required: false,
        default: false
      }
    },
  
    methods: {
      to (item) {
        if (this.season) {
          return { name: 'season', params: { id: this.$store.state.Media.current.id, season: item.seasonNumber } }
        }
  
        return { name: this.$store.state.App.currentMedia, params: { id: item.id } }
      }
    }
  }
</script>

<style scoped>

</style>
