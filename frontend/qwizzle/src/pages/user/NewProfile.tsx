import { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { User, Lock, Mail, UserCircle, Trash2, LogOut } from "lucide-react";
import Button from "../../ui/Button";
import Dialog from "../../ui/Dialog";
import useUserStore, { logOut } from "../../store/store";
import { SetType } from "../learn/SetsList";
import { scrollToTop } from "../../store/loaders";

export default function NewProfile() {
  const navigate = useNavigate();
  const ownedSets = useLoaderData() as SetType[];
  const user = useUserStore((state) => state.user);

  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] =
    useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleDeleteAccount = () => {
    // Implement account deletion logic here
    console.log("Account deleted");
    setIsDeleteAccountModalOpen(false);
  };

  const handleLogout = () => {
    logOut();
    navigate("/");
    window.location.reload();
    scrollToTop();
    setIsLogoutModalOpen(false);
  };

  return (
    <div className="mx-auto rounded-md bg-gray p-4 xs:w-[90%] md:w-[75%] lg:w-[60%]">
      <h1 className="mb-6 text-3xl font-bold text-primary">Your Profile</h1>

      <div className="mb-8 text-black">
        <h2 className="mb-2 text-2xl font-semibold text-primary">
          Account Information
        </h2>
        <p className="text-xl text-black">
          <User className="mr-2 inline-block" size={25} fill="white" />{" "}
          <span className="font-bold">Username:</span>{" "}
          <span id="username">{user?.username || ""}</span>
        </p>
        <p className="text-xl text-black">
          <Mail className="mr-2 inline-block" size={25} fill="white" />{" "}
          <span className="font-bold">Email:</span> {user?.email || ""}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold text-primary">Your Sets</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ownedSets.map((set) => (
            <Link
              key={set.id}
              to={`/learn/sets/${set.id}`}
              className="block rounded-md border border-gray bg-white p-4 transition-colors hover:bg-primary_hover"
            >
              <h3 className="font-medium text-secondary">{set.name}</h3>
              <p className="text-sm text-gray">{set.count} cards</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold text-primary">
          Account Management
        </h2>
        <div className="space-y-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-start bg-light_gray hover:bg-light_gray/50"
          >
            <Lock className="mr-2 inline-block" size={20} />
            Change Password
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-start bg-light_gray hover:bg-light_gray/50"
          >
            <Mail className="mr-2 inline-block" size={20} />
            Change Email
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-start bg-light_gray hover:bg-light_gray/50"
          >
            <UserCircle className="mr-2 inline-block" size={20} />
            Change Username
          </Button>
          <Button
            variant="danger"
            size="lg"
            className="w-full justify-start"
            onClick={() => setIsDeleteAccountModalOpen(true)}
          >
            <Trash2 className="mr-2 inline-block" size={20} />
            Delete Account
          </Button>
        </div>
      </div>

      <div className="text-center">
        <Button
          variant="danger"
          size="lg"
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full md:w-auto"
        >
          <LogOut className="bg mr-2 inline-block" size={20} />
          Log Out
        </Button>
      </div>

      <Dialog
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        title="Confirm Account Deletion"
        description="Are you sure you want to delete your account? This action cannot be undone and you will lose all your data."
        onConfirm={handleDeleteAccount}
      />

      <Dialog
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
        description="Are you sure you want to log out?"
        onConfirm={handleLogout}
      />
    </div>
  );
}
