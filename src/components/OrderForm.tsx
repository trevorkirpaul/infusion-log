import React from "react";
import { NumberInput, Checkbox } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import type { FactorOrder } from "@/utils/types";

interface IProps {
  handleSubmit: (event: any) => void;
  formIsLoading: boolean;
  currentValues?: FactorOrder | null;
}

export const OrderForm: React.FC<IProps> = ({
  handleSubmit,
  currentValues,
  formIsLoading,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <NumberInput
        className="mb-5"
        label="Quantity"
        placeholder="enter number of meds ordered"
        description="Quantity of medications within this order"
        id="quantity"
        name="quantity"
        withAsterisk
        radius="xs"
        size="md"
        min={1}
        defaultValue={currentValues?.quantity || ""}
      />
      <NumberInput
        className="mb-5"
        label="Doses On Hand"
        placeholder="enter number of doses currently on hand"
        description="Doses you have currently on hand"
        id="doses_on_hand"
        name="doses_on_hand"
        withAsterisk
        radius="xs"
        size="md"
        min={0}
        defaultValue={currentValues?.doses_on_hand || ""}
      />
      <DateTimePicker
        className="mb-10"
        label="Order Placed"
        description="Enter the date and time on which you placed the order. If you don't remember the exact time, you can enter the time you remember."
        id="order_placed_at"
        name="order_placed_at"
        withAsterisk
        radius="xs"
        size="md"
        defaultValue={new Date(currentValues?.order_placed_at || Date.now())}
      />
      <Checkbox
        className="mb-10"
        description="If the order has already arrived, check this box. If you are still waiting on this order to arrive then leave it unchecked."
        labelPosition="left"
        label="Order has arrived"
        defaultChecked={currentValues?.arrived || false}
        id="arrived"
        name="arrived"
        size="md"
      />
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
