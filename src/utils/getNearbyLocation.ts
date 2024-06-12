import axios from 'axios';

interface Location {
  name: string;
  lat: string;
  lng: string;
  region?: string;
}

interface GeoNamesResponse {
  geonames: { name: string, lat: string, lng: string, adminName1: string }[];
}

const GEO_NAMES_USERNAME = 'tonybn';

async function getLocationInfo(cityOrVillage: string): Promise<Location | null> {
  try {
    const response = await axios.get<GeoNamesResponse>('http://api.geonames.org/searchJSON', {
      params: {
        q: cityOrVillage,
        maxRows: 1,
        username: GEO_NAMES_USERNAME
      }
    });

    const locationData = response.data.geonames[0];
    if (locationData) {
      return {
        name: locationData.name,
        lat: locationData.lat,
        lng: locationData.lng,
        region: locationData.adminName1
      };
    }
    return null;
  } catch (error) {
    console.error(`Erreur lors de la récupération des informations pour ${cityOrVillage}:`, error);
    return null;
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getNearbyLocations(cityOrVillage: string): Promise<string[]> {
  const location = await getLocationInfo(cityOrVillage);
  if (!location) {
    throw new Error(`La ville ou le village "${cityOrVillage}" n'a pas été trouvé.`);
  }

  try {
    const response = await axios.get<GeoNamesResponse>('http://api.geonames.org/searchJSON', {
      params: {
        adminName1: location.region,
        country: 'FR',
        maxRows: 1000,
        username: GEO_NAMES_USERNAME
      }
    });
    const distances = response.data.geonames.map(loc => ({
      name: loc.name,
      distance: calculateDistance(
        parseFloat(location.lat),
        parseFloat(location.lng),
        parseFloat(loc.lat),
        parseFloat(loc.lng)
      )
    }));

    const sortedLocations = distances.sort((a, b) => a.distance - b.distance);
    const nearestLocations = sortedLocations.slice(0, 50);

    return nearestLocations.map(loc => loc.name);
  } catch (error) {
    console.error(`Erreur lors de la récupération des villes ou villages proches de ${cityOrVillage}:`, error);
    return [];
  }
}