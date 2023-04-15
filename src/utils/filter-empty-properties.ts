const filterEmptyProperties = (obj: Object): Object => {
  return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value));
};

export default filterEmptyProperties;
