"use client";

import Header from "./components/header";
import FormSection from "./components/formSection";
import ScrollFadeIn from "./components/ScrollFadeIn";
import { useRef } from "react";

export default function Page() {
  const formRef = useRef<HTMLDivElement>(null);

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <ScrollFadeIn>
        <Header onGetStarted={handleScrollToForm} />
      </ScrollFadeIn>
      <div ref={formRef} className="w-full flex justify-center">
        <ScrollFadeIn delayMs={100}>
          <FormSection />
        </ScrollFadeIn>
      </div>
    </div>
  );
}