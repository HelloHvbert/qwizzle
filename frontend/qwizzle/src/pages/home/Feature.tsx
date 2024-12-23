import React from "react";

type Props = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function Feature({ icon, title, description }: Props) {
  return (
    <div className="text-black flex flex-col items-center rounded-lg bg-gradient-to-t from-primary to-gray p-6 shadow-md">
      <div className="rounded-full bg-primary p-3">{icon}</div>
      <h3 className="mt-4 text-xl font-bold text-white">{title}</h3>
      <p className="text-s mt-2 text-center">{description}</p>
    </div>
  );
}
