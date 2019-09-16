<script>
  import MessageBox from "./MessageBox.svelte";
  import WebcamView from "./WebcamView.svelte";

  let messages = [];
  const camOptions = {};
  const postMessage = msg => {
    console.log(msg);
    messages = [...messages, msg];
  };
</script>

<div>
  <MessageBox title="Info" className={'msgBox'} {messages} />
  <WebcamView
    on:status={msg => postMessage(msg.detail)}
    on:error={msg => postMessage(msg.detail)} />
</div>
