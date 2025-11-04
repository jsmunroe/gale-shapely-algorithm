type Random = () => number;

export const Random = {
    lcr: (seed: number | string, a = 1664525, c = 1013904233, m = Math.pow(2, 32)): Random => {
        if (typeof seed === 'string') {
            seed = stringToNumber(seed);
        }

        let current = seed;
        return () => {
            current = (a * current + c) % m;
            return current / m;
        }
    },
}

function stringToNumber(value: string): number {
    if (!value) {
        return 0;
    }
    
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        const char = value.charCodeAt(i);
        hash = ((hash << 5) - hash) + char; // Equivalent to hash * 31 + char
        hash = hash | 0; // Ensures the hash remains a 32-bit integer
    }
    return hash;
}