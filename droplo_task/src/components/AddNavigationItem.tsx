import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';

interface FormData {
  label: string;
  url?: string;
  subItems?: FormData[];
}

interface AddNavigationItemProps {
  onAdd: (item: FormData, parentId?: string) => void;
  parentId?: string;
}

const AddNavigationItem: React.FC<AddNavigationItemProps> = ({ onAdd, parentId }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();
  const [subItems, setSubItems] = useState<FormData[]>([]);

  const onSubmit = (data: FormData) => {
    onAdd({ ...data, subItems }, parentId);
    toast.success("Element nawigacji został dodany!");
    reset();
    setSubItems([]);
  };

  const addSubItem = () => {
    setSubItems([...subItems, { label: "", url: "" }]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" aria-label="Add Navigation Item">
      <div>
        <label className="block" htmlFor="label">Nazwa (wymagana)</label>
        <input
          id="label"
          {...register("label", { required: true })}
          placeholder="np. Promocje"
          className={`border rounded p-2 ${errors.label ? "border-red-500" : ""}`}
          aria-required="true"
        />
        {errors.label && <span className="text-red-500" role="alert">To pole jest wymagane</span>}
      </div>
      <div>
        <label className="block" htmlFor="url">Link (opcjonalny)</label>
        <input
          id="url"
          {...register("url")}
          placeholder="wklej lub wyszukaj"
          className="border rounded p-2"
        />
      </div>
      <div>
        <h3 className="font-bold">Pod-elementy</h3>
        {subItems.map((subItem, index) => (
          <div key={index} className="flex space-x-2">
            <input
              placeholder="Nazwa pod-elementu"
              value={subItem.label}
              onChange={(e) => {
                const newSubItems = [...subItems];
                newSubItems[index].label = e.target.value;
                setSubItems(newSubItems);
              }}
              className="border rounded p-2"
            />
            <input
              placeholder="Link pod-elementu"
              value={subItem.url}
              onChange={(e) => {
                const newSubItems = [...subItems];
                newSubItems[index].url = e.target.value;
                setSubItems(newSubItems);
              }}
              className="border rounded p-2"
            />
          </div>
        ))}
        <button type="button" onClick={addSubItem} className="mt-2 bg-green-500 text-white p-2 rounded">
          Dodaj pod-element
        </button>
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Dodaj Element Nawigacji
      </button>
    </form>
  );
};

export default AddNavigationItem;
