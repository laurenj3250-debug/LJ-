// Quick script to create a user directly via API
const axios = require('axios');

const BACKEND_URL = 'https://lj-production.up.railway.app'; // Replace with your actual backend URL

async function createUser() {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/register`, {
      email: 'laurenj3250@gmail.com',
      password: 'Crumpet11!!',
      name: 'Lauren'
    });

    console.log('✅ User created successfully!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
  } catch (error) {
    console.error('❌ Registration failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

createUser();
