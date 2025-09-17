// src/app/admin/messages/page.tsx
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
import { Badge } from '@/components/ui/badge';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getAllMessages, markMessageAsRead, deleteMessage } from '@/lib/services/contact-service';
import type { ContactMessage } from '@/lib/types';
import { format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Timestamp } from 'firebase/firestore';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMessageId, setOpenMessageId] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchMessages() {
      try {
        const fetchedMessages = await getAllMessages();
        setMessages(fetchedMessages);
      } catch (error) {
        toast({
          title: 'Error fetching messages',
          description: 'Could not load messages.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [toast]);

  const handleOpenChange = async (messageId: string) => {
    const newOpenId = openMessageId === messageId ? null : messageId;
    setOpenMessageId(newOpenId);
    
    // Mark as read when opened
    if (newOpenId) {
        const message = messages.find(m => m.id === newOpenId);
        if (message && !message.isRead) {
            try {
                await markMessageAsRead(messageId);
                setMessages(prev => prev.map(m => m.id === messageId ? {...m, isRead: true} : m));
            } catch (error) {
                console.error("Failed to mark message as read");
            }
        }
    }
  };
  
  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
        await deleteMessage(messageToDelete.id);
        setMessages(prev => prev.filter(m => m.id !== messageToDelete.id));
        toast({
            title: 'Message Deleted',
            description: `The message from ${messageToDelete.name} has been deleted.`,
        });
    } catch (error) {
         toast({
            title: 'Deletion Failed',
            description: 'Could not delete the message.',
            variant: 'destructive',
        });
    } finally {
        setMessageToDelete(null);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (date instanceof Timestamp) {
      return format(date.toDate(), 'PPP p');
    }
    if (date instanceof Date) {
      return format(date, 'PPP p');
    }
    // Attempt to parse if it's a string or number, handle potential errors
    try {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return format(parsedDate, 'PPP p');
      }
    } catch (e) {
      return 'Invalid Date';
    }
    return String(date); // Fallback
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-10 w-48 mb-8" />
        <Card className="mb-6">
            <CardContent className="p-4 flex gap-4">
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>{[...Array(4)].map((_, i) => <TableHead key={i}><Skeleton className="h-5 w-full" /></TableHead>)}</TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(4)].map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
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
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Contact Messages</h1>
          <p className="text-muted-foreground">Review and respond to customer inquiries.</p>
        </header>
        
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>From</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.length > 0 ? (
                messages.map((message) => (
                  <Collapsible asChild key={message.id} open={openMessageId === message.id} onOpenChange={() => handleOpenChange(message.id)}>
                    <>
                      <TableRow className="cursor-pointer font-medium" data-state={message.isRead ? 'read' : 'unread'}>
                        <TableCell>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              {message.isRead ? <MailOpen className="h-5 w-5 text-muted-foreground" /> : <Mail className="h-5 w-5 text-primary" />}
                            </Button>
                          </CollapsibleTrigger>
                        </TableCell>
                        <TableCell className={!message.isRead ? 'font-bold' : ''}>{message.name}</TableCell>
                        <TableCell className={!message.isRead ? 'font-bold' : ''}>{message.subject}</TableCell>
                        <TableCell className={!message.isRead ? 'font-bold' : ''}>{formatDate(message.date)}</TableCell>
                      </TableRow>
                      <CollapsibleContent asChild>
                        <TableRow>
                          <TableCell colSpan={4} className="p-0">
                            <Card className="m-4 shadow-inner">
                              <CardHeader>
                                  <CardTitle className="font-headline text-lg">{message.subject}</CardTitle>
                                  <CardDescription>
                                      From: {message.name} &lt;{message.email}&gt;
                                  </CardDescription>
                              </CardHeader>
                              <CardContent>
                                  <p className="text-muted-foreground whitespace-pre-wrap">{message.message}</p>
                              </CardContent>
                              <CardFooter className="justify-end bg-muted/50 p-3">
                                  <Button variant="destructive" size="sm" onClick={() => setMessageToDelete(message)}>
                                      <Trash2 className="me-2 h-4 w-4"/>
                                      Delete Message
                                  </Button>
                              </CardFooter>
                            </Card>
                          </TableCell>
                        </TableRow>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">No messages yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

       <AlertDialog open={!!messageToDelete} onOpenChange={(open) => !open && setMessageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message from {messageToDelete?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMessage} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
