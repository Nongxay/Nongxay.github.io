<script>
    import { createWorker } from 'tesseract.js';
    import { onMount, onDestroy } from 'svelte';
  
    let previewUrl = '';
    let extractedText = '';
    let isLoading = false;
    let ocrWorker;
    let pasteArea;
    let copySuccess = false;
  
    onMount(async () => {
        ocrWorker = await createWorker();
        await initializeWorker();
        pasteArea?.focus();
    });

    onDestroy(async () => {
        if (ocrWorker) {
            await ocrWorker.terminate();
        }
    });

    async function initializeWorker() {
        try {
            await ocrWorker.load();
            await ocrWorker.loadLanguage('eng');
            await ocrWorker.initialize('eng');
        } catch (error) {
            console.error('Error initializing worker:', error);
        }
    }
  
    async function handlePaste(event) {
        const items = event.clipboardData.items;
        let imageFile = null;
  
        for (const item of items) {
            if (item.type.indexOf('image') !== -1) {
                imageFile = item.getAsFile();
                break;
            }
        }
  
        if (imageFile) {
            previewUrl = URL.createObjectURL(imageFile);
            try {
                isLoading = true;
                if (!ocrWorker) {
                    ocrWorker = await createWorker();
                    await initializeWorker();
                }
                const { data } = await ocrWorker.recognize(imageFile);
                extractedText = data.text;
            } catch (error) {
                console.error('Error:', error);
                alert('Error converting image to text: ' + error.message);
            } finally {
                isLoading = false;
            }
        }
    }

    async function copyToClipboard() {
        console.log('Text to copy:', extractedText); // Debug line
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(extractedText);
                copySuccess = true;
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = extractedText;
                textarea.style.position = 'fixed';
                textarea.style.left = '-999999px';
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    copySuccess = true;
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                    throw new Error('Copy failed');
                } finally {
                    document.body.removeChild(textarea);
                }
            }

            setTimeout(() => {
                copySuccess = false;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
            alert('Failed to copy text to clipboard');
        }
    }
</script>
  
<div class="container">
    <h2 style="color: white;">Image to Text Converter</h2>
    
    <div 
        class="paste-area" 
        bind:this={pasteArea}
        on:paste={handlePaste}
        tabindex="0"
        role="textbox"
    >
        {#if !previewUrl}
            <div class="paste-instructions">
                <p>Press Ctrl+V to paste an image here</p>
                <span class="paste-icon">📋</span>
            </div>
        {/if}
  
        {#if previewUrl}
            <div class="preview">
                <h3>Pasted Image:</h3>
                <img src={previewUrl} alt="Pasted content" />
            </div>
        {/if}
    </div>
  
    {#if isLoading}
        <div style="color: white;" class="loading">
            Converting image to text... Please wait...
        </div>
    {/if}
  
    {#if extractedText}
        <div class="result">
            <div class="result-header">
                <h3 style="color: white;">Extracted Text:</h3>
                <button 
                    class="copy-button" 
                    on:click={copyToClipboard}
                    disabled={!extractedText}
                >
                    {copySuccess ? '✓ Copied!' : 'Copy Text'}
                </button>
            </div>
            <textarea readonly value={extractedText}></textarea>
        </div>
    {/if}
</div>
  
<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        margin-top: 150px;
    }
  
    .paste-area {
        min-height: 200px;
        border: 2px dashed #ccc;
        border-radius: 8px;
        margin: 20px 0;
        padding: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f9f9f9;
        outline: none;
    }
  
    .paste-area:focus {
        border-color: #4CAF50;
        background-color: #f0f0f0;
    }
  
    .paste-instructions {
        text-align: center;
        color: #666;
    }
  
    .paste-icon {
        font-size: 2em;
        display: block;
        margin-top: 10px;
    }
  
    .preview {
        width: 100%;
    }
  
    .preview img {
        max-width: 100%;
        max-height: 400px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-top: 10px;
    }
  
    .loading {
        color: #666;
        margin: 20px 0;
        text-align: center;
    }
  
    .result {
        margin-top: 20px;
    }

    .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
  
    .result textarea {
        width: 100%;
        min-height: 200px;
        padding: 10px;
        margin-top: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        resize: vertical;
    }
  
    h2 {
        text-align: center;
        color: #333;
    }
  
    h3 {
        color: #444;
        margin-bottom: 10px;
    }

    .copy-button {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s, opacity 0.3s;
    }

    .copy-button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }

    .copy-button:hover:not(:disabled) {
        background-color: #45a049;
    }

    .copy-button:active:not(:disabled) {
        background-color: #3d8b40;
    }
    :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    }

    /* a {
    font-weight: 500;
    color: #646cff;
    text-decoration: inherit;
    }
    a:hover {
    color: #535bf2;
    }

    body {
    margin: 0;
    display: flex;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
    background: #333;
    } */

    /* h1 {
    font-size: 3.2em;
    line-height: 1.1;
    }

    .card {
    padding: 2em;
    } */

    /* #app {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
    } */

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

    @media (prefers-color-scheme: light) {
    :root {
        color: #213547;
        background-color: #ffffff;
    }
    /* a:hover {
        color: #747bff;
    } */
    button {
        background-color: #f9f9f9;
    }
    }
</style>