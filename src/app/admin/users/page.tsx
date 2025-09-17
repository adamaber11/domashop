
'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { getAllUsers, deleteUser } from '@/lib/services/user-service';
import type { SiteUser } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { generateColorFromString } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

export default function AdminUsersPage() {
  const { user: adminUser, loading: adminLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<SiteUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<SiteUser | null>(null);
  const { toast } = useToast();

  useEffect(() => {
     if (!adminLoading) {
      if (!adminUser || adminUser.email !== 'adamaber50@gmail.com') {
        router.replace('/');
      }
    }
  }, [adminUser, adminLoading, router]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        toast({
          title: 'Error fetching users',
          description: 'Could not load users.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [toast]);

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    if (userToDelete.email === 'adamaber50@gmail.com') {
      toast({
        title: 'Action Forbidden',
        description: 'You cannot delete the main administrator account.',
        variant: 'destructive',
      });
      setUserToDelete(null);
      return;
    }

    try {
      await deleteUser(userToDelete.uid);
      setUsers(prevUsers => prevUsers.filter(user => user.uid !== userToDelete.uid));
      toast({
        title: 'User Deleted',
        description: `User ${userToDelete.displayName || userToDelete.email} has been deleted.`,
      });
    } catch (error) {
      toast({
        title: 'Deletion Failed',
        description: 'Could not delete the user. This might be a placeholder user without full auth credentials.',
        variant: 'destructive',
      });
    } finally {
      setUserToDelete(null);
    }
  };

  if (loading || adminLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-10 w-48" />
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(5)].map((_, i) => <TableHead key={i}><Skeleton className="h-5 w-full" /></TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Users</h1>
            <p className="text-muted-foreground">Manage all registered users.</p>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Sign In</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={user.photoURL || undefined} />
                        <AvatarFallback style={{ backgroundColor: generateColorFromString(user.uid) }}>
                          {(user.displayName?.[0] || user.firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{user.displayName || `${user.firstName} ${user.lastName}`}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </TableCell>
                    <TableCell>
                       <Badge variant={user.email === 'adamaber50@gmail.com' ? 'default' : 'secondary'}>
                          {user.email === 'adamaber50@gmail.com' ? 'Admin' : 'Customer'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-end">
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                              </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem 
                                  onSelect={() => setUserToDelete(user)}
                                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                  disabled={user.email === 'adamaber50@gmail.com'}
                              >
                                  <Trash2 className="me-2 h-4 w-4" />Delete User
                              </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user's data from the database. Authentication records may persist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
