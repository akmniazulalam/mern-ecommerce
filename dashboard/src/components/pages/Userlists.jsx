import React, { useEffect, useState } from "react";
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
import { Helmet } from "react-helmet-async";
import axios from "axios";
import toast from "react-hot-toast";

const Userlists = () => {
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    axios
      .get("https://mern-ecommerce-91cv.onrender.com/api/v1/auth/userlist")
      .then((res) => {
        setUserList(res.data.data);
        console.log(userList);
      });
  }, []);

  const handleDeleteUser = (id) => {
    try {
      axios.delete(
        `https://mern-ecommerce-91cv.onrender.com/api/v1/auth/deleteuser/${id}`,
      );
      toast.success("Successfully deleted");
      setUserList(userList.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Userlists</title>
      </Helmet>
      <div className="">
        <div className="hidden md:block">
          <Card className="shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                👥 Users List
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {userList.map((user) => (
                    <TableRow key={user._id}>
                      {/* User Info */}
                      <TableCell className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary dark:text-black text-white flex items-center justify-center font-semibold">
                          {user.firstName?.charAt(0)}
                          {user.lastName?.charAt(0)}
                        </div>

                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ID: {user._id}
                          </p>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell>{user.email}</TableCell>

                      {/* Status */}
                      <TableCell>
                        {user.isVerified ? (
                          <Badge className="bg-green-500">Verified</Badge>
                        ) : (
                          <Badge
                            variant="destructive"
                            className={"dark:bg-red-700"}>
                            Pending
                          </Badge>
                        )}
                      </TableCell>

                      {/* Created */}
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="cursor-pointer dark:bg-red-600">
                              Delete
                            </Button>
                          </AlertDialogTrigger>

                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this user.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>

                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user._id)}
                                className={"cursor-pointer"}>
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
            </CardContent>
          </Card>
        </div>
        <div className="md:hidden space-y-4">
          {userList.map((user) => (
            <div
              key={user._id}
              className="border rounded-xl p-4 shadow-sm space-y-3">
              {/* Top section (avatar + name) */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white dark:text-black flex items-center justify-center font-semibold">
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </div>

                <div className="flex-1">
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    ID: {user._id}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm break-all">{user.email}</p>
              </div>

              {/* Status + Date */}
              <div className="flex justify-between items-center text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Status</p>
                  {user.isVerified ? (
                    <Badge className="bg-green-500">Verified</Badge>
                  ) : (
                    <Badge variant="destructive" className="dark:bg-red-700">
                      Pending
                    </Badge>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Action */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full shrink dark:bg-red-700">
                    Delete
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>

                    <AlertDialogAction
                      onClick={() => handleDeleteUser(user._id)}>
                      Confirm Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Userlists;
