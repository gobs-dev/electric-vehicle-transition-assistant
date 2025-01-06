"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Scale, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "My Car", icon: Car, href: "/" },
  { name: "Compare Car", icon: Scale, href: "/compare" },
  { name: "Recommendation Car", icon: Lightbulb, href: "/recommendation" },
];

const AppLayout = ({ children }) => {
  const pathname = usePathname();

  return (
    <>
      <header className="bg-blue-500 px-4 py-3">
        <h1 className="text-3xl text-white font-semibold">EV Transition</h1>
      </header>
      <main className="pb-20 px-4">
        {children}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} className="w-full">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full h-full flex flex-col items-center justify-center space-y-1 rounded-none transition-all duration-300 transform hover:scale-105",
                      isActive && "text-primary bg-primary/10"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-xs">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </nav>
      </main>
    </>
  );
};

export default AppLayout;
