import NodeGeocoder from 'node-geocoder';
import dotenv from 'dotenv';

dotenv.config({ path: '../../config/.env' });

const options = {
  provider: process.env.GEOCODER_PROVIDER || 'mapquest',
  httpAdapter: 'https',
  // Optional depending on the providers
  apiKey: process.env.GEOCODER_API_KEY || '3z8DVqbFIVNaBp1mp1bQXIh6lVWDv1xH',
  formatter: null
};

const geocoder = NodeGeocoder(options);

export default geocoder;