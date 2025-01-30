<script>
  import { onMount } from "svelte";

  let inputText = "";
  let formattedText = "";

  function formatText() {
    formattedText = inputText.replace(/\|/g, "\n");
    inputText = "";
  }

  function copyToClipboard() {
    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(formattedText).then(showNotification);
    } else {
      // Fallback for non-secure contexts
      const textArea = document.createElement("textarea");
      textArea.value = formattedText;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        textArea.remove();
        showNotification();
      } catch (err) {
        console.error("Failed to copy text:", err);
        textArea.remove();
      }
    }
  }

  function showNotification() {
    const notification = document.createElement("div");
    notification.textContent = "Text copied to clipboard!";
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.left = "50%";
    notification.style.transform = "translateX(-50%)";
    notification.style.backgroundColor = "#333";
    notification.style.color = "#fff";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "5px";
    notification.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.3)";
    notification.style.zIndex = "1000";
    notification.style.textAlign = "center";
    notification.style.fontSize = "14px";
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
</script>

<div class="container">
  <h2 style="color: white; margin-bottom: 20px; font-size: 20px;">
    Text Formatter
  </h2>

  <textarea
    style="padding: 10px; "
    class="textarea"
    bind:value={inputText}
    placeholder="Paste your text here..."
  ></textarea>

  <button class="button" on:click={formatText}>Format Text</button>
  <hr style="margin: 10px 10px;" />
  {#if formattedText}
    <div>
      <h3 style="color: white; font-size: 20px; margin-bottom: 20px;">
        Formatted Text
      </h3>
      <div class="formatted">{formattedText}</div>
      <button class="button" on:click={copyToClipboard}
        >Copy to Clipboard</button
      >
    </div>
  {/if}
</div>

<style>
  .container {
    width: 80%; /* Adjust width as needed */
    max-width: 800px; /* Prevents it from being too wide */
    margin: 0 auto; /* Centers the container */
    padding: 20px; /* Adds space inside the container */
    /* background-color: #f8f9fa; Light background */
    border-radius: 8px; /* Rounded corners */
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Soft shadow */
    text-align: center;
    margin-top: 100px;
  }
  .textarea {
    margin-bottom: 10px;
    width: 100%;
    height: 150px;
    border-radius: 10px;
  }
  .button {
    margin-bottom: 10px;
  }
  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
  }
  button:hover {
    border-color: #646cff;
  }
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
  .formatted {
    border: 1px solid #ccc;
    padding: 10px;
    white-space: pre-wrap;
    margin-bottom: 10px;
    background: #ccc;
    width: 100%;
    height: 150px;
    color: #1a1a1a;
    border-radius: 10px;
  }
</style>
