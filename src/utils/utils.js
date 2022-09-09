import { data } from './constants';
const haversine = require('haversine');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const findCityByName = (city) => {
  const found = data.find(c => c[0] === city);

  if (found) {
    return {
      name: found[0],
      lat: found[1],
      long: found[2],
    };
  }

  return undefined;
}

export const mockFetchDataApiCall = async (term) => {
  return new Promise(async (resolve, reject) => {
    // simulate request delay
    await sleep(700);

    if (!term) {
      reject({ status: 400, message: 'Term is missing' });
    }
    if (term.toLowerCase() === 'fail') {
      reject({ status: 500, message: 'Something went wrong' });
    }

    if (term === '') {
      reject({ status: 400, message: 'Bad Request' });
    }

    const filteredData = data.filter(city => city[0].toLowerCase().includes(term.toLowerCase()));

    resolve({
      status: 200,
      data: filteredData,
    });
  });
};

export const mockCalculateDistancesApiCall = async (values) => {
  return new Promise(async (resolve, reject) => {
    // simulate request delay
    await sleep(2000);

    const cityOfOrigin = findCityByName(values.cityOfOrigin);
    const cityOfDestination = findCityByName(values.cityOfDestination);
    let intermediateCities;
    let totalDistanceCount = 0;
    const subsequentDistances = [];


    const hasIntermediateCities = values.intermediateCities && values.intermediateCities.length > 0;
    if (hasIntermediateCities) {
      intermediateCities = values.intermediateCities.map(cityName => {
        return findCityByName(cityName);
      });
    }

    if (!hasIntermediateCities) {
      totalDistanceCount = calculateDistance(cityOfOrigin.name, cityOfDestination.name);
    } else {
      // first
      const _calcFirst = calculateDistance(cityOfOrigin.name, intermediateCities[0].name);
      totalDistanceCount += _calcFirst;
      subsequentDistances.push({
        from: cityOfOrigin.name,
        to: intermediateCities[0].name,
        distance: _calcFirst,
      })

      if (intermediateCities.length >= 2) {
        for (let i=1; i < intermediateCities.length; i++) {
          const _calcMid = calculateDistance(cityOfDestination.name, intermediateCities[0].name);
          totalDistanceCount += _calcMid;
          subsequentDistances.push({
            from: intermediateCities[i - 1].name,
            to: intermediateCities[i].name,
            distance: _calcMid,
          })
        }
      }


      // last
      if (intermediateCities.length > 1) {
        const _calcLast = calculateDistance(cityOfDestination.name, intermediateCities[0].name);
        const lastIndex = intermediateCities.length - 1;
        totalDistanceCount += _calcLast;
        subsequentDistances.push({
          from: intermediateCities[lastIndex].name,
          to: cityOfDestination.name,
          distance: _calcLast,
        })
      }
    }

    let results = {
      hasIntermediateCities,
      totalDistance: totalDistanceCount,
      subsequentDistances,
    };

    // Mock server error
    if ([
      values.cityOfOrigin.toLowerCase(),
      values.cityOfDestination.toLowerCase(),
      ...values.intermediateCities.map(city => city.toLowerCase()),
    ].includes('dijon')) {
      reject({ status: 400, message: 'Could not perform calculation' });
    }

    resolve({
      status: 200,
      data: results,
    });
  });
};


export const calculateDistance = (startCity, endCity) => {
  const sCity = findCityByName(startCity);
  const eCity = findCityByName(endCity);
  const start = {
    latitude: sCity.lat,
    longitude: sCity.long
  }

  const end = {
    latitude: eCity.lat,
    longitude: eCity.long
  }

  return haversine(start, end, {unit: 'km'});
};

// Input validations
export const required = value => (value ? undefined : 'This is a required field');
export const validatePassengersCount = value => {
  if (isNaN(value) || value <= 0 || !(value % 1 === 0)) {
    return 'Please provide a valid number';
  }
};
