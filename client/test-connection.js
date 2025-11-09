// Test API connection
async function testConnection() {
    try {
        const url = 'http://localhost:8000/api/auth/register/';
        console.log('Testing connection to:', url);

        const response = await fetch(url, {
            method: 'OPTIONS',
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
    } catch (error) {
        console.error('Connection test failed:', error);
    }
}

testConnection();
