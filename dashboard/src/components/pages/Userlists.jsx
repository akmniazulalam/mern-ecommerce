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
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const Userlists = () => {
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    axios
      .get("https://mern-ecommerce-91cv.onrender.com/api/v1/auth/userlist")
      .then((res) => {
        setUserList(res.data.data)
        console.log(userList);
        
      });
  }, []);
  return (
    <>
      <Helmet>
        <title>Userlists</title>
      </Helmet>
      <div className="p-6">
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
                </TableRow>
              </TableHeader>

              <TableBody>
                {userList.map((user) => (
                  <TableRow key={user._id}>
                    {/* User Info */}
                    <TableCell className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary dark:text-black text-white flex items-center justify-center font-semibold">
                        {user.firstName?.charAt(0)}
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
                        <Badge variant="destructive">Pending</Badge>
                      )}
                    </TableCell>

                    {/* Created */}
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Userlists;
