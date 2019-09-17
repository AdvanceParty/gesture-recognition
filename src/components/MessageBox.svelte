<script>
  export let title = "Message Box";
  export let maxDisplayCount = 5;
  export let messages = [];
  export let className = "messages";

  import { nnStatus, webcamStatus } from "../stores/prediction.js";

  let nnStatus_value;
  let webcamStatus_value;
  nnStatus.subscribe(value => (nnStatus_value = value));
  webcamStatus.subscribe(value => (webcamStatus_value = value));
</script>

<section class={className}>
  <h2>{title}</h2>
  <p>Webcam status: {webcamStatus_value}</p>
  <p>Neural Network: {nnStatus_value}</p>
  <ul>
    {#each messages.slice(-maxDisplayCount) as message}
      <li>{message}</li>
    {/each}
  </ul>
</section>
