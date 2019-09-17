<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import WebcamConnector from "../classes/WebcamConnector.js";
  import { STATUS_LEVELS } from "../constants.js";

  export let width = 300;
  export let height = 250;
  export let autoplay = true;
  export let audio = false;

  export const getVideoElement = () => {
    return videoElement;
  };

  let videoElement;
  const dispatch = createEventDispatcher();
  const init = async () => {
    dispatch("status", STATUS_LEVELS.INITIALISING);
    const cam = new WebcamConnector({
      videoElement,
      width,
      height,
      audio
    });
    try {
      await cam.start();
      dispatch("status", STATUS_LEVELS.CONNECTED);
    } catch (e) {
      dispatch("error", STATUS_LEVELS.ERROR);
    }
  };

  onMount(() => init());
</script>

<video class="webcam-view" autoplay="true" bind:this={videoElement} />
