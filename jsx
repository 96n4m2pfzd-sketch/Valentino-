import React, { useState, useEffect } from 'react';

// Simulazione di un'applicazione Social
export default function SimpleSocialApp() {
  const [posts, setPosts] = useState([
    { id: 1, author: "Mario Rossi", content: "Benvenuti nel mio nuovo social network!", likes: 5 },
    { id: 2, author: "Luigi Bianchi", content: "Bellissima giornata oggi!", likes: 2 }
  ]);
  const [newPostContent, setNewPostContent] = useState("");
  const currentUser = "Utente Attuale";

  // Funzione per creare un post
  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: posts.length + 1,
      author: currentUser,
      content: newPostContent,
      likes: 0
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
  };

  // Funzione per mettere Mi Piace
  const handleLike = (id) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Barra di Navigazione stile Facebook */}
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">MiniFace</h1>
        <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">Profilo: {currentUser}</span>
      </header>

      {/* Contenuto Principale */}
      <main className="max-w-xl mx-auto p-4">
        
        {/* Box Creazione Post */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <form onSubmit={handlePostSubmit}>
            <textarea
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="3"
              placeholder="A cosa stai pensando?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Pubblica
              </button>
            </div>
          </form>
        </div>

        {/* Feed dei Post */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  {post.author[0]}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{post.author}</h3>
                  <span className="text-xs text-gray-500">Poco fa</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{post.content}</p>

              <div className="border-t pt-2 flex justify-between items-center text-gray-600 text-sm">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-1 hover:text-blue-600 font-semibold"
                >
                  <span>👍 Mi piace ({post.likes})</span>
                </button>
                <span>Commenti (0)</span>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
