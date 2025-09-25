import axios from "axios";

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

const config = await getConfig();

const axiosInstance = axios.create({
  baseURL: config.backendApiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 50000,
});

export default axiosInstance;