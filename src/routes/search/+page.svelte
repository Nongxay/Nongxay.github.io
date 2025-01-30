<script>
    import axios from 'axios';
    let cardNumber = '';
    let results = [];
  
    async function searchEmails() {
      try {
        const response = await axios.post('http://localhost:3000/search', { cardNumber });
        results = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  </script>
  
  <div>
    <input type="text" bind:value={cardNumber} placeholder="Enter Card Number" />
    <button on:click={searchEmails}>Search</button>
  
    {#if results.length > 0}
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Card Number</th>
          </tr>
        </thead>
        <tbody>
          {#each results as [email, card_number]}
            <tr>
              <td>{email}</td>
              <td>{card_number}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  </div>