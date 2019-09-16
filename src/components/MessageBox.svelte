<script>
  export let title = "Message Box";
  export let maxDisplayCount = 5;
  export let messages = [];
  export let className = "messages";
</script>

<section class={className}>
  <h2>{title}</h2>
  <ul>
    {#each messages.slice(-maxDisplayCount) as message}
      <li>{message}</li>
    {/each}
  </ul>
</section>
