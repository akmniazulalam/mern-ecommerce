import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";

const UpdateCategory = () => {
  const { id } = useParams();
  const [getCategoryName, setCategoryName] = useState("");
  const [getCategoryDes, setCategoryDes] = useState("");
  useEffect(() => {
    axios
      .get(
        `https://mern-ecommerce-91cv.onrender.com/api/v1/category/singlecategory/${id}`,
      )
      .then((res) => {
        setCategoryName(res.data.data.name);
        setCategoryDes(res.data.data.description);
      });
    console.log(getCategoryName);
    console.log(getCategoryDes);
  }, []);

  
  return (
    <>
      <h3 className="font-bold">Update Category</h3>
      <div className="max-w-1/3 mt-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Update Category Name</FieldLabel>
            <Input value={getCategoryName} placeholder="Update Category Name" />
          </Field>
          <Field>
            <FieldLabel>Update Category Description</FieldLabel>
            <Textarea
              value={getCategoryDes}
              placeholder="Type your description here..."
              className={"resize-none"}
            />
          </Field>
          <Field orientation="horizontal">
            <Button>Update Category</Button>
          </Field>
        </FieldGroup>
      </div>
    </>
  );
};

export default UpdateCategory;
