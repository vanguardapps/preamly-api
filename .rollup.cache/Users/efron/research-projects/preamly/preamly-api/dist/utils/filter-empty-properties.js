const filterEmptyProperties = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value));
};
export default filterEmptyProperties;
//# sourceMappingURL=filter-empty-properties.js.map