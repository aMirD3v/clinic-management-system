
"use client";

import { useEffect, useState } from "react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserForm } from "@/components/admin/user-form";
import { columns } from "@/components/admin/users-columns";
import { DataTable } from "@/components/data-table";
import { User } from "@prisma/client";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);

  async function fetchUsers() {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserUpdated = () => {
    fetchUsers();
  };

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of all the users in the system.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircledIcon className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create User</DialogTitle>
                <DialogDescription>
                  Fill in the form below to create a new user.
                </DialogDescription>
              </DialogHeader>
              <UserForm setOpen={setOpen} onUserCreated={handleUserUpdated} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <DataTable data={users} columns={columns({ onUserUpdated: handleUserUpdated })} filterableColumn="name" />
    </div>
  );
}
