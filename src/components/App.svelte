<script>
  import { onMount } from "svelte";
  import MessageBox from "./MessageBox.svelte";
  import WebcamView from "./WebcamView.svelte";
  import TermTrainer from "./TermTrainer.svelte";
  import Trainer from "../classes/Trainer.js";
  import { STATUS_LEVELS } from "../constants.js";

  import { labels } from "../stores/demoContent.js";
  import { status, messages, STATUS_MONITORS } from "../stores/store.js";

  let webcamView;
  let trainingLabels = new Map();
  const trainer = new Trainer();

  const train = word => {
    trainer.addExample(webcamView.getVideoElement(), word);
  };

  const postMessage = msg => {
    messages.update(obj => {
      obj.push(msg);
      return obj;
    });
  };

  const postStatus = (type, value) => {
    status.update(obj => {
      obj[type] = value;
      return obj;
    });
  };

  const addTrainingLabel = label => {
    const entry = [`id${trainingLabels.size}`, label];
    trainingLabels = new Map([...trainingLabels, entry]);
  };

  const draw = async () => {
    const prediction = await trainer.predictClass(webcamView.getVideoElement());
    requestAnimationFrame(draw);
  };

  const init = async () => {
    postMessage("Getting ready");
    postStatus(STATUS_MONITORS.WEBCAM, STATUS_LEVELS.INITIALISING);
    postStatus(STATUS_MONITORS.KERAS, STATUS_LEVELS.INITIALISING);

    labels.forEach(label => addTrainingLabel(label));
    postMessage("Reversing Polarity");
    await trainer.loadModule();
    postStatus(STATUS_MONITORS.KERAS, STATUS_LEVELS.READY);
    postMessage("Rebooting Flux Capacitor");
    draw();
  };

  onMount(() => init());
</script>

<WebcamView
  bind:this={webcamView}
  on:status={status => postStatus(STATUS_MONITORS.WEBCAM, status.detail)}
  on:error={msg => postStatus(STATUS_MONITORS.WEBCAM, STATUS_LEVELS.ERROR)} />
<ul class="ui">
  {#each [...trainingLabels.keys()] as key}
    <li>
      <TermTrainer
        name={`Train ${trainingLabels.get(key)}`}
        on:click={() => train(key)} />
    </li>
  {/each}
</ul>
<MessageBox title="System Information" className={'msgBox'} />
