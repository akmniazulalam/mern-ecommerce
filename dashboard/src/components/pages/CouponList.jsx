import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import apiClient from "@/lib/apiClient";
import { couponPaths } from "@/lib/productApi";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CouponList = () => {
  const [coupons, setCoupons] = useState([]);

  // Get All Coupons
  useEffect(() => {
    apiClient
      .get(couponPaths.list)
      .then((res) => {
        setCoupons(res.data.data);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed");
      });
  }, []);

  // Delete Coupon
  const handleDeleteCoupon = async (id) => {
    try {
      await apiClient.delete(couponPaths.delete(id));

      toast.success("Coupon deleted");

      setCoupons(coupons.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <>
      <Helmet>
        <title>Coupon List</title>
      </Helmet>

      <Card className="shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl font-semibold break-words">
            🎟️ Coupon List
          </CardTitle>
        </CardHeader>

        <CardContent className="px-3 sm:px-6">
          <div className="overflow-x-auto">
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Code</TableHead>

                  <TableHead scope="col">Type</TableHead>

                  <TableHead scope="col">Discount</TableHead>

                  <TableHead scope="col">Min Purchase</TableHead>

                  <TableHead scope="col">Expiry Date</TableHead>

                  <TableHead scope="col">Status</TableHead>

                  <TableHead scope="col">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon._id}>
                    {/* Coupon Code */}
                    <TableCell className="font-medium whitespace-normal">
                      <span className="block max-w-48 break-all">{coupon.code}</span>
                    </TableCell>

                    {/* Discount Type */}
                    <TableCell className="whitespace-normal capitalize">
                      {coupon.discountType}
                    </TableCell>

                    {/* Discount Value */}
                    <TableCell className="whitespace-normal">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue}`}
                    </TableCell>

                    {/* Min Purchase */}
                    <TableCell>${coupon.minPurchase}</TableCell>

                    {/* Expiry Date */}
                    <TableCell className="whitespace-normal">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="whitespace-normal">
                      {coupon.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="destructive" className="dark:bg-red-700">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>

                    {/* Delete */}
                    <TableCell className="whitespace-normal">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="cursor-pointer dark:bg-red-700">
                            Delete
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>

                            <AlertDialogDescription>
                              This coupon will be permanently deleted.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            <AlertDialogAction
                              onClick={() => handleDeleteCoupon(coupon._id)}
                              className="cursor-pointer">
                              Confirm Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CouponList;
