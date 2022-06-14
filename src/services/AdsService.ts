export const titleUpperCase = (text: string) => {
    return text
        .split(' ')
        .map((word: string) => {
            return word.toUpperCase();
        }).join(' ')
};

export const titleToString = (text: any) => {
    return text
        .split(' ')
        .map((word: any) => {
            return word.toString();
        }).join(' ')
};