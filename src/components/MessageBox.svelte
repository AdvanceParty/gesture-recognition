<script>
  export let title = "Message Box";
  export let maxDisplayCount = 5;
  export let className = "messages";

  import { status, messages, prediction } from "../stores/store.js";

  let status_value;
  let messages_value;
  let prediction_value;

  status.subscribe(value => (status_value = value));
  messages.subscribe(value => (messages_value = value));
  prediction.subscribe(value => (prediction_value = value));
</script>

<style>
  .MessageBox {
    --col-bg: var(--col-box, #dedede);
    --success: var(--col-success, green);
    --notice: var(--col-notice, orange);
    --error: var(--col-error, red);
    --col-status-border: rgba(0, 0, 0, 0.3);

    display: grid;
    padding: 0;
    grid-template-areas:
      "title title"
      "status msg";
    grid-template-columns: 1fr 1fr;

    background-color: var(--col-bg);
  }

  header {
    padding: 1rem;
    grid-area: title;
    border-top: solid 1px #222222;
    border-bottom: solid 1px #222222;
  }

  h1 {
    margin: 0;
    font-size: 1.3em;
    text-transform: uppercase;
    text-align: center;
  }

  h2 {
    font-size: 1.1em;
  }

  section {
    padding: 1rem;
  }

  ul,
  li {
    padding: 0;
    list-style: none;
  }

  li {
    padding-left: 0.5em;
  }

  li:before {
    content: "💬 ";
  }

  .statuses {
    grid-area: status;
    border-right: solid 1px #222222;
    background-color: rgba(0, 0, 0, 0.15);
  }

  .statuses p {
    border: 1px solid rgba(0, 0, 0, 0.5);
    padding: 0.5em 1em;
    background-color: var(--col-bg);
    mix-blend-mode: hard-light;
    text-transform: capitalize;
    transition: background-color 500ms;
  }

  .statuses .ready,
  .statuses .connected,
  .statuses .loaded {
    background-color: var(--success);
  }

  .statuses .idle,
  .statuses .waiting,
  .statuses .initialising,
  .statuses .connecting,
  .statuses .loading {
    background-color: var(--notice);
  }

  .statuses .error {
    background-color: var(--error);
  }

  .messages {
    grid-area: msg;
    background-color: rgba(0, 0, 0, 0.1);
  }
</style>

<section class={`MessageBox ${className}`}>
  <header>
    <h1>{title}</h1>
  </header>
  <section class="statuses">
    <p class={status_value.webcam}>Webcam: {status_value.webcam}</p>
    <p class={status_value.kerasModule}>
      Neural Network: {status_value.kerasModule}
    </p>
    <p>Prediction: {prediction_value.label}</p>
  </section>
  <section class="messages">
    <h2>Messages</h2>
    <ul>
      {#each messages_value.slice(-maxDisplayCount) as message}
        <li>{message}</li>
      {/each}
    </ul>
  </section>
</section>
