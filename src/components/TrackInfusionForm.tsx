import React from "react";
import { Title, Checkbox, Autocomplete, Textarea } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";

const fieldClassName = "mb-5";

interface IProps {
  handleSubmit: (event: any) => void;
  uniqueBleedLocations: string[];
  formIsLoading: boolean;
}

export const TrackInfusionForm: React.FC<IProps> = ({
  handleSubmit,
  uniqueBleedLocations,
  formIsLoading,
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
        />
      </div>
      <div className={fieldClassName}>
        <DateTimePicker
          label="Date of Infusion"
          placeholder="Pick date and time of infusion"
          description="Enter the date and time of the infusion. If you don't remember the exact time, you can enter the time you remember."
          defaultValue={new Date()}
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
        />
      </div>

      <div className={fieldClassName}>
        <Checkbox
          description="If you were treated within 3 hours of the bleed, check this box."
          labelPosition="left"
          label="Treated Within 3 Hours"
          defaultChecked={true}
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
        {!formIsLoading ? "Submit" : "...loading"}
      </button>
    </form>
  );
};
