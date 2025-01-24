import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { LoadingState } from "@/components/LoadingState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Plus, User, Edit, LogOut, BookPlus, Book, FilePlus, FolderPlus, MessageCircle } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("poems");
  const [isPoemModalOpen, setIsPoemModalOpen] = useState(false);
  const [isMangaModalOpen, setIsMangaModalOpen] = useState(false);
  const [isLightNovelModalOpen, setIsLightNovelModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  const isOwnProfile = !id || parseInt(id) === user?.id;

  const getImageUrl = (path: string) => {
    if (!path) return '/placeholder.png';
    if (path.startsWith('http')) return path;
    const cleanPath = path.replace(/^.*[\/\\]uploads[\/\\]/, 'uploads/').replace(/\\/g, '/');
    return `http://localhost:3001/${cleanPath}`;
  };

  // src/pages/ProfileSetup/Profile.tsx
useEffect(() => {
  const fetchData = async () => {
    try {
      const headers = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      };

      const userIdToFetch = isOwnProfile ? user?.id : id;

      // Fetch user data
      const userResponse = await fetch(`http://localhost:3001/api/users/${userIdToFetch}`, { headers });
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();
      setUserData(userData);

      // Fetch follow stats only if it's not the user's own profile
      if (!isOwnProfile) {
        const followStatsResponse = await fetch(`http://localhost:3001/api/users/${userIdToFetch}/follow-stats`, { headers });
        if (!followStatsResponse.ok) {
          throw new Error("Failed to fetch follow stats");
        }
        const followStatsData = await followStatsResponse.json();
        setFollowStats(followStatsData);
      } else {
        // If it's the own profile, only fetch counts
        const followCountsResponse = await fetch(`http://localhost:3001/api/users/${userIdToFetch}/follow-counts`, { headers });
        if (!followCountsResponse.ok) {
          throw new Error("Failed to fetch follow counts");
        }
        const followCountsData = await followCountsResponse.json();
        setFollowStats({
          followersCount: followCountsData.followersCount,
          followingCount: followCountsData.followingCount,
          isFollowing: false // This is not applicable for own profile
        });
      }

      // Fetch other data (poems, manga, light novels, books)
      const [poemsResponse, mangaResponse, lightNovelsResponse, booksResponse] = await Promise.all([
        fetch(`http://localhost:3001/api/poems/user/${userIdToFetch}`, { headers }),
        fetch(`http://localhost:3001/api/manga/user/${userIdToFetch}`, { headers }),
        fetch(`http://localhost:3001/api/lightnovels/user/${userIdToFetch}`, { headers }),
        fetch(`http://localhost:3001/api/books/user/${userIdToFetch}`, { headers })
      ]);

      if (!poemsResponse.ok) {
        throw new Error("Failed to fetch poems");
      }
      if (!mangaResponse.ok) {
        throw new Error("Failed to fetch manga");
      }
      if (!lightNovelsResponse.ok) {
        throw new Error("Failed to fetch light novels");
      }
      if (!booksResponse.ok) {
        throw new Error("Failed to fetch books");
      }

      const userPoems = await poemsResponse.json();
      const userManga = await mangaResponse.json();
      const userLightNovels = await lightNovelsResponse.json();
      const userBooks = await booksResponse.json();

      setUserPoems(userPoems);
      setUserManga(userManga);
      setUserLightNovels(userLightNovels);
      setUserBooks(userBooks);

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
      const response = await fetch(`http://localhost:3001/api/users/${userData.id}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to follow user");
      }

      setFollowStats((prev) => ({
        ...prev,
        followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1,
        isFollowing: !prev.isFollowing,
      }));
    } catch (error) {
      console.error("Error following user:", error);
      setError(error instanceof Error ? error.message : "Failed to follow user");
    }
  };

  const handleChatWithUser = async (participantId: number) => {
    if (!user) return;

    try {
      const token = localStorage.getItem("token");

      // Try to find an existing chat
      const findChatResponse = await fetch(`http://localhost:3001/api/chats?participantId=${participantId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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
        const createChatResponse = await fetch("http://localhost:3001/api/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ participantId }),
        });

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
          {/* Banner Image */}
          <div className="h-48 bg-muted rounded-t-lg flex items-center justify-center">
            {userData?.banner ? (
              <img src={getImageUrl(userData.banner)} alt="User Banner" className="h-full w-full object-cover rounded-t-lg" />
            ) : (
              <span className="text-muted-foreground">Banner Image</span>
            )}
          </div>

          {/* Profile Avatar */}
          <div className="absolute bottom-4 left-4">
            <Avatar className="w-24 h-24 ring-4 ring-background">
              {userData?.avatar ? (
                <AvatarImage src={getImageUrl(userData.avatar)} alt="User Avatar" />
              ) : (
                <AvatarFallback className="bg-secondary text-secondary-foreground text-lg font-semibold">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              )}
            </Avatar>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                <div className="w-2/3">
                    <CardTitle className="text-2xl font-bold">{userData?.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">{userData?.email}</CardDescription>
                    {userData?.bio && (
                        <CardDescription className="mt-2">
                        {userData.bio}
                        </CardDescription>
                    )}
                </div>
                <div className="flex gap-4 mt-4 md:mt-0">
                    <div className="text-center">
                        <span className="text-lg font-semibold">{followStats.followersCount}</span>
                        <p className="text-muted-foreground text-sm">Followers</p>
                    </div>
                    <div className="text-center">
                        <span className="text-lg font-semibold">{followStats.followingCount}</span>
                        <p className="text-muted-foreground text-sm">Following</p>
                    </div>
                    {!isOwnProfile && (
                        <div className="flex items-center gap-4">
                            <Button onClick={handleFollow} variant={followStats.isFollowing ? "default" : "outline"}>
                                {followStats.isFollowing ? "Following" : "Follow"}
                            </Button>
                            <Button onClick={() => handleChatWithUser(userData.id)} variant="outline">
                                <MessageCircle className="mr-2 h-4 w-4" />
                                Chat
                            </Button>
                        </div>
                    )}
                </div>
            </div>

          
          {/* Dropdown Menu (Own Profile) */}
          {isOwnProfile && (
            <div className="mb-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate(`/edit-profile`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="text-red-500">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
                <TabsList className="grid w-full md:w-auto grid-cols-4 mb-6">
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
                    <DropdownMenuItem onSelect={() => setIsLightNovelModalOpen(true)}>
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

<TabsContent value="poems">
            {userPoems.length > 0 ? (
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle>Poems</CardTitle>
                        <CardDescription>Here are the poems written by {userData?.name}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                        {userPoems.map((poem) => (
                            <Card key={poem.id} className="p-4 shadow-md">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{poem.title}</h3>
                                <div className="flex items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                    {poem.viewCount} {poem.viewCount === 1 ? "view" : "views"}
                                </span>
                                {poem.tags && (
                                    <div className="flex gap-2">
                                    {poem.tags.map((tag) => (
                                        <Badge key={tag.name} variant="secondary">
                                        {tag.name}
                                        </Badge>
                                    ))}
                                    </div>
                                )}
                                </div>
                            </div>
                            <p className="text-gray-600 mt-2">
                                {poem.content.length > 100 ? `${poem.content.substring(0, 100)}...` : poem.content}
                            </p>
                            </Card>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle>No Poems</CardTitle>
                    <CardDescription>{isOwnProfile ? "You haven't written any poems yet." : `${userData?.name} hasn't written any poems yet.`}</CardDescription>
                </CardHeader>
                </Card>
            )}
            </TabsContent>

            <TabsContent value="manga">
                {userManga.length > 0 ? (
                <MangaGrid mangas={userManga} />
                ) : (
                <Card className="border-none shadow-none">
                    <CardHeader>
                    <CardTitle>No Manga</CardTitle>
                    <CardDescription>{isOwnProfile ? "You haven't added any manga yet." : `${userData?.name} hasn't added any manga yet.`}</CardDescription>
                    </CardHeader>
                </Card>
                )}
            </TabsContent>

            <TabsContent value="lightnovels">
                {userLightNovels.length > 0 ? (
                <LightNovelGrid lightNovels={userLightNovels} />
                ) : (
                <Card className="border-none shadow-none">
                    <CardHeader>
                    <CardTitle>No Light Novels</CardTitle>
                    <CardDescription>{isOwnProfile ? "You haven't added any light novels yet." : `${userData?.name} hasn't added any light novels yet.`}</CardDescription>
                    </CardHeader>
                </Card>
                )}
            </TabsContent>

            <TabsContent value="books">
            {userBooks.length > 0 ? (
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle>Books</CardTitle>
                        <CardDescription>Here are the books written by {userData?.name}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                        {userBooks.map((book) => (
                            <Card key={book.id} className="p-4 shadow-md">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">{book.title}</h3>
                            </div>
                            <p className="text-gray-600 mt-2">
                                {book.description.length > 100 ? `${book.description.substring(0, 100)}...` : book.description}
                            </p>
                            </Card>
                        ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle>No Books</CardTitle>
                    <CardDescription>{isOwnProfile ? "You haven't written any books yet." : `${userData?.name} hasn't written any books yet.`}</CardDescription>
                </CardHeader>
                </Card>
            )}
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