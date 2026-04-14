import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { MobileSidebar } from "./Sidebar";
import axios from "axios";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Sync darkMode with html class on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    axios
      .get("https://mern-ecommerce-91cv.onrender.com/api/v1/auth/currentuser", {
        withCredentials: true,
      })
      .then((res) => setCurrentUser(res.data.user));
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;

      if (newMode) {
        document.documentElement.classList.add("dark"); //document.documentElement = <html></html> tag, classList.add("dark")= <html class="dark"></html>
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }

      return newMode;
    });
  };

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6 gap-3">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </DialogTrigger>

            <MobileSidebar />
          </Dialog>
        </div>

        <Input placeholder="Search..." className="max-w-sm" />
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button
          variant="ghost"
          onClick={toggleDarkMode}
          className="cursor-pointer h-5 w-5 md:h-9 md:w-9">
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
        <Button
          variant="ghost"
          className="cursor-pointer h-5 w-5 md:h-9 md:w-9">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="h-6 w-6 md:w-9 md:h-9 bg-primary rounded-full overflow-hidden flex items-center justify-center dark:text-black text-white font-semibold text-[12px] md:text-[18px]">
          {currentUser?.profileImage ? (
            <img
              src={currentUser.profileImage}
              alt={currentUser.firstName}
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              {currentUser?.firstName?.charAt(0)}
              {currentUser?.lastName?.charAt(0)}
            </>
          )}
        </div>
        <div className="hidden sm:block text-sm">
          <p className="font-medium text-[10px] md:text-xs">
            {currentUser?.firstName || "User"} {currentUser?.lastName || ""}
          </p>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            {currentUser?.email || ""}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
