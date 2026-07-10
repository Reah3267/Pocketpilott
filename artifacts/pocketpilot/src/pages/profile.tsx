import { useTheme } from "@/lib/theme-provider";
import { useCurrency, CURRENCIES, type CurrencyCode } from "@/lib/currency-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, CreditCard, HelpCircle, LogOut, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();

  return (
    <motion.div 
      className="space-y-6 max-w-3xl"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences.</p>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-2 border-primary/20">
                JD
              </div>
              <div>
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-muted-foreground">john.doe@example.com</p>
                <Button variant="outline" size="sm" className="mt-3">
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Toggle the appearance of the app.</p>
              </div>
              <Switch 
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
            
            <div className="w-full h-px bg-border"></div>

            <div className="space-y-3">
              <div className="space-y-0.5">
                <Label className="text-base">Currency</Label>
                <p className="text-sm text-muted-foreground">Choose how amounts are displayed across the app.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    data-testid={`currency-option-${c.code}`}
                    onClick={() => setCurrency(c.code as CurrencyCode)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all",
                      currency === c.code
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <span className="text-base leading-none">{c.flag}</span>
                    <span className="font-mono font-medium">{c.code}</span>
                    {currency === c.code && <Check className="h-3 w-3 ml-auto shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full h-px bg-border"></div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive weekly summary reports.</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="w-full h-px bg-border"></div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Budget Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when nearing budget limits.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-col">
              <button className="flex items-center gap-3 px-6 py-4 hover:bg-muted/50 transition-colors text-left border-b">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-sm">Security</div>
                  <div className="text-xs text-muted-foreground">Password, 2FA</div>
                </div>
              </button>
              <button className="flex items-center gap-3 px-6 py-4 hover:bg-muted/50 transition-colors text-left border-b">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-sm">Billing</div>
                  <div className="text-xs text-muted-foreground">Payment methods, subscription</div>
                </div>
              </button>
              <button className="flex items-center gap-3 px-6 py-4 hover:bg-muted/50 transition-colors text-left border-b">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-sm">Help & Support</div>
                  <div className="text-xs text-muted-foreground">FAQs, contact us</div>
                </div>
              </button>
              <button className="flex items-center gap-3 px-6 py-4 hover:bg-destructive/10 transition-colors text-left text-destructive group rounded-b-xl">
                <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                <div className="font-medium text-sm">Sign Out</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
