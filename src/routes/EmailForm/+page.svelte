<script>
    import { onMount } from 'svelte';
    import axios from 'axios';
  
    let subject = '';
    let content = '';
    let file = null;
    let emails = [];
  
    onMount(() => {
      // Fetch emails from the previous search or a predefined list
      emails = ['example1@example.com', 'example2@example.com']; // Replace with actual data
    });
  
    async function sendEmail() {
      const formData = new FormData();
      formData.append('subject', subject);
      formData.append('content', content);
      formData.append('file', file);
      formData.append('emails', JSON.stringify(emails));
  
      try {
        await axios.post('http://localhost:3000/send-email', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert('Emails sent successfully!');
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }
  </script>
  
  <div class="maincontent">
    <div class="form">
        <h2>Send Email</h2>
        <input type="text" bind:value={subject} placeholder="Subject" />
        <textarea bind:value={content} placeholder="Content"></textarea>
        <input type="file" on:change={(e) => file = e.target.files[0]} />
        <button on:click={sendEmail}>Send Email</button>
    </div>
  </div>