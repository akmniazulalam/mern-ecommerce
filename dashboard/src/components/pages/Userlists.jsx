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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import apiClient from "@/lib/apiClient";
import { authPaths } from "@/lib/productApi";
import { useAuth } from "@/context/AuthContext";
import { DEMO_READ_ONLY_MESSAGE } from "@/lib/demoMode";

const Userlists = () => {
  const { user: currentUser } = useAuth();
  const [userList, setUserList] = useState([]);
  const [pendingRoleChange, setPendingRoleChange] = useState(null);
  const [roleSavingId, setRoleSavingId] = useState(null);

  const fetchUsers = () => {
    apiClient
      .get(authPaths.userList)
      .then((res) => {
        setUserList(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch(() => {
        toast.error("Failed to fetch user list");
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const normalizeRole = (role) => String(role || "user").toLowerCase();

  const isCurrentUser = (user) =>
    String(user?._id || "") === String(currentUser?.id || "");

  const getRoleRestriction = (user) => {
    if (currentUser?.isDemoAdmin) {
      return DEMO_READ_ONLY_MESSAGE;
    }

    if (user?.isPrimaryAdmin) {
      return "Primary Admin role cannot be changed.";
    }

    if (isCurrentUser(user)) {
      return "You cannot change your own role.";
    }

    return "";
  };

  const getDeleteRestriction = (user) => {
    if (currentUser?.isDemoAdmin) {
      return DEMO_READ_ONLY_MESSAGE;
    }

    if (user?.isPrimaryAdmin) {
      return "Primary Admin account cannot be deleted.";
    }

    return "";
  };

  const handleRoleSelect = (targetUser, nextRole) => {
    const normalizedNextRole = normalizeRole(nextRole);
    const restriction = getRoleRestriction(targetUser);

    if (restriction) {
      toast.error(restriction);
      return;
    }

    if (normalizedNextRole === normalizeRole(targetUser.role)) {
      return;
    }

    setPendingRoleChange({
      user: targetUser,
      role: normalizedNextRole,
    });
  };

  const handleConfirmRoleUpdate = async () => {
    if (!pendingRoleChange) {
      return;
    }

    const { user, role } = pendingRoleChange;

    try {
      setRoleSavingId(user._id);
      await apiClient.patch(authPaths.updateUserRole(user._id), { role });
      toast.success("User role updated successfully");
      fetchUsers();
      setPendingRoleChange(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user role");
    } finally {
      setRoleSavingId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await apiClient.delete(authPaths.deleteUser(id));
      toast.success("Successfully deleted");
      setUserList((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const TooltipHint = ({ message, children }) => (
    <span
      className="group relative inline-flex w-full max-w-max focus:outline-none"
      tabIndex={0}
      aria-label={message}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 bottom-full z-50 mb-2 hidden max-w-[14rem] rounded-md border bg-popover px-2.5 py-1.5 text-xs leading-snug text-popover-foreground shadow-md whitespace-normal break-words group-hover:block group-focus:block group-focus-within:block">
        {message}
      </span>
    </span>
  );

  const RoleAction = ({ user }) => {
    const restriction = getRoleRestriction(user);
    const isDisabled = Boolean(restriction) || roleSavingId === user._id;
    const roleSelect = (
      <Select
        value={normalizeRole(user.role)}
        onValueChange={(role) => handleRoleSelect(user, role)}
        disabled={isDisabled}>
        <SelectTrigger
          className="w-full min-w-[7.5rem]"
          title={restriction || "Change user role"}>
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
        </SelectContent>
      </Select>
    );

    return (
      <div className="flex w-full max-w-[13rem] whitespace-normal">
        {restriction ? (
          <TooltipHint message={restriction}>{roleSelect}</TooltipHint>
        ) : (
          roleSelect
        )}
      </div>
    );
  };

  const DeleteAction = ({ user, className = "" }) => {
    const restriction = getDeleteRestriction(user);

    if (restriction) {
      return (
        <TooltipHint message={restriction}>
          <Button
            size="sm"
            variant="destructive"
            disabled
            title={restriction}
            className={className}>
            Delete
          </Button>
        </TooltipHint>
      );
    }

    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            variant="destructive"
            className={`cursor-pointer dark:bg-red-600 ${className}`}>
            Delete
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              user.
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
    );
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
              <Table className="min-w-[760px]">
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col">User</TableHead>
                    <TableHead scope="col">Email</TableHead>
                    <TableHead scope="col">Role</TableHead>
                    <TableHead scope="col">Status</TableHead>
                    <TableHead scope="col">Created</TableHead>
                    <TableHead scope="col">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {userList.map((user) => (
                    <TableRow key={user._id}>
                      {/* User Info */}
                      <TableCell className="align-middle">
                        <div className="flex items-center gap-3">
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
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="max-w-[14rem] align-middle whitespace-normal break-all">
                        {user.email}
                      </TableCell>

                      {/* Role */}
                      <TableCell className="align-middle whitespace-normal">
                        <RoleAction user={user} />
                      </TableCell>

                      {/* Status */}
                      <TableCell className="align-middle">
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
                      <TableCell className="align-middle">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="align-middle whitespace-normal">
                        <DeleteAction user={user} />
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

              {/* Role */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Role</p>
                <RoleAction user={user} />
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
              <DeleteAction user={user} className="w-full shrink dark:bg-red-700" />
            </div>
          ))}
        </div>
      </div>

      <AlertDialog
        open={Boolean(pendingRoleChange)}
        onOpenChange={(open) => {
          if (!open && !roleSavingId) {
            setPendingRoleChange(null);
          }
        }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update user role?</AlertDialogTitle>
            <AlertDialogDescription>
              This will change{" "}
              {pendingRoleChange?.user?.firstName}{" "}
              {pendingRoleChange?.user?.lastName}'s role to{" "}
              {pendingRoleChange?.role === "admin" ? "Admin" : "User"}.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(roleSavingId)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={Boolean(roleSavingId)}
              onClick={(event) => {
                event.preventDefault();
                handleConfirmRoleUpdate();
              }}>
              {roleSavingId ? "Saving..." : "Confirm Update"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Userlists;
