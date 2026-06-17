import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { motion } from "framer-motion";
import { Globe, UserPlus, FileText, Home as HomeIcon, MessageCircle, LogIn, ChevronRight } from "lucide-react";
import { SiWhatsapp, SiInstagram, SiX } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa6";

const queryClient = new QueryClient();

const links = [
  {
    title: "Visit Website",
    url: "https://joinajar.com",
    icon: Globe,
    primary: true,
  },
  {
    title: "Get Started / Create Account",
    url: "https://joinajar.com",
    icon: UserPlus,
  },
  {
    title: "Pricing & Plans",
    url: "https://joinajar.com/pricing",
    icon: FileText,
  },
  {
    title: "For Landlords (ملاك العقار)",
    url: "https://joinajar.com",
    icon: HomeIcon,
  },
  {
    title: "Chat on WhatsApp",
    url: "https://wa.me/96522270156",
    icon: MessageCircle,
  },
  {
    title: "Log In",
    url: "https://joinajar.com",
    icon: LogIn,
  },
];

const socials = [
  { icon: SiWhatsapp, url: "https://wa.me/96522270156", label: "WhatsApp" },
  { icon: SiInstagram, url: "https://instagram.com/joinajar", label: "Instagram" },
  { icon: SiX, url: "https://twitter.com/joinajar", label: "X" },
  { icon: FaLinkedinIn, url: "https://linkedin.com/company/joinajar", label: "LinkedIn" },
];

function Home() {
  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center py-12 px-4 relative overflow-hidden bg-background">
      {/* Ambient glowing background */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[hsl(165,83%,74%,0.15)] via-[hsl(240,100%,47%,0.1)] to-[hsl(280,100%,60%,0.1)] blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10 flex flex-col items-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#033D7A] mb-2" style={{ letterSpacing: "-0.03em" }}>
            Ajar
            <span className="opacity-40 ml-2 font-normal text-3xl">أجار</span>
          </h1>
          <p className="text-[#27282A] text-opacity-80 font-medium">Smart rental & property management</p>
          <p className="text-[#27282A] text-opacity-60 text-sm mt-1">حلول للعقارات الإيجارية</p>
        </motion.div>

        {/* Links */}
        <div className="w-full space-y-3 mb-12">
          {links.map((link, i) => (
            <motion.a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center p-4 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md border ${
                link.primary 
                  ? "bg-[#85F5D9] border-transparent text-[#033D7A]" 
                  : "bg-white border-black/5 text-[#27282A] hover:border-[#0000EE]/30"
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-full mr-4 ${
                link.primary ? "bg-white/40 text-[#033D7A]" : "bg-gray-50 text-[#0000EE]"
              }`}>
                <link.icon className="w-5 h-5" />
              </div>
              <span className="font-semibold text-[15px] flex-grow">{link.title}</span>
              <ChevronRight className={`w-5 h-5 opacity-50 ${link.primary ? "text-[#033D7A]" : "text-gray-400"}`} />
            </motion.a>
          ))}
        </div>

        {/* Socials */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex justify-center gap-4 mb-8"
        >
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center text-[#033D7A] hover:text-[#0000EE] hover:scale-110 hover:-translate-y-1 transition-all duration-300"
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5" />
            </a>
          ))}
        </motion.div>
        
        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center"
        >
          <a href="https://joinajar.com" target="_blank" rel="noopener noreferrer" className="text-xs text-[#27282A]/50 hover:text-[#0000EE] transition-colors">
            joinajar.com
          </a>
        </motion.div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
