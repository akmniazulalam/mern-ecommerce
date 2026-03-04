import React from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const UpdateCategory = () => {
  const { id } = useParams();
  return (
    <>
      <h3 className="font-bold">Update Category</h3>
      <div className="max-w-1/3 mt-4">
        <FieldGroup>
          <Field>
            <FieldLabel>Update Category Name</FieldLabel>
            <Input placeholder="Update Category Name" />
          </Field>
          <Field>
            <FieldLabel>Update Category Description</FieldLabel>
            <Textarea
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
