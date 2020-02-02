<template>
	<v-dialog
		@input="emitState"
		max-width="70%"
		:value="show"
	>
		<v-card
			width="100%"
			height="100%"
		>
			<v-carousel
				delimiter-icon="mdi-minus"
				hide-delimiter-background
				@change="stopVideo"
				:continuous="true"
				v-model="carousel"
				hide-delimiters
				:cycle="false"
				height="100%"
			>
				<v-carousel-item
					v-for="(item, i) in items"
					:key="i"
				>
					<youtube
						@playing="playing(item)"
						:video-id="item.key"
						:ref="item.id"
						width="100%"
						height="500"
					/>
					<div class="pa-2 d-flex justify-space-between">
						<span>{{ item.name }}</span>
						<span>{{ i+1 }} / {{ items.length }}</span>
					</div>
				</v-carousel-item>
			</v-carousel>
		</v-card>
	</v-dialog>
</template>

<script>
  export default {
    name: 'VideosDialog',
  
    props: ['items', 'show'],
  
    data () {
      return {
        carousel: 0,
        player: null
      }
    },
  
    methods: {
      emitState (val) {
        this.$emit('show', val)
  
        this.stopVideo()
      },
  
      playing (video) {
        this.player = this.$refs[video.id][0].player
      },
  
      stopVideo () {
        if (this.player) {
          this.player.stopVideo()
        }
      }
    }
  }
</script>
