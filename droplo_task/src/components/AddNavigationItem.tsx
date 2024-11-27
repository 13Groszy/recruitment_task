import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  label: string;
  url?: string;
  children?: FormData[];
}

interface AddNavigationItemProps {
  onAdd: (item: FormData) => void;
}

const AddNavigationItem: React.FC<AddNavigationItemProps> = ({ onAdd }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [children, setChildren] = useState<FormData[]>([]);

  const onSubmit = (data: FormData) => {
    onAdd({ ...data, children });
    setChildren([]);
  };

  const addChild = () => {
    setChildren([...children, { label: "", url: "" }]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block">Label (required)</label>
        <input
          {...register("label", { required: true })}
          className={`border rounded p-2 ${
            errors.label ? "border-red-500" : ""
          }`}
        />
        {errors.label && (
          <span className="text-red-500">This field is required</span>
        )}
      </div>
      <div>
        <label className="block">URL (optional)</label>
        <input {...register("url")} className="border rounded p-2" />
      </div>
      <div>
        <button type="button" onClick={addChild} className="text-blue-500">
          Add Sub-item
        </button>
      </div>
      {children.map((child, index) => (
        <div key={index} className="ml-4">
          <label className="block">Sub-item Label</label>
          <input
            value={child.label}
            onChange={(e) => {
              const newChildren = [...children];
              newChildren[index].label = e.target.value;
              setChildren(newChildren);
            }}
            className="border rounded p-2"
          />
        </div>
      ))}
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Navigation Item
      </button>
    </form>
  );
};

export default AddNavigationItem;