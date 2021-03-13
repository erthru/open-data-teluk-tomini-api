export const createSlug = (string: string): string => {
    string = string.replace(/^\s+|\s+$/g, "");
    string = string.toLowerCase();

    string = string
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

    if (string.slice(string.length - 1) === "-") {
        string = string.slice(0, -1);
    }

    return string + `-${new Date().getTime()}`;
};
