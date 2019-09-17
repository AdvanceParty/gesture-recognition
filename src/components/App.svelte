<script>
  import { onMount } from "svelte";
  import MessageBox from "./MessageBox.svelte";
  import WebcamView from "./WebcamView.svelte";
  import TermTrainer from "./TermTrainer.svelte";
  import Trainer from "../classes/Trainer.js";

  import { labels } from "../stores/demoContent.js";

  let webcamView;
  let status;
  let messages = [];
  let trainingLabels = new Map();
  const trainer = new Trainer();

  const postMessage = msg => (messages = [...messages, msg]);
  const postStatus = str => (status = `Status: ${str}`);
  const train = word => {
    trainer.addExample(webcamView.getVideoElement(), word);
  };

  const addTrainingLabel = label => {
    // need to generate a new Map() each time to trigger Svelte's reactive binding
    const entry = [`id${trainingLabels.size}`, label];
    trainingLabels = new Map([...trainingLabels, entry]);
  };

  const update = async () => {
    const prediction = await trainer.predictClass(webcamView.getVideoElement());
    try {
      const { labelId, confidences } = prediction;
      postMessage(`prediction: ${trainingLabels.get(labelId)}`);
    } catch (e) {
      // no prediction available
    } finally {
      requestAnimationFrame(update);
    }
  };

  const init = async () => {
    postMessage("Initialising neural network.");
    postStatus("Initialising");

    labels.forEach(label => addTrainingLabel(label));
    await trainer.loadModule();

    postMessage("Neural network ready.");
    postStatus("Ready");
    update();
  };

  onMount(() => init());
</script>

<div>
  <MessageBox title="Info" className={'msgBox'} {messages} {status} />
  <WebcamView
    bind:this={webcamView}
    on:status={msg => postMessage(msg.detail)}
    on:error={msg => postMessage(msg.detail)} />
  <ul class="ui">
    {#each [...trainingLabels.keys()] as key}
      <li>
        <TermTrainer
          name={`Train ${trainingLabels.get(key)}`}
          on:click={() => train(key)} />
      </li>
    {/each}

  </ul>
</div>
