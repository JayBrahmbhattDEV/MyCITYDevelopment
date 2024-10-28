export const MESSAGES = {
  SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER:
    'Something went wrong! Please try again later.',
  FETHCHING_REPORTS: 'Fetching Reports',
};

export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
};

export function getLatLong(location: string): { latitude: number; longitude: number } {
  const data = JSON.parse(location);
  return {
    latitude: data.latitude,
    longitude: data.longitude
  };
}

