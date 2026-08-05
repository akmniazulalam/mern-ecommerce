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
import apiClient from "@/lib/apiClient";
import { couponPaths } from "@/lib/productApi";
import { useAuth } from "@/context/AuthContext";
import { DEMO_READ_ONLY_MESSAGE } from "@/lib/demoMode";

const Coupon = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCreateCoupon = async () => {
    if (user?.isDemoAdmin) {
      toast.error(DEMO_READ_ONLY_MESSAGE);
      return;
    }

    const nextErrors = {};
    if (!code.trim()) nextErrors.code = "Coupon code is required";
    if (!discountType) nextErrors.discountType = "Discount type is required";
    if (!discountValue || Number(discountValue) <= 0) nextErrors.discountValue = "Valid discount value required";
    if (!minPurchase || Number(minPurchase) < 0) nextErrors.minPurchase = "Valid minimum purchase required";
    if (!expiryDate) nextErrors.expiryDate = "Expiry date is required";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const formData = {
      code,
      discountType,
      discountValue: Number(discountValue),
      minPurchase: Number(minPurchase),
      expiryDate,
    };

    try {
      setIsSubmitting(true);
      const res = await apiClient.post(couponPaths.create, formData);

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
    } finally {
      setIsSubmitting(false);
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
            <FieldLabel htmlFor="coupon-code">Coupon Code</FieldLabel>

            <Input
              id="coupon-code"
              value={code}
              placeholder="SAVE20"
              className={"text-sm"}
              disabled={isSubmitting || user?.isDemoAdmin}
              onChange={(e) => {
                setCode(e.target.value);
                setErrors((prev) => ({ ...prev, code: undefined }));
              }}
            />
            {errors.code && <p className="text-xs text-destructive mt-1">{errors.code}</p>}
          </Field>

          {/* Discount Type */}
          <Field>
            <FieldLabel htmlFor="coupon-discount-type">Discount Type</FieldLabel>

            <Select disabled={isSubmitting || user?.isDemoAdmin} onValueChange={(value) => {
              setDiscountType(value);
              setErrors((prev) => ({ ...prev, discountType: undefined }));
            }}>
              <SelectTrigger id="coupon-discount-type" className="w-full">
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
            {errors.discountType && <p className="text-xs text-destructive mt-1">{errors.discountType}</p>}
          </Field>

          {/* Discount Value */}
          <Field>
            <FieldLabel htmlFor="coupon-discount-val">Discount Value</FieldLabel>

            <Input
              id="coupon-discount-val"
              type="number"
              value={discountValue}
              placeholder="20"
              className={
                "text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              }
              disabled={isSubmitting || user?.isDemoAdmin}
              onChange={(e) => {
                setDiscountValue(e.target.value);
                setErrors((prev) => ({ ...prev, discountValue: undefined }));
              }}
            />
            {errors.discountValue && <p className="text-xs text-destructive mt-1">{errors.discountValue}</p>}
          </Field>

          {/* Minimum Purchase */}
          <Field>
            <FieldLabel htmlFor="coupon-min-purchase">Minimum Purchase</FieldLabel>

            <Input
              id="coupon-min-purchase"
              type="number"
              value={minPurchase}
              placeholder="100"
              className={
                "text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              }
              disabled={isSubmitting || user?.isDemoAdmin}
              onChange={(e) => {
                setMinPurchase(e.target.value);
                setErrors((prev) => ({ ...prev, minPurchase: undefined }));
              }}
            />
            {errors.minPurchase && <p className="text-xs text-destructive mt-1">{errors.minPurchase}</p>}
          </Field>

          {/* Expiry Date */}
          <Field>
            <FieldLabel htmlFor="coupon-expiry">Expiry Date</FieldLabel>

            <Input
              id="coupon-expiry"
              type="datetime-local"
              value={expiryDate}
              className={"text-sm"}
              disabled={isSubmitting || user?.isDemoAdmin}
              onChange={(e) => {
                setExpiryDate(e.target.value);
                setErrors((prev) => ({ ...prev, expiryDate: undefined }));
              }}
            />
            {errors.expiryDate && <p className="text-xs text-destructive mt-1">{errors.expiryDate}</p>}
          </Field>

          {/* Button */}
          <Field orientation="horizontal">
            <Button
              onClick={handleCreateCoupon}
              disabled={isSubmitting || user?.isDemoAdmin}
              title={user?.isDemoAdmin ? DEMO_READ_ONLY_MESSAGE : undefined}
              className={"cursor-pointer"}>
              {isSubmitting ? "Adding..." : "Add Coupon"}
            </Button>
          </Field>
        </FieldGroup>
      </div>
    </>
  );
};

export default Coupon;
