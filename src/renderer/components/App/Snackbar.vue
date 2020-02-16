<template>
	<v-snackbar
		v-model="show"
		top
		:timeout="3000"
	>
		{{message}}
	</v-snackbar>
</template>

<script>
  export default {
    name: 'Snackbar',
  
    data () {
      return {
        show: false,
        message: ''
      }
    },
  
    mounted () {
      this.$store.watch(state => state.Snackbar.snack, () => {
        const msg = this.$store.state.Snackbar.snack
  
        if (msg !== '') {
          this.show = true
  
          this.message = this.$store.state.Snackbar.snack
  
          this.$store.commit('Snackbar/setSnack', '')
        }
      })
    }
  }
</script>


