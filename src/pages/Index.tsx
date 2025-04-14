
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { user, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (user && profile && !loading) {
      const dashboardPath = `/${profile.role}/dashboard`;
      navigate(dashboardPath);
    }
  }, [user, profile, loading, navigate]);

  const handleLoginClick = () => {
    navigate("/auth");
  };

  const handleDashboardClick = () => {
    if (profile?.role) {
      navigate(`/${profile.role}/dashboard`);
    }
  };

  const handleLogoutClick = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm py-4 px-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">AgriConnect</h1>
          <nav className="space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Button onClick={handleDashboardClick} variant="outline">
                  Dashboard
                </Button>
                <Button onClick={handleLogoutClick} variant="ghost">
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={handleLoginClick}>Login / Sign Up</Button>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-green-50 to-white py-16 px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Connect Farmers and Traders Directly
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  AgriConnect is a platform that bridges the gap between farmers and traders,
                  enabling direct transactions and eliminating middlemen for a fairer agricultural marketplace.
                </p>
                {user ? (
                  <Button size="lg" onClick={handleDashboardClick}>
                    Go to Dashboard
                  </Button>
                ) : (
                  <Button size="lg" onClick={handleLoginClick}>
                    Get Started
                  </Button>
                )}
              </div>
              <div className="hidden md:block">
                <img
                  src="/placeholder.svg"
                  alt="Farmers and Traders"
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-8 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-green-100 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-green-600 text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Register</h3>
                <p className="text-gray-600">
                  Sign up as a farmer to list your products or as a trader to browse and purchase.
                </p>
              </div>
              <div className="border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-green-100 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-green-600 text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Connect</h3>
                <p className="text-gray-600">
                  Farmers list products, traders browse offerings and place bids or direct orders.
                </p>
              </div>
              <div className="border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-green-100 rounded-full mb-4 flex items-center justify-center">
                  <span className="text-green-600 text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Transact</h3>
                <p className="text-gray-600">
                  Complete secure transactions through our platform with tracking and support.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-8 bg-green-50">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to join AgriConnect?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              Create an account today to start buying and selling agricultural products directly.
            </p>
            {user ? (
              <Button size="lg" onClick={handleDashboardClick}>
                Go to Dashboard
              </Button>
            ) : (
              <Button size="lg" onClick={handleLoginClick}>
                Sign Up Now
              </Button>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8 px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-bold mb-4">AgriConnect</h2>
              <p className="max-w-xs text-gray-400">
                Bridging the gap between farmers and traders for a more efficient agricultural ecosystem.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 md:gap-16">
              <div>
                <h3 className="font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                  <li><Link to="/auth" className="text-gray-400 hover:text-white">Login</Link></li>
                  <li><Link to="/auth" className="text-gray-400 hover:text-white">Sign Up</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-400 hover:text-white">Help Center</Link></li>
                  <li><Link to="/" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                  <li><Link to="/" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6">
            <p className="text-center text-gray-400">© {new Date().getFullYear()} AgriConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
