<script>
  import { onMount } from "svelte";
  import MessageBox from "./MessageBox.svelte";
  import WebcamView from "./WebcamView.svelte";
  import TermTrainer from "./TermTrainer.svelte";
  import Trainer from "../classes/Trainer.js";

  import { labels } from "../stores/demoContent.js";
  import {
    confidences,
    label,
    nnStatus,
    webcamStatus
  } from "../stores/prediction.js";

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
    // label.set(prediction.label);
    // confidences.set(prediction.confidences);
    try {
      postMessage(`prediction: ${trainingLabels.get(prediction.label)}`);
    } catch (e) {
      // no prediction available
    } finally {
      requestAnimationFrame(update);
    }
  };

  const init = async () => {
    nnStatus.set("Initialising.");

    labels.forEach(label => addTrainingLabel(label));
    await trainer.loadModule();

    nnStatus.set("Ready.");
    update();
  };

  onMount(() => init());
</script>

<div>
  <MessageBox title="Info" className={'msgBox'} {messages} />
  <WebcamView
    bind:this={webcamView}
    on:status={msg => webcamStatus.set(msg.detail)}
    on:error={msg => webcamStatus.set('Error')} />
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
