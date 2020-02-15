<template>
	<v-hover
		v-slot:default="{ hover }"
		close-delay="100"
		open-delay="100"
	>
		<v-card :class="{ 'on-hover': hover }">
			<v-img
				height="100%"
				:src="img"
			/>
			
			<v-fade-transition>
				<v-overlay
					color="secondary"
					v-if="hover"
					absolute
				>
					<div class="d-flex flex-column align-center">
						<div
							class="text-center font-weight-medium"
							v-text="text"
							v-if="text"
						/>
						
						<div class="d-flex flex-row align-center">
							<v-btn
								color="white"
								:class="year ? 'mr-2' : ''"
								:to="to"
								small
								text
								icon
							>
								<v-icon dark>mdi-eye</v-icon>
							</v-btn>
							
							<span class="caption" v-if="year" v-text="year" />
						</div>
					</div>
				</v-overlay>
			</v-fade-transition>
		</v-card>
	</v-hover>
</template>

<script>
  export default {
    name: 'ImgCard',
  
    props: {
      image: {
        type: String,
        required: false
      },
  
      text: {
        type: String,
        required: false
      },
  
      year: {
        type: String,
        required: false
      },
  
      to: {
        required: false,
        default: null
      }
    },
  
    computed: {
      img () {
        if (this.image) {
          return `https://image.tmdb.org/t/p/w500/${this.image}`
        }
  
        return 'https://fakeimg.pl/134x202/303030/?retina=1&text=no image'
      }
    }
  }
</script>
