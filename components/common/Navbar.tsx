import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const navIcons = [
  {
    src: "/assets/icons/black-heart.svg",
    alt: "heart",
  },
];

const Navbar = () => {
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href={"/"} className="flex items-center gap-1">
          <Image
            src={"/assets/icons/logo.svg"}
            width={27}
            height={27}
            alt="logo"
          />
          <p className="nav-logo">
            Deal<span className="text-primary">Tracker</span>
          </p>
        </Link>
        <div className="flex items-center gap-5">
          {navIcons.map((icon) => (
            <div
              key={icon.alt}
              className="rounded-full p-1 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <Image
                src={icon.src}
                alt={icon.alt}
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
          ))}
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
