// eslint-disable-next-line arrow-body-style
const asyncWrapper = (controller) => {
  return (req, res, next) => controller(req, res, next).catch(next);
};

const getTruckPayload = (type) => {
  if (type === 'SPRINTER') {
    return 1700;
  }
  if (type === 'SMALL STRAIGHT') {
    return 2500;
  }
  if (type === 'LARGE STRAIGHT') {
    return 4000;
  }
  return undefined;
};

const getTruckDimansions = (type) => {
  if (type === 'SPRINTER') {
    return {
      width: 300,
      length: 250,
      height: 170,
    };
  }
  if (type === 'SMALL STRAIGHT') {
    return {
      width: 500,
      length: 250,
      height: 170,
    };
  }
  if (type === 'LARGE STRAIGHT') {
    return {
      width: 700,
      length: 350,
      height: 200,
    };
  }
  return undefined;
};

module.exports = { asyncWrapper, getTruckPayload, getTruckDimansions };
