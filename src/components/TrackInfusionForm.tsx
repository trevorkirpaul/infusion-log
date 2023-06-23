import React from "react";
import { Checkbox, Autocomplete, Textarea } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { Infusion } from "@/utils/types";

const fieldClassName = "mb-5";

interface IProps {
  handleSubmit: (event: any) => void;
  uniqueBleedLocations: string[];
  formIsLoading: boolean;
  currentValues?: Infusion | null;
}

export const TrackInfusionForm: React.FC<IProps> = ({
  handleSubmit,
  uniqueBleedLocations,
  formIsLoading,
  currentValues,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className={fieldClassName}>
        <Autocomplete
          data={uniqueBleedLocations}
          description="Enter the location of the bleed. You can also add a new location by typing it in. If there are multiple locations, enter the other locations in the notes field."
          placeholder="enter location of bleed"
          label="Bleed Location"
          radius="xs"
          size="md"
          withAsterisk
          id="bleed_location"
          name="bleed_location"
          defaultValue={currentValues?.bleed_location || ""}
        />
      </div>
      <div className={fieldClassName}>
        <DateTimePicker
          label="Date of Infusion"
          placeholder="Pick date and time of infusion"
          description="Enter the date and time of the infusion. If you don't remember the exact time, you can enter the time you remember."
          defaultValue={new Date(currentValues?.infusion_date || Date.now())}
          id="infusion_date"
          name="infusion_date"
          withAsterisk
          radius="xs"
          size="md"
        />
      </div>

      <div className={fieldClassName}>
        <Textarea
          label="Notes"
          description="Enter any notes about the infusion. For example, if you had multiple bleeds, you can enter the other locations here."
          placeholder="Enter notes about the infusion"
          id="notes"
          name="notes"
          radius="xs"
          size="md"
          defaultValue={currentValues?.notes || ""}
        />
      </div>

      <div className={fieldClassName}>
        <Checkbox
          description="If you were treated within 3 hours of the bleed, check this box."
          labelPosition="left"
          label="Treated Within 3 Hours"
          defaultChecked={currentValues?.treated_within || true}
          id="treated_within"
          name="treated_within"
          size="md"
        />
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        type="submit"
        disabled={formIsLoading}
      >
        {getButtonLabel({ formIsLoading, currentValues })}
      </button>
    </form>
  );
};

const getButtonLabel = ({
  formIsLoading,
  currentValues,
}: Pick<IProps, "formIsLoading" | "currentValues">) => {
  if (formIsLoading) {
    return "loading";
  }
  if (currentValues) {
    return "Update Infusion";
  }
  return "Submit";
};
