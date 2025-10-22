// Test simple de l'API
const testAPI = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/trends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: 'fitness'
      })
    });
    
    const data = await response.json();
    console.log('✅ API Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ API Error:', error.message);
  }
};

testAPI();
