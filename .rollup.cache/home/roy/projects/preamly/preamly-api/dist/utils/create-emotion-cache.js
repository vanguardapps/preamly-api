import createCache from "@emotion/cache";
export default function createEmotionCache() {
    return createCache({ key: "css", prepend: true });
}
//# sourceMappingURL=create-emotion-cache.js.map