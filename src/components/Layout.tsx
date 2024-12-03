import { ReactNode } from "react";
import BurgerMenu from "@/components/BurgerMenu";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <header className="flex justify-between items-center p-4 bg-card text-card-foreground shadow-md">
        <BurgerMenu />
        <h1 className="text-2xl font-bold">Poetry App</h1>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}