export const MESSAGES = {
  SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_LATER:
    'Something went wrong! Please try again later.',
  FETCHING_REPORTS: 'Fetching Reports',
  LOG_OUT: 'Are you sure you want to log out?',
  GUJ_LOG_OUT: 'શું તમે ખરેખર લોગ-આઉટ કરવા માંગો છો?',
  DELETE_USER: 'Are you sure you want to delete this user? This action is irreversible.',
  GUJ_DELETE_USER: 'શું તમે ખાતરી રાખો છો કે આ વપરાશકર્તાને ડિલીટ કરવા માંગો છો?',
  USER_DELETED_SUCCESS: 'User deleted successfully'
};

export const STORAGE_KEYS = {
  USER: 'user',
  TOKEN: 'token',
  IS_ADMIN: 'isAdmin',
  ADMIN_REP_DT: 'repCt'
};

export const Categories = [
  {
    id: 1,
    text: 'Trash & Issue',
  },
  {
    id: 2,
    text: 'Health hazards',
  },
  {
    id: 3,
    text: 'Street and Park damage',
  },
  {
    id: 4,
    text: 'Vehicle/Parking',
  },
  {
    id: 5,
    text: 'Lights',
  },
  {
    id: 6,
    text: 'Trees',
  },
  {
    id: 7,
    text: 'General',
  },
];

export const SubCategories = [
  {
    parent: 1,
    sId: 1,
    text: 'Littering',
  },
  {
    parent: 1,
    sId: 2,
    text: 'Overflowing bins',
  },
  {
    parent: 1,
    sId: 3,
    text: 'Illegal dumping',
  },
  {
    parent: 1,
    sId: 4,
    text: 'Hazardous waste disposal',
  },
  {
    parent: 2,
    sId: 1,
    text: 'Pest infestations',
  },
  {
    parent: 2,
    sId: 2,
    text: 'Dead animal pickup',
  },
  {
    parent: 2,
    sId: 3,
    text: 'Contaminated water',
  },
  {
    parent: 3,
    sId: 1,
    text: 'Potholes',
  },
  {
    parent: 3,
    sId: 2,
    text: 'Broken sidewalks',
  },
  {
    parent: 3,
    sId: 3,
    text: 'Graffiti or vandalism',
  },
  {
    parent: 4,
    sId: 1,
    text: 'Illegal parking',
  },
  {
    parent: 4,
    sId: 2,
    text: 'Abandoned vehicles',
  },
  {
    parent: 4,
    sId: 3,
    text: 'Missing or damaged signage',
  },
  {
    parent: 5,
    sId: 1,
    text: 'Streetlight outages',
  },
  {
    parent: 5,
    sId: 2,
    text: 'Insufficient lighting in areas',
  },
  {
    parent: 6,
    sId: 1,
    text: 'Plant New tree',
  },
  {
    parent: 6,
    sId: 2,
    text: 'Tree removal requests',
  },
  {
    parent: 6,
    sId: 3,
    text: 'Overgrown vegetation',
  },
  {
    parent: 7,
    sId: 1,
    text: 'Noise complaints',
  },
  {
    parent: 7,
    sId: 2,
    text: 'Maintenance requests',
  },
];

export const adminObj = {
  title: 'SIDE_MENU.Admin Panel',
  url: '/admin-panel',
  icon: 'key',
  isAuthRequired: true,
  show: false,
  forAdmin: true
}

export function getLatLong(location: string): { latitude: number; longitude: number } {
  const data = JSON.parse(location);
  return {
    latitude: data.latitude,
    longitude: data.longitude
  };
}

