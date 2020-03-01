<template>
	<v-snackbar
		:timeout="3000"
		v-model="show"
		:color="color"
		top
	>
		{{ message }}
	</v-snackbar>
</template>

<script>
  export default {
    name: 'Snackbar',
  
    data () {
      return {
        show: false,
        message: '',
        color: ''
      }
    },
  
    mounted () {
      this.$store.watch(state => state.Snackbar.snack, () => {
        const msg = this.$store.state.Snackbar.snack
  
        if (msg !== '') {
          this.show = true
  
          this.message = msg
  
          this.color = this.$store.state.Snackbar.color
  
          this.$store.commit('Snackbar/setSnack', { snack: '', color: 'success' })
        }
      })
    }
  }
</script>


