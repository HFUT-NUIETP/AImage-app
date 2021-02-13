import Vue from 'vue'
import App from './App'
import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.serverUrl = "http://tencent.terrytengli.com:8002/";

const app = new Vue({
	...App
})
app.$mount()
