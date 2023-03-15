const getDistanceBetweenTwoPoints = (coord1, coord2) => {
  if (!coord2) return;

  if (
    coord1.latitude == coord2.latitude &&
    coord1.longitude == coord2.longitude
  ) {
    return 0;
  }

  // console.log({ co cord2 });

  const radlatitude1 = (Math.PI * coord1.latitude) / 180;
  const radlatitude2 = (Math.PI * coord2.latitude) / 180;

  const theta = coord1.longitude - coord2.longitude;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlatitude1) * Math.sin(radlatitude2) +
    Math.cos(radlatitude1) * Math.cos(radlatitude2) * Math.cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  //   dist = dist * 1.609344; //convert miles to km

  //   console.log(dist);

  return dist;
};

module.exports = { getDistanceBetweenTwoPoints };
