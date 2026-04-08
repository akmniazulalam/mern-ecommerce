import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MobileSidebar } from "./Sidebar";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Sync darkMode with html class on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;

      if (newMode) {
        document.documentElement.classList.add("dark");  //document.documentElement = <html></html> tag, classList.add("dark")= <html class="dark"></html>
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }

      return newMode;
    });
  };

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2">
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </DialogTrigger>

          <DialogContent className="p-0 w-64 h-full translate-x-[0%] left-0">
            <MobileSidebar/>
          </DialogContent>
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
        <Button variant="ghost" className="cursor-pointer h-5 w-5 md:h-9 md:w-9">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="h-6 w-6 md:w-9 md:h-9 bg-primary rounded-full flex items-center justify-center dark:text-black text-white font-semibold text-[12px] md:text-[18px]">
          NA
        </div>
      </div>
    </header>
  );
};

export default Navbar;
