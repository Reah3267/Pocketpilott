import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AlertCircle className="h-16 w-16 text-destructive mb-6 opacity-80" />
      <h1 className="text-4xl font-bold tracking-tight mb-2">404 - Page Not Found</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button size="lg">Return to Dashboard</Button>
      </Link>
    </motion.div>
  );
}
