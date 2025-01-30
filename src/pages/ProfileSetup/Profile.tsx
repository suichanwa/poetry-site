import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  User,
  Edit,
  LogOut,
  BookPlus,
  Book,
  FilePlus,
  FolderPlus,
  MessageCircle,
} from "lucide-react";
import { AddPoetryModal } from "@/components/AddPoetryModal";
import { AddMangaModal } from "@/components/AddMangaModal";
import { AddLightNovelModal } from "@/components/lightnovel/AddLightNovelModal";
import { AddBookModal } from "@/components/AddBookModal";
import { MangaGrid } from "@/components/MangaGrid";
import { LightNovelGrid } from "@/components/lightnovel/LightNovelGrid";

interface Poem {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
  };
  viewCount: number;
  tags?: { name: string }[];
}

interface Manga {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  author: {
    id: number;
    name: string;
  };
}

interface LightNovel {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  author: {
    id: number;
    name: string;
  };
  _count: {
    likes: number;
    chapters: number;
  };
}

interface Book {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  author: {
    id: number;
    name: string;
  };
}

interface FollowStats {
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  banner?: string;
}

export default function Profile() {
  const { id } = useParams<{ id?: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userPoems, setUserPoems] = useState<Poem[]>([]);
  const [userManga, setUserManga] = useState<Manga[]>([]);
  const [userLightNovels, setUserLightNovels] = useState<LightNovel[]>([]);
  const [userBooks, setUserBooks] = useState<Book[]>([]);
  const [error, setError] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [followStats, setFollowStats] = useState<FollowStats>({
    followersCount: 0,
    followingCount: 0,
    isFollowing: false,
  });
  const [activeTab, setActiveTab] = useState("all"); // Default to "all" tab
  const [isPoemModalOpen, setIsPoemModalOpen] = useState(false);
  const [isMangaModalOpen, setIsMangaModalOpen] = useState(false);
  const [isLightNovelModalOpen, setIsLightNovelModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const isOwnProfile = !id || parseInt(id) === user?.id;

  const getImageUrl = (path: string) => {
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;
    const cleanPath = path
      .replace(/^.*[\/\\]uploads[\/\\]/, "uploads/")
      .replace(/\\/g, "/");
    return `http://localhost:3001/${cleanPath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        };

        const userIdToFetch = isOwnProfile ? user?.id : parseInt(id!);
        if (isNaN(userIdToFetch)) {
          throw new Error("Invalid user ID");
        }

        setIsLoading(true);

        // Fetch user data
        const userResponse = await fetch(
          `http://localhost:3001/api/users/${userIdToFetch}`,
          { headers }
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        setUserData(userData);

        // Fetch follow stats only if it's not the user's own profile
        if (!isOwnProfile) {
          const followStatsResponse = await fetch(
            `http://localhost:3001/api/users/${userIdToFetch}/follow-stats`,
            { headers }
          );
          if (!followStatsResponse.ok) {
            throw new Error("Failed to fetch follow stats");
          }
          const followStatsData = await followStatsResponse.json();
          setFollowStats(followStatsData);
        } else {
          // If it's the own profile, only fetch counts
          const followCountsResponse = await fetch(
            `http://localhost:3001/api/users/${userIdToFetch}/follow-counts`,
            { headers }
          );
          if (!followCountsResponse.ok) {
            throw new Error("Failed to fetch follow counts");
          }
          const followCountsData = await followCountsResponse.json();
          setFollowStats({
            followersCount: followCountsData.followersCount,
            followingCount: followCountsData.followingCount,
            isFollowing: false, // This is not applicable for own profile
          });
        }

        // Fetch other data (poems, manga, light novels, books)
        // Fetch data only if the response is ok
        const poemsResponse = await fetch(
          `http://localhost:3001/api/poems/user/${userIdToFetch}`,
          { headers }
        );
        if (poemsResponse.ok) {
          const userPoems = await poemsResponse.json();
          setUserPoems(userPoems);
        }

        const mangaResponse = await fetch(
          `http://localhost:3001/api/manga/user/${userIdToFetch}`,
          { headers }
        );
        if (mangaResponse.ok) {
          const userManga = await mangaResponse.json();
          setUserManga(userManga);
        }

        const lightNovelsResponse = await fetch(
          `http://localhost:3001/api/lightnovels/user/${userIdToFetch}`,
          { headers }
        );
        if (lightNovelsResponse.ok) {
          const userLightNovels = await lightNovelsResponse.json();
          setUserLightNovels(userLightNovels);
        }

        const booksResponse = await fetch(
          `http://localhost:3001/api/books/user/${userIdToFetch}`,
          { headers }
        );
        if (booksResponse.ok) {
          const userBooks = await booksResponse.json();
          setUserBooks(userBooks);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, user, isOwnProfile]);

  const handleFollow = async () => {
    if (!user || !userData) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3001/api/users/${userData.id}/follow`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to follow user");
      }

      setFollowStats((prev) => ({
        ...prev,
        followersCount: prev.isFollowing
          ? prev.followersCount - 1
          : prev.followersCount + 1,
        isFollowing: !prev.isFollowing,
      }));
    } catch (error) {
      console.error("Error following user:", error);
      setError(
        error instanceof Error ? error.message : "Failed to follow user"
      );
    }
  };

  const handleChatWithUser = async (participantId: number) => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");

      // Try to find an existing chat
      const findChatResponse = await fetch(
        `http://localhost:3001/api/chats?participantId=${participantId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!findChatResponse.ok) {
        throw new Error("Failed to find existing chat");
      }

      const existingChats = await findChatResponse.json();

      if (existingChats.length > 0) {
        // If an existing chat is found, navigate to it
        const chatId = existingChats[0].id;
        navigate(`/chat/${chatId}`);
      } else {
        // If no existing chat is found, create a new one
        const createChatResponse = await fetch(
          "http://localhost:3001/api/chats",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ participantId }),
          }
        );

        if (!createChatResponse.ok) {
          throw new Error("Failed to create new chat");
        }

        const newChat = await createChatResponse.json();
        navigate(`/chat/${newChat.id}`);
      }
    } catch (error) {
      console.error("Error handling chat with user:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to initiate chat with user"
      );
    }
  };

  const handleAddPoem = (newPoem: Poem) => {
    setUserPoems((prev) => [newPoem, ...prev]);
  };

  const handleAddManga = (newManga: Manga) => {
    setUserManga((prev) => [newManga, ...prev]);
  };

  const handleAddLightNovel = (newNovel: LightNovel) => {
    setUserLightNovels((prev) => [newNovel, ...prev]);
  };

  const handleAddBook = (newBook: Book) => {
    setUserBooks((prev) => [newBook, ...prev]);
  };

  if (isLoading) return <LoadingState />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <Card className="w-full max-w-5xl mx-auto shadow-lg">
        <CardHeader className="relative">
          {/* Centered Banner & Avatar */}
          <div className="h-48 bg-muted rounded-t-lg flex items-center justify-center">
            {userData?.banner ? (
              <img
                src={getImageUrl(userData.banner)}
                alt="User Banner"
                className="h-full w-full object-cover rounded-t-lg"
              />
            ) : (
              <span className="text-muted-foreground">Banner Image</span>
            )}
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Avatar className="w-24 h-24 ring-4 ring-background">
              {userData?.avatar ? (
                <AvatarImage
                  src={getImageUrl(userData.avatar)}
                  alt="User Avatar"
                />
              ) : (
                <AvatarFallback className="bg-secondary text-secondary-foreground text-lg font-semibold">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {/* Profile Info & Follow Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <CardTitle className="text-2xl font-bold">
                {userData?.name}
              </CardTitle>
              <div className="flex flex-col">
                <div className="flex gap-4">
                  <div className="text-center">
                    <span className="text-lg font-semibold">
                      {followStats.followersCount}
                    </span>
                    <p className="text-sm text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-semibold">
                      {followStats.followingCount}
                    </span>
                    <p className="text-sm text-muted-foreground">Following</p>
                  </div>
                </div>
              </div>
            </div>
            {!isOwnProfile && (
              <div className="flex items-center gap-4">
                <Button
                  variant={followStats.isFollowing ? "destructive" : "outline"}
                  onClick={handleFollow}
                >
                  {followStats.isFollowing ? "Following" : "Follow"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleChatWithUser(userData.id)}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Chat
                </Button>
              </div>
            )}
          </div>

          {/* Bio & Email */}
          <CardDescription className="text-muted-foreground">
            {userData?.email}
          </CardDescription>
          {userData?.bio && (
            <CardDescription className="mt-2">{userData.bio}</CardDescription>
          )}

          {/* Tabs & Add Content */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <div className="flex justify-between items-center mb-6">
              <TabsList className="flex space-x-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="poems">
                  <Book className="mr-2 h-4 w-4" />
                  Poems
                </TabsTrigger>
                <TabsTrigger value="manga">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Manga
                </TabsTrigger>
                <TabsTrigger value="lightnovels">
                  <FilePlus className="mr-2 h-4 w-4" />
                  Light Novels
                </TabsTrigger>
                <TabsTrigger value="books">
                  <BookPlus className="mr-2 h-4 w-4" />
                  Books
                </TabsTrigger>
              </TabsList>
              {isOwnProfile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setIsPoemModalOpen(true)}>
                      <Book className="mr-2 h-4 w-4" />
                      Poem
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsMangaModalOpen(true)}>
                      <FolderPlus className="mr-2 h-4 w-4" />
                      Manga
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setIsLightNovelModalOpen(true)}
                    >
                      <FilePlus className="mr-2 h-4 w-4" />
                      Light Novel
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setIsBookModalOpen(true)}>
                      <BookPlus className="mr-2 h-4 w-4" />
                      Book
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
<TabsContent value="all">
              {/* Display all works here (poems, manga, light novels, books) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userPoems.map((poem) => (
                  <Card key={poem.id} className="p-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{poem.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {poem.viewCount} views
                        </span>
                        {poem.tags?.map((tag) => (
                          <Badge key={tag.name} variant="secondary">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">
                      {poem.content.length > 100
                        ? `${poem.content.substring(0, 100)}...`
                        : poem.content}
                    </p>
                  </Card>
                ))}
                {userManga.map((manga) => (
                  <Card key={manga.id} className="p-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{manga.title}</h3>
                      <div className="flex items-center gap-2">
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">
                      {manga.description.length > 100
                        ? `${manga.description.substring(0, 100)}...`
                        : manga.description}
                    </p>
                  </Card>
                ))}
                {userLightNovels.map((lightNovel) => (
                  <Card key={lightNovel.id} className="p-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">
                        {lightNovel.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {/* You can add view count or other details here */}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">
                      {lightNovel.description.length > 100
                        ? `${lightNovel.description.substring(0, 100)}...`
                        : lightNovel.description}
                    </p>
                  </Card>
                ))}
                {userBooks.map((book) => (
                  <Card key={book.id} className="p-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{book.title}</h3>
                      <div className="flex items-center gap-2">
                        {/* You can add view count or other details here */}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">
                      {book.description.length > 100
                        ? `${book.description.substring(0, 100)}...`
                        : book.description}
                    </p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Poems Tab Content */}
            <TabsContent value="poems">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userPoems.map((poem) => (
                  <Card key={poem.id} className="p-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{poem.title}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {poem.viewCount} views
                        </span>
                        {poem.tags?.map((tag) => (
                          <Badge key={tag.name} variant="secondary">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">
                      {poem.content.length > 100
                        ? `${poem.content.substring(0, 100)}...`
                        : poem.content}
                    </p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Manga Tab Content */}
            <TabsContent value="manga">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userManga.map((manga) => (
                  <Card key={manga.id} className="p-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{manga.title}</h3>
                      {/* Add other details here if needed */}
                    </div>
                    <p className="mt-2 text-gray-600">
                      {manga.description.length > 100
                        ? `${manga.description.substring(0, 100)}...`
                        : manga.description}
                    </p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Light Novels Tab Content */}
            <TabsContent value="lightnovels">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userLightNovels.map((lightNovel) => (
                  <Card key={lightNovel.id} className="p-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">
                        {lightNovel.title}
                      </h3>
                      {/* Add other details here if needed */}
                    </div>
                    <p className="mt-2 text-gray-600">
                      {lightNovel.description.length > 100
                        ? `${lightNovel.description.substring(0, 100)}...`
                        : lightNovel.description}
                    </p>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="books">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userBooks.map((book) => (
                  <Card key={book.id} className="p-4 shadow-md">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{book.title}</h3>
                    </div>
                    <p className="mt-2 text-gray-600">
                      {book.description.length > 100
                        ? `${book.description.substring(0, 100)}...`
                        : book.description}
                    </p>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AddPoetryModal
        isOpen={isPoemModalOpen}
        onClose={() => setIsPoemModalOpen(false)}
        onAddPoetry={handleAddPoem}
      />
      <AddMangaModal
        isOpen={isMangaModalOpen}
        onClose={() => setIsMangaModalOpen(false)}
        onAddManga={handleAddManga}
      />
      <AddLightNovelModal
        isOpen={isLightNovelModalOpen}
        onClose={() => setIsLightNovelModalOpen(false)}
        onAddLightNovel={handleAddLightNovel}
      />
      <AddBookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onAddBook={handleAddBook}
      />
    </div>
  );
}