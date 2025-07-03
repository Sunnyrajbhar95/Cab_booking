import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../NECabbackend/public/image"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the file extension
  },
});

// Initialize Multer with the storage engine
export const upload = multer({ storage }).array("images", 2);




//calculate the nearby distance from user loaction to captain location
function haversine(lat1, lon1, lat2, lon2) {
  console.log(`Lat1: ${lat1}, Lon1: ${lon1}, Lat2: ${lat2}, Lon2: ${lon2}`);
  const R = 6371; // Radius of the Earth in km
  const toRadians = (degree) => degree * (Math.PI / 180);

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
}



//calculate all the  nearby captain based on the basis of current location
export const findNearbyCaptains = (source, activeCaptains, radius = 5) => {
  console.log(source, activeCaptains, "hello world");
  let nearbyCaptains = [];
  Object.keys(activeCaptains).forEach((captain_id) => {
    const { lat, lon } = activeCaptains[captain_id];
    const distance = haversine(source.lat, source.lng,lat, lon);
    console.log(distance);
    if (distance <= radius) {
      nearbyCaptains.push({
        captain_id,
        socketId: activeCaptains[captain_id].socketId,
        distance,
      });
    }
  });
  console.log(nearbyCaptains);
  return nearbyCaptains;
};
