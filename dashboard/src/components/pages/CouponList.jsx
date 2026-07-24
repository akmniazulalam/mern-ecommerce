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

      <Card className="shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            🎟️ Coupon List
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>

                  <TableHead>Type</TableHead>

                  <TableHead>Discount</TableHead>

                  <TableHead>Min Purchase</TableHead>

                  <TableHead>Expiry Date</TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {coupons.map((coupon) => (
                  <TableRow key={coupon._id}>
                    {/* Coupon Code */}
                    <TableCell className="font-medium">{coupon.code}</TableCell>

                    {/* Discount Type */}
                    <TableCell>{coupon.discountType}</TableCell>

                    {/* Discount Value */}
                    <TableCell>
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue}`}
                    </TableCell>

                    {/* Min Purchase */}
                    <TableCell>${coupon.minPurchase}</TableCell>

                    {/* Expiry Date */}
                    <TableCell>
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      {coupon.isActive ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="destructive" className="dark:bg-red-700">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>

                    {/* Delete */}
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="cursor-pointer dark:bg-red-700">
                            Delete
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
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
