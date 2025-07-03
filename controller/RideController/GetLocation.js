import axios from "axios";

export const getDistance = async (source,destination) => {
  try {
    const apiKey = process.env.MAP_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${source.lat},${source.lng}&destinations=${destination.lat},${destination.lng}&key=${apiKey}`;

    const response = await axios.get(url);
    console.log(response.data)
    if (response.data.status === "OK") {
      return {
        distance: response.data.rows[0].elements[0].distance.value,
        duration: response.data.rows[0].elements[0].duration.value,
        time:response.data.rows[0].elements[0].duration.text,
        origin: response.data.origin_addresses[0],
        destination: response.data.destination_addresses[0],
        success:true
      };
    } else {
      return {
          success:false,
          message: "Unable to fetch distance",
          error: response.data.status,
        }
    }
  } catch (err) {
    console.error("Error fetching distance:", err.message);
    return { 
        success:false,
        message: "Internal server error", error: err.message
       };
  }
};
