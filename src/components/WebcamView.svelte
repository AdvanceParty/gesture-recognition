<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import WebcamConnector from "../classes/WebcamConnector.js";

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
    dispatch("status", "Initialising webcam.");
    const cam = new WebcamConnector({
      videoElement,
      width,
      height,
      audio
    });
    try {
      await cam.start();
      dispatch("status", "Webcam connected.");
    } catch (e) {
      dispatch("error", e.message);
    }
  };

  onMount(() => init());
</script>

<video autoplay="true" bind:this={videoElement} />
