<template>
	<v-overlay :value="overlay">
		<v-progress-circular
			indeterminate size="64"
			color="green"
		/>
	</v-overlay>
</template>

<script>
  import { mapState } from 'vuex'
  
  export default {
    name: 'Loader',
  
    computed: {
      ...mapState(['overlay'])
    }
  }
</script>

<style scoped>

</style>
