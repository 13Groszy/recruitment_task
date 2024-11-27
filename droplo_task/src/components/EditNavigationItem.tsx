import React from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';

interface FormData {
  label: string;
  url?: string;
}

interface EditNavigationItemProps {
  item: FormData;
  onUpdate: (updatedItem: FormData) => void;
  onCancel: () => void;
}

const EditNavigationItem: React.FC<EditNavigationItemProps> = ({
  item,
  onUpdate,
  onCancel,
}) => {
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: item,
  });

  const onSubmit = (data: FormData) => {
    onUpdate(data);
    toast.success("Element nawigacji został zaktualizowany!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block">Nazwa</label>
        <input {...register("label")} className="border rounded p-2" />
      </div>
      <div>
        <label className="block">Link</label>
        <input {...register("url")} className="border rounded p-2" />
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Zapisz
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white p-2 rounded">
          Anuluj
        </button>
      </div>
    </form>
  );
};

export default EditNavigationItem;
