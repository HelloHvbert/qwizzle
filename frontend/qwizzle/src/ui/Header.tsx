import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import { getToken } from "../store/store";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  // get token from global state
  const token = getToken();

  const navItems = token
    ? [
        { name: t("navbar.home"), href: "/" },
        { name: t("navbar.learn"), href: "/learn" },
        { name: t("navbar.profile"), href: "/user" },
      ]
    : [
        { name: t("navbar.home"), href: "/" },
        // { name: t("navbar.learn"), href: "/learn" },
        { name: t("navbar.login"), href: "/login" },
      ];

  // const navItems = [
  //   { name: "Home", href: "/" },
  //   { name: "Learn", href: "/learn" },
  //   { name: "Profile", href: "/user" },
  // ];

  return (
    <nav className="text-primary-foreground w-full bg-primary">
      <div className="flex w-full px-3 sm:px-6 lg:px-3">
        <div className="flex h-16 w-full items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="text-4xl font-bold tracking-widest">
              Qwizzle
            </Link>
          </div>
          <div className="hidden text-lg md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="hover:bg-primary-foreground rounded-md px-3 py-2 text-lg font-medium hover:text-primary_hover hover:underline"
              >
                {item.name}
              </Link>
            ))}
            <LanguageSelector />
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary-foreground hover:bg-primary-foreground inline-flex items-center justify-center rounded-md p-2 hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navItems.map((item) => (
              <>
                <hr className="border-secondary" />
                <Link
                  key={item.name}
                  to={item.href}
                  className="hover:bg-primary-foreground block rounded-md px-3 py-2 text-base font-medium hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              </>
            ))}
            <hr className="border-secondary" />
            <div className="mt-4 px-3">
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </nav>
  );

  // return (
  //   <nav className="text-primary-foreground w-screen bg-primary">
  //     <div className="w-screen pl-3 pr-6 sm:px-3 lg:px-8">
  //       <div className="flex h-16 w-full items-center justify-between">
  //         <div className="flex-shrink-0">
  //           <Link to="/" className="text-4xl font-bold tracking-widest">
  //             Qwizzle
  //           </Link>
  //         </div>
  //         <div className="hidden md:block">
  //           <div className="ml-10 flex items-center">
  //             {navItems.map((item, index) => (
  //               <Link
  //                 key={index}
  //                 to={item.href}
  //                 className="hover:bg-primary-foreground rounded-md px-3 py-2 text-sm font-medium hover:font-bold hover:underline"
  //               >
  //                 {item.name}
  //               </Link>
  //             ))}
  //             <LanguageSelector />
  //           </div>
  //         </div>
  //         <div className="hidden md:block"></div>
  //         <div className="md:hidden">
  //           <button
  //             onClick={() => setIsOpen(!isOpen)}
  //             className="text-primary-foreground hover:bg-primary-foreground inline-flex items-center justify-center rounded-md p-2 hover:text-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
  //             aria-expanded="false"
  //           >
  //             <span className="sr-only">Open main menu</span>
  //             {isOpen ? (
  //               <X className="block h-6 w-6" aria-hidden="true" />
  //             ) : (
  //               <Menu className="block h-6 w-6" aria-hidden="true" />
  //             )}
  //           </button>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Mobile menu, show/hide based on menu state */}
  //     {isOpen && (
  //       <div className="md:hidden">
  //         <div className="space-y-1 px-2 pb-1 pt-2 sm:px-3">
  //           {navItems.map((item, index) => (
  //             <>
  //               <hr className="border-secondary" />
  //               <Link
  //                 key={index}
  //                 to={item.href}
  //                 className="block rounded-md px-3 py-2 text-base font-medium hover:bg-primary_hover hover:font-bold"
  //                 onClick={() => setIsOpen(false)}
  //               >
  //                 {item.name}
  //               </Link>
  //             </>
  //           ))}
  //           <hr className="border-secondary" />
  //           <div>
  //             <LanguageSelector />
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </nav>
  // );
}
