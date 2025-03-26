import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import LoginForm from '../components/Login';
import RegisterForm from '../components/Register';

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <MessageSquare className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
          </div>
          
          <div className="flex justify-center space-x-4 mb-8">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isLogin
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                !isLogin
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}

export default App;