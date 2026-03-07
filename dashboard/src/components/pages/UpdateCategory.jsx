import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateCategory = () => {
  const { id } = useParams();
  const [updateName, setUpdateName] = useState("")
  const [updateDes, setUpdateDes] = useState("")
  useEffect(() => {
    axios
      .get(
        `https://mern-ecommerce-91cv.onrender.com/api/v1/category/singlecategory/${id}`
      )
      .then((res) => {
        setUpdateName(res.data.data.name);
        setUpdateDes(res.data.data.description);
      });
  }, []);

  const handleUpdateCategory = () => {
    const formData = {
      name: updateName,
      description: updateDes
    }
    axios.patch(`https://mern-ecommerce-91cv.onrender.com/api/v1/category/updatecategory/${id}`, formData)
    toast.success("Successfully Updated")
    setUpdateName("")
    setUpdateDes("")
  }

  return (
    <>
      <h3 className="font-bold">Update Category</h3>
      <div className="max-w-1/3 mt-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Update Category Name</FieldLabel>
            <Input value={updateName} placeholder="Update Category Name" onChange={(e)=> setUpdateName(e.target.value)} />
          </Field>
          <Field>
            <FieldLabel>Update Category Description</FieldLabel>
            <Textarea
              value={updateDes}
              placeholder="Type your description here..."
              className={"resize-none"}
              onChange={(e)=> setUpdateDes(e.target.value)}
            />
          </Field>
          <Field orientation="horizontal">
            <Button onClick={handleUpdateCategory} className={"cursor-pointer"}>Update Category</Button>
          </Field>
        </FieldGroup>
      </div>
    </>
  );
};

export default UpdateCategory;
