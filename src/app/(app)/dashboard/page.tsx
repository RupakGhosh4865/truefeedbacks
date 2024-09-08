'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

export default function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({ 
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="my-10 mx-4 md:mx-8 lg:mx-auto p-10 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 text-white rounded-lg shadow-2xl w-full max-w-6xl font-[Poppins]">
      <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
        User Dashboard
      </h1>

      {/* Unique Link Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Copy Your Unique Link</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="bg-gray-100 text-gray-700 p-3 rounded-lg border-2 border-gray-300 w-full shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Button
            onClick={copyToClipboard}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-3 px-6 rounded-lg shadow-md transform transition-transform hover:scale-105"
          >
            Copy
          </Button>
        </div>
      </div>

      {/* Accept Messages Switch */}
      <div className="mb-8 flex items-center">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className="transition-transform duration-300 ease-in-out transform hover:scale-105"
        />
        <span className="ml-3 text-lg md:text-xl">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>

      <Separator className="my-8 bg-gray-300" />

      {/* Fetch Messages Button */}
      <div className="flex justify-center">
        <Button
          className="bg-purple-600 hover:bg-purple-500 text-white py-3 px-8 rounded-full shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-110"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <RefreshCcw className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Messages Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div
              key={message._id as string}
              className="bg-white text-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              <MessageCard
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-lg text-white">No messages to display.</p>
        )}
      </div>
    </div>
  );
  
}


