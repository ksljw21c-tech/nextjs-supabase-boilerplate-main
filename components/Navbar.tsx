/**
 * @file components/Navbar.tsx
 * @description 네비게이션 바 컴포넌트
 * 
 * 글래스모피즘 효과와 스티키 포지션을 적용한 모던한 네비게이션 바
 */

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import CartIcon from "@/components/cart-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { ShoppingBag, Sparkles } from "lucide-react";

const Navbar = () => {
  return (
    <header className="navbar-glass">
      <nav className="flex justify-between items-center h-16 max-w-7xl mx-auto px-4 md:px-6">
        {/* 로고 */}
        <Link 
          href="/" 
          className="group flex items-center gap-2 text-xl md:text-2xl font-bold transition-all duration-300 hover:scale-105"
        >
          <div className="relative">
            <ShoppingBag className="w-7 h-7 md:w-8 md:h-8 text-primary transition-transform duration-300 group-hover:rotate-12" />
            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-chart-5 animate-pulse" />
          </div>
          <span className="hidden sm:inline text-gradient font-extrabold tracking-tight">
            StyleShop
          </span>
          <span className="sm:hidden text-gradient font-extrabold">
            SS
          </span>
        </Link>

        {/* 네비게이션 아이템 */}
        <div className="flex gap-2 md:gap-3 items-center">
          <ThemeToggle />
          
          <SignedOut>
            <SignInButton mode="modal">
              <Button 
                className="btn-gradient text-white font-semibold px-4 md:px-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="hidden sm:inline">로그인</span>
                <span className="sm:hidden">Login</span>
              </Button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <Link href="/my-orders" className="hidden sm:block">
              <Button 
                variant="ghost" 
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-300 font-medium"
              >
                📦 주문내역
              </Button>
            </Link>
            <CartIcon />
            <div className="ring-2 ring-primary/20 rounded-full p-0.5 hover:ring-primary/50 transition-all duration-300">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
