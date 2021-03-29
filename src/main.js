import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
import manifest from "./manifest.json"
Vue.use(uView);

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.version = manifest.versionName

const app = new Vue({
	...App
})
app.$mount()