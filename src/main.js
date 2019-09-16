import App from './components/App.svelte';

const app = new App({
  target: document.body,
  props: {
    author: 'Advance Party',
  },
});

export default app;
