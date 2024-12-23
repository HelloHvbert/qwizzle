import { useNavigate } from "react-router-dom";
import { logOut } from "../../store/store";
import MiniSet from "./MiniSet";

const user = {
  username: "Yasny997",
  email: "jakis@gmail.com",
  password: "password",
  profilePicture: "profile.jpg",
  sets: [
    {
      from: "ES",
      to: "EN",
      title: "Exam 1",
      bgColor: "secondary",
    },
    {
      from: "EN",
      to: "PL",
      title: "IT words",
      bgColor: "secondary",
    },
    {
      from: "PL",
      to: "EN",
      title: "School",
      bgColor: "secondary",
    },
    {
      title: "Create new",
      bgColor: "blue",
    },
  ],
};

export default function Profile() {
  const navigate = useNavigate();
  function handleSignOut() {
    //TODO
    navigate("/");
    logOut();
    console.log("Sign out");
  }

  //TODO portal or alert
  return (
    <div className="flex w-full justify-center">
      <div className="mx-1/12 md:mx-1/4 flex w-11/12 flex-col items-center gap-8 rounded-lg bg-gray py-8 md:w-3/4 md:py-10 lg:w-3/5">
        <div className="flex w-full flex-col items-center justify-start gap-5 md:mb-5 lg:flex-row lg:justify-around">
          <div>
            <img
              src={user.profilePicture}
              alt="Profile picture"
              className="aspect-square max-w-60 rounded-full"
            />
          </div>

          <div className="text-5xl font-bold uppercase text-primary underline">
            {user.username}
          </div>
        </div>

        <div className="w-full text-center">
          <div className="w-full pb-5 text-4xl font-bold text-primary md:text-5xl">
            Your sets
          </div>
          <div className="flex flex-col items-center gap-3">
            {user.sets.map((set) => (
              <MiniSet
                key={set.title}
                title={set.title}
                from={set.from}
                to={set.to}
                bgColor={set.bgColor || ""}
              />
            ))}
          </div>
        </div>

        <div className="text-4xl font-bold text-primary md:text-5xl">
          Settings
        </div>

        <div className="flex flex-col items-center gap-2 md:mx-auto md:w-11/12 md:flex-row md:flex-wrap md:justify-around md:px-10 md:text-center">
          <div className="cursor-pointer text-xl text-white hover:font-bold md:w-5/12">
            Change password
          </div>
          <div className="cursor-pointer text-xl text-white hover:font-bold md:w-5/12">
            Change email
          </div>
          <div className="cursor-pointer text-xl text-white hover:font-bold md:w-5/12">
            Change profile picture
          </div>
          <div className="cursor-pointer text-xl text-white hover:font-bold md:w-5/12">
            Delete your account
          </div>
        </div>
        <div
          className="mt-5 cursor-pointer text-4xl font-bold text-red hover:underline md:text-5xl"
          onClick={handleSignOut}
        >
          Sign Out
        </div>
      </div>
    </div>
  );
}
