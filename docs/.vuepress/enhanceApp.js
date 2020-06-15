import Vuex from 'vuex'
import store from './store'

export default ({ Vue }) => {
  Vue.use(Vuex)
  Vue.mixin({ store: store })
}
