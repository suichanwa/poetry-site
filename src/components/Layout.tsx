import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ProfileAvatar } from "@/pages/ProfileSetup/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { SideMenu } from "@/components/SideMenu";
import { MobileNavBar } from "@/components/navigation/MobileNavBar";
import { Bell } from "lucide-react"; // Import the Bell icon

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="theme-winter">
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-between">
            <div className="hidden md:flex">
              <SideMenu />
            </div>

            {user && (
              <div className="flex items-center gap-2 ml-auto">
                {/* Notification Bell Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent"
                  onClick={() => navigate("/notifications")}
                >
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">View Notifications</span>
                </Button>

                {/* Profile Avatar Button */}
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 hover:bg-accent"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  <ProfileAvatar
                    avatar={user.avatar}
                    name={user.name}
                    size="sm"
                    className="outline outline-2 outline-white"
                  />
                  <span className="hidden sm:inline font-medium">
                    {user.name}
                  </span>
                </Button>
              </div>
            )}
          </div>
        </header>

        <main>{children}</main>
        <MobileNavBar />
      </div>
    </div>
  );
}