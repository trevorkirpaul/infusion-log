import { SupabaseClient } from "@supabase/supabase-js";
import dayjs from "dayjs";

type Labels = string[];

type Return = {
  label: string;
  data: {}[];
  borderColor: string;
  backgroundColor: string;
};

interface IGetInfusionDataForChart {
  userId: string;
  supabase: SupabaseClient;
}

export const getInfusionDataForChart = async ({
  userId,
  supabase,
}: IGetInfusionDataForChart): Promise<Map<string, number>> => {
  const { data, error } = await supabase
    .from("infusion")
    .select("infusion_date")
    .eq("user_id", userId);

  if (!data || data.length === 0) {
    return new Map();
  }

  return data?.reduce((acc: any, curr: any) => {
    return acc.set(
      dayjs(curr.infusion_date).format("MMM"),
      acc.get(dayjs(curr.infusion_date).format("MMM"))
        ? acc.get(dayjs(curr.infusion_date).format("MMM")) + 1
        : 1
    );
  }, new Map());
};

export const getInfusionsByBleedLocation = async ({
  userId,
  supabase,
}: IGetInfusionDataForChart): Promise<Map<string, number>> => {
  const { data, error } = await supabase
    .from("infusion")
    .select("bleed_location")
    .eq("user_id", userId);

  const reducedData = data?.reduce((acc: any, curr: any) => {
    return acc.set(
      curr.bleed_location,
      acc.get(curr.bleed_location) ? acc.get(curr.bleed_location) + 1 : 1
    );
  }, new Map());
  return reducedData;
};
