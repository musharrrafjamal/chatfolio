"use client";
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2, X, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "./components/ui/input";
import { EditTitleDialog } from "@/components/EditTitleDialog";

interface Conversation {
  id: number;
  platform: string;
  title: string;
  messages: Array<{
    role: string;
    content: string;
    timestamp: string;
  }>;
  url: string;
  savedAt: string;
}

export default function Popup() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    // @ts-expect-error (Chrome API)
    chrome.storage.local.get(["conversations"], function (result) {
      setConversations(result.conversations || []);
    });
  }, []);

  const deleteConversation = (id: number) => {
    const updatedConversations = conversations.filter((conv) => conv.id !== id);
    // @ts-expect-error (Chrome API)
    chrome.storage.local.set({ conversations: updatedConversations }, () => {
      setConversations(updatedConversations);
    });
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<
    number | null
  >(null);

  useEffect(() => {
    // @ts-expect-error (Chrome API)
    chrome.storage.local.get(["theme"], function (result) {
      if (result.theme) {
        setTheme(result.theme);
      }
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // Save the new theme preference
    // @ts-expect-error (Chrome API)
    chrome.storage.local.set({ theme: newTheme });
  };

  const updateConversationTitle = (id: number, newTitle: string) => {
    const updatedConversations = conversations.map((conv) =>
      conv.id === id ? { ...conv, title: newTitle } : conv
    );
    // @ts-expect-error (Chrome API)
    chrome.storage.local.set({ conversations: updatedConversations }, () => {
      setConversations(updatedConversations);
      setEditingId(null);
      setEditDialogOpen(false);
    });
  };

  return (
    <div
      className={`w-[400px] p-4 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } overflow-hidden min-h-96 max-h-[800px] transition-colors duration-300`}
    >
      <div className="flex justify-between gap-4 items-center mb-4">
        <div className="flex items-center gap-2">
          <img src="/chatfolio.png" alt="Chatfolio" className="w-7 h-7" />
          <h1 className="text-xl font-bold text-clip bg-gradient-to-br from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Chatfolio
          </h1>
        </div>
        <label className="switch">
          <input type="checkbox" onChange={toggleTheme} checked={theme === "dark"}/>
          <span className="slider"></span>
          <span className="sr-only">Toggle theme</span>
        </label>
      </div>

      <motion.div
        className="relative mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Input
          type="text"
          autoFocus
          placeholder="Search conversations..."
          value={searchTerm}
          icon={<Search className="h-5 w-5" />}
          endIcon={
            searchTerm && (
              <X
                className="h-5 w-5 cursor-pointer"
                onClick={() => setSearchTerm("")}
              />
            )
          }
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </motion.div>

      <motion.div
        className="space-y-3 max-h-[400px] overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <AnimatePresence>
          {filteredConversations.map((conv) => (
            <motion.div
              key={conv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={`p-3 border rounded-lg flex justify-between items-start transition-colors relative group ${
                theme === "dark"
                  ? "hover:bg-gray-800 border-gray-700"
                  : "hover:bg-gray-50 border-gray-200"
              }`}
            >
              <div
                className="cursor-pointer"
                onClick={() => {
                  // @ts-expect-error (Chrome API)
                  chrome.tabs.create({ url: conv.url });
                }}
              >
                <div className="font-medium flex items-center gap-2">
                  {conv.title}
                </div>
                <div
                  className={`text-sm mt-1 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {new Date(conv.savedAt).toLocaleString()}
                </div>
                <div
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Platform: {conv.platform}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(conv.id);
                    setEditedTitle(conv.title);
                    setEditDialogOpen(true);
                  }}
                  className={`p-1 opacity-0 group-hover:opacity-100 transition-opacity
                      dark:text-gray-400 dark:hover:text-blue-400
                      text-gray-400 hover:text-blue-500`}
                >
                  <Pencil className="h-4 w-4" />
                  <span className="sr-only">Edit conversation title</span>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConversationToDelete(conv.id);
                    setDeleteDialogOpen(true);
                  }}
                  className={`p-1 opacity-0 group-hover:opacity-100 transition-opacity
                      dark:text-gray-400 dark:hover:text-red-400
                      text-gray-400 hover:text-red-500`}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete conversation</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredConversations.length === 0 && (
          <motion.div
            className={`text-center py-8 ${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            No saved conversations found
          </motion.div>
        )}
      </motion.div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Conversation</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to delete this conversation? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (conversationToDelete) {
                  deleteConversation(conversationToDelete);
                }
                setDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditTitleDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        title={editedTitle}
        onTitleChange={setEditedTitle}
        onSave={() => {
          if (editingId) {
            updateConversationTitle(editingId, editedTitle);
          }
        }}
      />
    </div>
  );
}
