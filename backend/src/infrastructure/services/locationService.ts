import axios from "axios";

export class LocationService {
    private apiKey: string | null;

    constructor(apiKey: string) {
        this.apiKey = 'pk.eyJ1IjoiYXNoaW5qb3kiLCJhIjoiY2x6aWE4YnNkMDY0ejJxcjBlZmpid2VoYyJ9.Etsb6UwNacChll6vPVQ_1g';
    }

    async getCoordinatesFromAddress(addressData: any): Promise<{ lat: number, lng: number }> {
        const { housename, place, city, state, pincode } = addressData;
        const address = `${housename}, ${place}, ${city}, ${state}, ${pincode}`;
        console.log(address,"address in  location");
        

        // Mapbox API endpoint
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json`, {
            params: {
                access_token: this.apiKey, // Use the Mapbox API key
                limit: 1, // Limit results to 1
            }
        });

        console.log(response.data.features, "response from Mapbox API");

        const { features } = response.data;
        if (features && features.length > 0) {
            const coordinates = features[0].geometry.coordinates;
            return {
                lng: coordinates[0], // Longitude
                lat: coordinates[1]  // Latitude
            };
        } else {
            throw new Error("Unable to fetch coordinates from the address");
        }
    }
}
