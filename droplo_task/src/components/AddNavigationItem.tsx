import React from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';

interface FormData {
  label: string;
  url?: string;
}

interface AddNavigationItemProps {
  onAdd: (item: FormData) => void;
}

const AddNavigationItem: React.FC<AddNavigationItemProps> = ({ onAdd }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    onAdd(data);
    toast.success("Element nawigacji został dodany!");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block">Nazwa (wymagana)</label>
        <input
          {...register("label", { required: true })}
          placeholder="np. Promocje"
          className={`border rounded p-2 ${errors.label ? "border-red-500" : ""}`}
        />
        {errors.label && <span className="text-red-500">To pole jest wymagane</span>}
      </div>
      <div>
        <label className="block">Link (opcjonalny)</label>
        <input
          {...register("url")}
          placeholder="wklej lub wyszukaj"
          className="border rounded p-2"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Dodaj Element Nawigacji
      </button>
    </form>
  );
};

export default AddNavigationItem;
