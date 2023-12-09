import { PropsWithChildren } from "react";

const layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      {children}
    </div>
  );
};

export default layout;
