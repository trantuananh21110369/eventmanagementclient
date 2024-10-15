import React from 'react';
import { Header, Footer } from "../Components/Layout";
import Login from '../Pages';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <main className="flex-1 p-4 overflow-auto">
          <Login />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;
