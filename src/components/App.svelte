<script>
  import { onMount } from "svelte";
  import MessageBox from "./MessageBox.svelte";
  import WebcamView from "./WebcamView.svelte";
  import TermTrainer from "./TermTrainer.svelte";
  import Trainer from "../classes/Trainer.js";

  let messages = [];
  let trainingWords = [];
  let trainer;
  let webcamView;

  // keras props
  trainingWords = [...trainingWords, "up"];
  trainingWords = [...trainingWords, "down"];
  trainingWords = [...trainingWords, "-"];

  const postMessage = msg => (messages = [...messages, msg]);
  const train = word => {
    trainer.addExample(webcamView.getVideoElement(), word);
  };

  const update = async () => {
    const prediction = await trainer.predictClass(webcamView.getVideoElement());
    if (prediction) {
      postMessage(`prediction: ${prediction.label}`);
    }
    requestAnimationFrame(update);
  };

  const init = async () => {
    postMessage("Initialising neural network.");
    trainer = new Trainer();
    const ready = await trainer.loadModule();
    postMessage("Neural network ready.");
    update();
  };
  onMount(() => init());
</script>

<div>
  <MessageBox title="Info" className={'msgBox'} {messages} />
  <WebcamView
    bind:this={webcamView}
    on:status={msg => postMessage(msg.detail)}
    on:error={msg => postMessage(msg.detail)} />
  <ul class="ui">
    {#each trainingWords as word, i}
      <li>
        <TermTrainer name={`Train ${word}`} on:click={() => train(i)} />
      </li>
    {/each}

  </ul>
</div>
