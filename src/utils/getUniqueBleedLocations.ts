import { PostgrestError } from "@supabase/supabase-js";

interface IGetUniqueBleedLocations {
  allBleedLocations: Array<{ bleed_location: string }> | null;
  errorFromSB: PostgrestError | null;
}

/**
 * returns a unique array of strings, sorted, trimmed, and lowercased
 * if an error is detected, we fail silently and return an empty array
 */
export const getUniqueBleedLocations = (x: IGetUniqueBleedLocations) => {
  try {
    const { allBleedLocations, errorFromSB } = x;
    if (errorFromSB || !allBleedLocations) {
      return [];
    }
    const uniqueBleedLocations = new Set(
      allBleedLocations.map((x) => x.bleed_location.trim().toLowerCase())
    );
    return Array.from(uniqueBleedLocations).sort();
  } catch (e) {
    return [];
  }
};
