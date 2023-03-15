const getAge = (dob) => {
  const year = new Date().getFullYear();
  return year - Number(dob?.split("-")[2]);
};

module.exports = { getAge };
