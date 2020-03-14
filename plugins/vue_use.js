import Vue from 'vue';
import lazyload from './v_lazyload';
import mavonEditor from 'mavon-editor';
import SSREditor from '../components/public/SSREditor';
Vue.component('ssr-editor',SSREditor);
Vue.use(mavonEditor);
Vue.use(lazyload);
