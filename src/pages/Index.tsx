
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ShoppingBag, 
  TrendingUp, 
  Banknote, 
  Users, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is logged in, redirect to appropriate dashboard
    if (user) {
      if (user.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else if (user.role === 'trader') {
        navigate('/trader/dashboard');
      }
    }
  }, [user, navigate]);

  const features = [
    {
      icon: <ShoppingBag className="h-6 w-6 text-mandi-green" />,
      title: "Digital Marketplace",
      description: "Connect directly with traders and get the best prices for your produce without middlemen."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-mandi-orange" />,
      title: "Live Auctions",
      description: "Participate in transparent online auctions where multiple traders bid for your products."
    },
    {
      icon: <Banknote className="h-6 w-6 text-mandi-yellow" />,
      title: "Secure Payments",
      description: "Get paid directly to your bank account with complete transaction records."
    },
    {
      icon: <Users className="h-6 w-6 text-mandi-brown" />,
      title: "Verified Buyers",
      description: "All traders on our platform are verified, ensuring reliable business partnerships."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-mandi-darkGreen" />,
      title: "Quality Grading",
      description: "Get fair pricing based on standardized quality grading of your produce."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-mandi-green/5 to-mandi-beige/40">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-mandi-green/20 to-mandi-lightGreen/20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            मंडी कनेक्ट - Mandi Connect
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-muted-foreground">
            The digital marketplace connecting farmers and traders directly,
            <br className="hidden md:block" />
            making agricultural trading simple and profitable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/register')} 
              className="btn-large text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/about')}
              className="btn-large text-lg"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Mandi Connect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className="p-2 rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-mandi-beige/40 to-mandi-beige/60">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left side: Steps */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 rounded-full bg-primary/20 text-primary w-10 h-10 flex items-center justify-center font-bold text-lg">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Register & Verify</h3>
                  <p className="text-muted-foreground">Create your account as a farmer or trader and complete verification.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 rounded-full bg-primary/20 text-primary w-10 h-10 flex items-center justify-center font-bold text-lg">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">List Your Produce</h3>
                  <p className="text-muted-foreground">Farmers can list their produce with details, quantity and images.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 rounded-full bg-primary/20 text-primary w-10 h-10 flex items-center justify-center font-bold text-lg">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Auction & Bidding</h3>
                  <p className="text-muted-foreground">Multiple traders bid on your produce, ensuring you get the best price.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 rounded-full bg-primary/20 text-primary w-10 h-10 flex items-center justify-center font-bold text-lg">4</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Complete Transaction</h3>
                  <p className="text-muted-foreground">Once auction ends, securely complete the sale and track delivery.</p>
                </div>
              </div>
            </div>
            
            {/* Right side: Card */}
            <Card className="bg-card-highlight">
              <CardHeader>
                <CardTitle className="text-2xl">Ready to start trading?</CardTitle>
                <CardDescription className="text-base">
                  Join our growing community of farmers and traders who are already benefiting from digital trading.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Whether you're a farmer looking to sell your produce or a trader looking to buy quality products, we've got you covered.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-primary/10 rounded-md px-3 py-1 text-sm font-medium">10,000+ Farmers</div>
                  <div className="bg-primary/10 rounded-md px-3 py-1 text-sm font-medium">5,000+ Traders</div>
                  <div className="bg-primary/10 rounded-md px-3 py-1 text-sm font-medium">₹50Cr+ Traded</div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button 
                  className="w-full sm:w-auto" 
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <p className="italic">"I used to sell my wheat at whatever price the local traders offered. With Mandi Connect, I get competitive bids and have seen my income increase by 15%."</p>
                  <div className="mt-4">
                    <p className="font-semibold">Ramesh Patel</p>
                    <p className="text-sm text-muted-foreground">Wheat Farmer, Gujarat</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <p className="italic">"As a trader, I can now source quality produce directly from farmers across different regions. The platform has simplified my procurement process."</p>
                  <div className="mt-4">
                    <p className="font-semibold">Vikram Singh</p>
                    <p className="text-sm text-muted-foreground">Agricultural Trader, Punjab</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <p className="italic">"The auction system is transparent and fair. I no longer worry about getting cheated on weights or prices. Every transaction is clearly documented."</p>
                  <div className="mt-4">
                    <p className="font-semibold">Lakshmi Devi</p>
                    <p className="text-sm text-muted-foreground">Rice Farmer, Tamil Nadu</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-mandi-green text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Agricultural Business?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of farmers and traders who are already benefiting from our digital mandi platform.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigate('/register')} 
            className="btn-large text-lg"
          >
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-mandi-green" />
                <span className="text-xl font-bold">Mandi Connect</span>
              </div>
              <p className="mt-2 text-muted-foreground">
                Connecting farmers and traders digitally
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/about" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                  <li><a href="/contact" className="text-muted-foreground hover:text-foreground">Contact</a></li>
                  <li><a href="/faq" className="text-muted-foreground hover:text-foreground">FAQs</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                  <li><a href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li className="text-muted-foreground">support@mandiconnect.com</li>
                  <li className="text-muted-foreground">+91 9876543210</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Mandi Connect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
