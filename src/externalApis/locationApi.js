
import jwtServiceConfig from "../auth/services/jwtService/jwtServiceConfig";
import axios from "axios";

const updateLocation = async (longitude, latitude) => {
    try {
        const body = { latitude, longitude };
        const response = await axios.post(jwtServiceConfig.updateLocation, body);
        // console.log(response.data);
        if (response?.status === 200 && response?.data) {
            // console.log("Location Updated:", response.data);
            return response.data;
        } 
        return false;

    } catch (e) {
        // console.log("Error updating location:", e.response?.data || e.message);
        return false;
    }
}

const getLocation = async (driver_id) => {
    try {
        const url = `${jwtServiceConfig.getLocation}?driver_id=${driver_id}`;
        const response = await axios.get(url);
        // console.log(response.data);
        if (response?.status === 200 && response?.data) {
            // console.log("Driver Location:", response.data);
            return response.data;
        }
        return false;
    } catch (e) {
        // console.log("Error getting location:", e.response?.data || e.message);
        return false;
    }
}

export { updateLocation, getLocation }