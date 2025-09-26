import axios from "axios";
import { useNavigate } from "react-router";

async function getConfig() {
    const prodUrl = "https://api.pixel.pioneers.smartrouting.com";
    const currentUrl = window.location.origin;
  
    if (currentUrl === prodUrl) {
        return {
            backendApiUrl: 'https://pixel.pioneers.smartrouting.com',
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