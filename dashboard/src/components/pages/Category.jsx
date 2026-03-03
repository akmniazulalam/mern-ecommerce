import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { useState } from "react";
import toast from 'react-hot-toast';

const Category = () => {
  const [categoryName, setCategoryName] = useState("")
  const [categoryDescription, setCategoryDescription] = useState("")
  const formData = {
    name: categoryName,
    description: categoryDescription
  }
  const handleCreateCategory = () => {
    axios.post("https://mern-ecommerce-91cv.onrender.com/api/v1/category/createcategory", formData)
    toast.success('Successfully added!');
    setCategoryName("")
    setCategoryDescription("")
  }
  return (
    <>
      <h3 className="font-bold">Add Category</h3>
      <div className="max-w-1/3 mt-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Category Name</FieldLabel>
            <Input value={categoryName} placeholder="Category Name" onChange={(e) => setCategoryName(e.target.value)}/>
          </Field>
          <Field>
            <FieldLabel>Category Description</FieldLabel>
            <Textarea value={categoryDescription} placeholder="Type your description here..." className={"resize-none"} onChange={(e) => setCategoryDescription(e.target.value)} />
          </Field>
          <Field orientation="horizontal">
            <Button onClick={handleCreateCategory}>Add Category</Button>
          </Field>
        </FieldGroup>
      </div>
    </>
  );
};

export default Category;
