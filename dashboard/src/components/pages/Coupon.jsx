import axios from "axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";

const Coupon = () => {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const formData = {
    code,
    discountType,
    discountValue,
    minPurchase,
    expiryDate,
  };

  const handleCreateCoupon = async () => {
    try {
      const res = await axios.post(
        "https://mern-ecommerce-91cv.onrender.com/api/v1/coupon/create-coupon",
        formData,
      );

      if (res.data.success) {
        toast.success(res.data.message);

        setCode("");
        setDiscountType("");
        setDiscountValue("");
        setMinPurchase("");
        setExpiryDate("");

        setTimeout(() => {
          navigate("/couponlist");
        }, 1000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Coupon</title>
      </Helmet>

      <h3 className="font-bold text-xl">Add Coupon</h3>

      <div className="md:max-w-1/3 mt-4">
        <FieldGroup>
          {/* Coupon Code */}
          <Field>
            <FieldLabel>Coupon Code</FieldLabel>

            <Input
              value={code}
              placeholder="SAVE20"
              className={"text-sm"}
              onChange={(e) => setCode(e.target.value)}
            />
          </Field>

          {/* Discount Type */}
          <Field>
            <FieldLabel>Discount Type</FieldLabel>

            <Select onValueChange={(value) => setDiscountType(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Discount Type" />
              </SelectTrigger>

              <SelectContent position="popper">
                <SelectGroup>
                  <SelectLabel>Discount Type</SelectLabel>

                  <SelectItem value="percentage">Percentage</SelectItem>

                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          {/* Discount Value */}
          <Field>
            <FieldLabel>Discount Value</FieldLabel>

            <Input
              type="number"
              value={discountValue}
              placeholder="20"
              className={
                "text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              }
              onChange={(e) => setDiscountValue(e.target.value)}
            />
          </Field>

          {/* Minimum Purchase */}
          <Field>
            <FieldLabel>Minimum Purchase</FieldLabel>

            <Input
              type="number"
              value={minPurchase}
              placeholder="100"
              className={
                "text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              }
              onChange={(e) => setMinPurchase(e.target.value)}
            />
          </Field>

          {/* Expiry Date */}
          <Field>
            <FieldLabel>Expiry Date</FieldLabel>

            <Input
              type="datetime-local"
              value={expiryDate}
              className={"text-sm"}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </Field>

          {/* Button */}
          <Field orientation="horizontal">
            <Button onClick={handleCreateCoupon} className={"cursor-pointer"}>
              Add Coupon
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </>
  );
};

export default Coupon;
