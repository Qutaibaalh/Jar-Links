import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import { motion } from "framer-motion";
import { MoreVertical } from "lucide-react";
import { SiInstagram, SiX, SiFacebook } from "react-icons/si";
import { trackVisit, trackClick } from "@/lib/analytics";

const queryClient = new QueryClient();

const links = [
  { title: "Ajar Property Management Website", url: "https://joinajar.com/" },
  { title: "Ajar Listing", url: "https://listing.joinajar.com/ar/kw" },
  { title: "Facebook", url: "https://www.facebook.com/joinajar" },
  { title: "Instagram", url: "https://www.instagram.com/joinajar" },
  { title: "LinkedIn", url: "https://linkedin.com/company/joinajar/" },
  { title: "X", url: "https://x.com/joinajar" },
];

const socials = [
  { icon: SiInstagram, url: "https://www.instagram.com/joinajar", label: "Instagram" },
  { icon: SiX, url: "https://x.com/joinajar", label: "X" },
  { icon: SiFacebook, url: "https://www.facebook.com/joinajar", label: "Facebook" },
];

function Home() {
  useEffect(() => {
    trackVisit();
  }, []);

  return (
    <div className="min-h-[100dvh] w-full flex justify-center" style={{ backgroundColor: "#E9EDF0" }}>
      <div className="w-full max-w-[680px] px-5 pt-12 pb-16 flex flex-col items-center">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-24 h-24 rounded-full flex items-center justify-center shadow-sm"
          style={{ backgroundColor: "#033D7A" }}
        >
          <span className="text-white text-3xl font-bold tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Ajar
          </span>
        </motion.div>

        {/* Title */}
        <h1 className="mt-4 text-xl font-bold text-[#101113]">Join_Ajar</h1>

        {/* Bio */}
        <p className="mt-1.5 text-sm text-[#101113]/80 text-center max-w-[340px] leading-relaxed" dir="rtl">
          أجار | إدارة العقارات بسهولة 💼 أدر كل شيء في مكان واحد
        </p>

        {/* Social row */}
        <div className="mt-4 flex items-center gap-5">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-[#101113] hover:opacity-60 transition-opacity"
            >
              <social.icon className="w-6 h-6" />
            </a>
          ))}
        </div>

        {/* Link buttons */}
        <div className="mt-8 w-full flex flex-col gap-4">
          {links.map((link, i) => (
            <motion.a
              key={link.title}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(link.title, link.url)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 + i * 0.05, ease: "easeOut" }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="relative flex items-center justify-center min-h-[58px] w-full rounded-xl px-12 py-4 text-white font-semibold text-[15px] text-center shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.18)]"
              style={{ backgroundColor: "#1668FF" }}
            >
              <span className="px-2">{link.title}</span>
              <MoreVertical className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-90" />
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/stats" component={Dashboard} />
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
