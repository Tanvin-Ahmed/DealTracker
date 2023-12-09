import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <main className="overflow-y-hidden">{children}</main>;
};

export default layout;
