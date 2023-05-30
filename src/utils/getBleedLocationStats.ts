import { PostgrestError } from "@supabase/supabase-js";

interface IGetBleedLocationStats {
  allBleedLocations: Array<{ bleed_location: string }> | null;
  errorFromSB: PostgrestError | null;
}

/**
 * returns a unique array of strings, sorted, trimmed, and lowercased
 * if an error is detected, we fail silently and return an empty array
 */
export const getBleedLocationStats = (x: IGetBleedLocationStats) => {
  try {
    const { allBleedLocations, errorFromSB } = x;
    if (errorFromSB || !allBleedLocations || allBleedLocations.length === 0) {
      return null;
    }
    const uniqueBleedLocations = new Set(
      allBleedLocations.map((x) => x.bleed_location.trim().toLowerCase())
    );
    return Array.from(uniqueBleedLocations)
      .sort()
      .reduce((acc, curr) => {
        const count = allBleedLocations.filter(
          (x) => x.bleed_location.trim().toLowerCase() === curr
        ).length;
        return { ...acc, [curr]: count };
      }, {});
  } catch (e) {
    return null;
  }
};
