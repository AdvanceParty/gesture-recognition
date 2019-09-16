<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import WebcamConnector from "../classes/WebcamConnector.js";

  const dispatch = createEventDispatcher();

  export let width = 300;
  export let height = 250;
  export let autoplay = true;
  export let audio = false;

  onMount(async () => init());

  let cam;
  let videoElement;

  const init = async () => {
    dispatch("status", "Initialising webcam.");
    cam = new WebcamConnector({
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
</script>

<video autoplay="true" bind:this={videoElement} />
