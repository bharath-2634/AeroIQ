"use client";

import Header from "./components/header";
import FormSection from "./components/formSection";
import { useRef, useState } from "react";

export default function Page() {
  const formRef = useRef<HTMLDivElement>(null);

  const handleScrollToForm = () => {
    
    formRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-3">
      <Header onGetStarted={handleScrollToForm}/>
      <div ref={formRef}>
        <FormSection />
      </div>
    </div>
  );
}