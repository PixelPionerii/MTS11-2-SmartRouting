import axios from "axios";

async function getConfig() {  
    if (window.location.protocol === 'https:') {
        return {
            backendApiUrl: 'https://mts11-2-smartrouting-180339305375.us-central1.run.app',
        }
    } else {
        try {
            const response = await axios.get('/config/config.json');
            const data = await response.data;
    
            if (!data?.backendApiUrl) {
            throw new Error("Missing 'backendApiUrl' in config.json");
            }
        
            return {
            backendApiUrl: data.backendApiUrl,
            };
        } catch (error) {
            console.error("Failed to load 'config.json'", error);
            throw error;
        }  
    }
}

function getToken() {
    console.log()
    try {
        const creds = JSON.parse(localStorage.getItem('creds'))
        return creds.token   
    } catch (error) {
        return ''
    }
}

const config = await getConfig();

const axiosInstance = axios.create({
  baseURL: config.backendApiUrl,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 50000,
});

export { getToken, axiosInstance }