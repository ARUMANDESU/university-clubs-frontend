"use client";
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import { useRouter } from 'next/navigation';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {toast} from "sonner";
import useUserStore from "@/store/user";

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function Login() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const { login, user } = useUserStore();

    const router = useRouter();

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        const apiUrl = 'http://localhost:5000/auth/sign-in';
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();

                toast.error("SignIn error", {
                    description: errorData.error,
                });

                throw new Error(errorData.error || 'SignIn failed');
            }

            const data = await response.json();

            login(data.user)

            toast("You Signed In successfully!");
            router.push('/');

        } catch (error) {
            toast.error("ERROR", { description: "An error occurred while trying to log in." });
        }
    };

    const OpenIDConnectLoginHandler = async () =>{
        try {
            // Make a request to your backend to get the Microsoft login URL
            const response = await fetch("http://localhost:5000/auth/microsoft/login", { method: "POST" });
            const data = await response.json();

            if (!response.ok) {
                // If the response is not OK, handle the error
                toast.error("ERROR", { description: data.error });
                return;
            }

            // If the response is OK, redirect the user to the Microsoft login page
            // Note: The backend should respond with a URL for redirection
            window.location.href = data.url;
        } catch (error) {
            // Handle any other errors
            toast.error("ERROR", { description: "An error occurred while trying to log in." });
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="max-w-md w-full flex flex-col gap-4"
                >
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Your password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}/>
                    <Button type="submit" className="w-full">
                        Log in
                    </Button>
                </form>
            </Form>
            <Button onClick={() => {OpenIDConnectLoginHandler()}}>
                <p>OpenID Connect</p>
            </Button>
        </main>
    );
}
