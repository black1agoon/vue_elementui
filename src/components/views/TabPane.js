import Vue from 'vue'

export default Vue.extend({
  name: 'TabPane',
  data () {
    return {
      viewName: this.$route.name
    }
  },
  watch: {
    '$store.state.admin.tabs' () {
      if (this.viewName) {
        let found = this.$store.state.admin.tabs.find(tab => tab.name === this.viewName)
        if (!found) {
          this.$destroy(true)
        }
      }
    }
  },
  destroyed () {
    console.log('2:destroyed', this.viewName)
  }
})
