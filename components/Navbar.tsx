"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { signOut, useSession } from "next-auth/react"
import {
  Menu,
  X,
  LogOut,
  User,
  Shield,
  HelpCircle,
} from "lucide-react"
import Image from "next/image"


export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Determine role based on URL path
  let title = 'Clinic Management System';

  if (pathname.includes('/clinic/doctor')) {
    title = 'Doctor Panel';
  } else if (pathname.includes('/clinic/laboratory')) {
    title = 'Laboratory Panel';
  }
    else if (pathname.includes('/clinic/reception')){
    title = 'Reception Panel';
  }
    else if (pathname.includes('/clinic/nurse')){
    title = 'Nurse Panel';
  }
    else if (pathname.includes('/clinic/pharmacy')){
    title = 'Pharmacy Panel';
  }

  return (
    <>
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3 group">
                <div >
                  <Image src="/logo.png" alt="Jigjiga University" width={40} height={40} className="rounded-lg" />
                </div>
                <div className="hidden sm:flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">JJU</h1>
                  <div className="bg-gray-900 dark:bg-blue-500 w-0.5 h-8"></div>
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    <p className="text-xs text-blue-500 font-medium -mt-1">Clinic Management System</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <ThemeToggle />
              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-blue-200 dark:border-blue-800">
                      <AvatarFallback className="bg-blue-500 text-white font-semibold">
                        {session?.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-blue-500 text-white">
                            {session?.user?.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">{session?.user?.name || "User"}</p>
                          <p className="text-xs leading-none text-muted-foreground mt-1">
                            {session?.user?.email || null}
                          </p>
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {session?.user?.role || null}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 dark:text-red-400"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleMobileMenu}>
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            
            <div className="border-t border-gray-200 dark:border-gray-800 px-4 py-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{session?.user?.name || "User"}</p>
                  <p className="text-xs text-gray-500">{session?.user?.email || null}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-red-600 dark:text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
