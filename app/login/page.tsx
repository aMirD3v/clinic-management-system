"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { Activity, Heart, Shield, Users } from "lucide-react";

interface FormData {
  username: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

const onSubmit = async (data: FormData) => {
  setIsLoading(true);
  setError(null);

  try {
    const result = await signIn('credentials', {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
      toast.error(result.error);
      setIsLoading(false);
      return;
    }

    // Now fetch the session to get the user role
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    const role = session?.user?.role;

    switch (role) {
      case "RECEPTION":
        router.push("/clinic/reception");
        break;
      case "NURSE":
        router.push("/clinic/nurse");
        break;
      case "DOCTOR":
        router.push("/clinic/doctor");
        break;
      case "LABORATORY":
        router.push("/clinic/laboratory");
        break;
      case "PHARMACY":
        router.push("/clinic/pharmacy");
        break;
      default:
        toast.error("Unauthorized role.");
        break;
    }
  } catch (err) {
    setError("An unexpected error occurred");
    toast.error("An unexpected error occurred");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="absolute top-4 right-8">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Jigjiga University</h1>
                <p className="text-blue-500 font-medium text-sm">Clinic Management System</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed dark:text-white">
              Streamline your healthcare practice with our comprehensive clinic management solution. Manage patients,
              appointments, and medical records all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Patient Management</h4>
                <p className="text-sm text-gray-600 dark:text-white">Comprehensive patient records and history tracking</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Appointment Scheduling</h4>
                <p className="text-sm text-gray-600 dark:text-white">Efficient scheduling and calendar management</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Secure & Compliant</h4>
                <p className="text-sm text-gray-600 dark:text-white">HIPAA compliant with enterprise-grade security</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex justify-center">
      <Card className="w-full max-w-sm  shadow-2xl dark:bg-gray-800">
        <CardHeader className="flex flex-col items-center justify-center text-center space-y-2">
          <Image 
            src="/logo.png" 
            alt="CMS" 
            width={50} 
            height={50} 
            priority 
            className="mb-4"
          />
          <CardTitle className="text-2xl">Clinic Management System</CardTitle>
          <CardDescription className="text-blue-500 font-medium">
            Jigjiga University
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  required 
                  {...register("username", { required: "Username is required" })}
                  className={errors.username ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  placeholder="password"
                  required 
                  {...register("password", { required: "Password is required" })} 
                  className={errors.password ? "border-red-500" : "border-gray-300 dark:border-gray-700"}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>
            </div>
            {error && (
              <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
            type="submit" 
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
        </div>
      </div>
    </div>
  );
}