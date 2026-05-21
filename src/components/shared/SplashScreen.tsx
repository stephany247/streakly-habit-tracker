"use client";
import { MdCheck } from "react-icons/md";

type SplashScreenProps = {
  fadeOut?: boolean;
};

export default function SplashScreen({ fadeOut = false }: SplashScreenProps) {
  return (
    <div
      data-testid="splash-screen"
      className={`fixed inset-0 flex flex-col items-center justify-center bg-black z-50 transition-opacity duration-300 ${fadeOut ? "opacity-0" : "opacity-100"}`}
    >
      <div className="flex flex-col items-center gap-4 animate-fadeIn">
        <div className="w-20 h-20 rounded-2xl bg-orange-500 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.5)]">
          <MdCheck className="text-5xl text-white" />
        </div>
        <h1 className="font-bebas text-4xl font-black tracking-tight text-white uppercase">
          Streakly
        </h1>
        <h2 className="text-2xl font-black text-white uppercase">
          Habit Tracker
        </h2>
        <div className="flex gap-1.5 mt-2">
          <span
            className="w-3 h-3 rounded-full bg-orange-500 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-3 h-3 rounded-full bg-orange-500 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-3 h-3 rounded-full bg-orange-500 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
