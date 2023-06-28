const filterEmptyProperties = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, value]) => value));
};

export { filterEmptyProperties as default };
//# sourceMappingURL=filter-empty-properties.js.map
