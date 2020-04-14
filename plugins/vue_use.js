import Vue from 'vue';
import lazyload from './v_lazyload';
import mavonEditor from 'mavon-editor';
import SSREditor from '../components/public/SSREditor';
import Waiting from '../components/public/Waiting';
Vue.component('waiting',Waiting);
Vue.component('ssr-editor',SSREditor);
Vue.use(mavonEditor);
Vue.use(lazyload);
