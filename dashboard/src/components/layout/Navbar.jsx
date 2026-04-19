import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Menu, Camera } from "lucide-react";
import { Moon, Sun } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { MobileSidebar } from "./Sidebar";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  // const [currentUser, setCurrentUser] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [image, setImage] = useState(null);

  const profileRef = useRef();

  // Dark mode sync
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
  }, []);

  // Get current user
  // useEffect(() => {
  //   axios
  //     .get("https://mern-ecommerce-91cv.onrender.com/api/v1/auth/currentuser", {
  //       withCredentials: true,
  //     })
  //     .then((res) => setCurrentUser(res.data.user));
  // }, []);

  const {user, setUser} = useAuth()

  // Outside click close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // Dark toggle
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return newMode;
    });
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/auth/upload-avatar",
        formData,
        {
          withCredentials: true,
        },
      );

      // Update UI instantly
      setUser(res.data.user);
      setImage(null)
    } catch (err) {
      console.log(err);
    }
  };

  // Logout
  const handleLogout = async () => {
    await axios.post(
      "https://mern-ecommerce-91cv.onrender.com/api/v1/auth/logout",
      {},
      { withCredentials: true },
    );
    setUser(null)
    window.location.href = "/login";
  };

  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-4 md:px-6">
      {/* LEFT */}
      <div className="flex items-center gap-4">
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

      {/* RIGHT */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Dark Mode */}
        <Button
          variant="ghost"
          onClick={toggleDarkMode}
          className="h-9 w-9 cursor-pointer">
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>

        {/* Notification */}
        <Button variant="ghost" className="h-9 w-9">
          <Bell className="h-5 w-5" />
        </Button>

        {/* PROFILE */}
        <div className="relative" ref={profileRef}>
          {/* Avatar */}
          <div
            onClick={() => setOpenProfile(!openProfile)}
            className="h-9 w-9 bg-primary rounded-full overflow-hidden flex items-center justify-center dark:text-black text-white font-semibold cursor-pointer">
            {image || user?.profileImage ? (
              <img
                src={image || user?.profileImage}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </>
            )}
          </div>

          {/* DROPDOWN */}
          {openProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 shadow-xl rounded-xl p-4 z-50">
              {/* Avatar Big */}
              <div className="flex justify-center relative">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-primary flex items-center justify-center dark:text-black text-white text-4xl font-bold">
                  {image || user?.profileImage ? (
                    <img
                      src={image || user?.profileImage}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      {user?.firstName?.charAt(0)}
                      {user?.lastName?.charAt(0)}
                    </>
                  )}
                </div>

                {/* Camera Icon */}
                <label className="absolute bottom-0 right-17.5 bg-black text-white p-1 rounded-full cursor-pointer">
                  <Camera size={14} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setImage(URL.createObjectURL(file))
                        handleImageUpload(file);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Info */}
              <div className="text-center mt-4">
                <p className="font-semibold">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user?.email}
                </p>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="mt-4 w-full cursor-pointer bg-red-600 text-white py-2 rounded-lg hover:bg-red-500 transition">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
