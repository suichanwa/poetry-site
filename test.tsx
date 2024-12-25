// src/pages/PoemDetail.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Share2, ArrowLeft, User } from "lucide-react";
import { PoemActions } from "@/components/subcomponents/PoemActions";

interface Poem {
  id: number;
  title: string;
  content: string;
  author: {
    id: number; // Add this
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  comments: Array<{
    id: number;
    content: string;
    user: {
      id: number; // Add this
      name: string;
      avatar?: string;
    };
  }>;
}

export default function PoemDetail() {
  // ... existing state and effects ...

  const navigateToProfile = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  // ... rest of the existing code ...

  return (
    <div className="min-h-screen p-6">
      <Card className="max-w-2xl mx-auto p-6">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-4">{poem.title}</h1>
        <div className="flex items-center space-x-2 mb-6">
          <button 
            onClick={() => navigateToProfile(poem.author.id)}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {poem.author.avatar ? (
                <img
                  src={`http://localhost:3000${poem.author.avatar}`}
                  alt={poem.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-6 h-6 m-2 text-gray-500 dark:text-gray-400" />
              )}
            </div>
            <div className="text-left">
              <p className="font-medium hover:underline">{poem.author.name}</p>
              <p className="text-sm text-gray-500">
                {new Date(poem.createdAt).toLocaleDateString()}
              </p>
            </div>
          </button>
        </div>

        {/* ... rest of the existing JSX ... */}

        {poem.comments.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Comments</h2>
            <div className="space-y-4">
              {poem.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <button 
                    onClick={() => navigateToProfile(comment.user.id)}
                    className="flex items-start space-x-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {comment.user.avatar ? (
                        <img
                          src={`http://localhost:3000${comment.user.avatar}`}
                          alt={comment.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 m-2 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium hover:underline">
                        {comment.user.name}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {comment.content}
                      </p>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}