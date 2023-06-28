const addIdAndKind = (schema, kind) => {
    const previousTransform = schema.options.toJSON.transform;
    schema.options.toJSON.transform = (doc, ret) => {
        if (ret && !(ret === null || ret === void 0 ? void 0 : ret.kind)) {
            ret.kind = kind;
        }
        if (ret && !(ret === null || ret === void 0 ? void 0 : ret.id) && (ret === null || ret === void 0 ? void 0 : ret._id)) {
            ret.id = ret._id.toString();
        }
        previousTransform(doc, ret);
    };
};

export { addIdAndKind as default };
//# sourceMappingURL=add-id-and-kind.js.map
