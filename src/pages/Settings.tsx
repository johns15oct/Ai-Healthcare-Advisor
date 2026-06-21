import { useDarkMode } from "../context/DarkModeContext";
import { useState } from "react";
import { Bell, Lock, Smartphone, Sun, Users, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../app/components/ui/button";
import { Card } from "../app/components/ui/card";

export default function Settings() {
  const { user } = useAuth();
  const { isDark, setDarkMode } = useDarkMode();
  const [notifications, setNotifications] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);

  const handleSave = () => {
    // Settings would be saved to database
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      {/* Account Section */}
      <Card className="p-6 hover:shadow-lg transition-all duration-300">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users size={20} /> Account Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <p className="text-foreground font-medium mt-1">{user?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-foreground font-medium mt-1">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Account Type</label>
            <p className="text-foreground font-medium mt-1">{user?.isGuest ? "Guest" : "Registered User"}</p>
          </div>
        </div>
      </Card>

      {/* Notifications Section */}
      <Card className="p-6 hover:shadow-lg transition-all duration-300">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell size={20} /> Notifications
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Push Notifications</p>
              <p className="text-sm text-muted-foreground">Receive health reminders and alerts</p>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-5 h-5 cursor-pointer accent-primary"
            />
          </div>
        </div>
      </Card>

      {/* Privacy & Security Section */}
      <Card className="p-6 hover:shadow-lg transition-all duration-300">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lock size={20} /> Privacy & Security
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Data Sharing</p>
              <p className="text-sm text-muted-foreground">Allow sharing health data with doctors</p>
            </div>
            <input
              type="checkbox"
              checked={dataSharing}
              onChange={(e) => setDataSharing(e.target.checked)}
              className="w-5 h-5 cursor-pointer accent-primary"
            />
          </div>
          <Button variant="outline" className="w-full hover:bg-primary/10 transition-colors">
            Change Password
          </Button>
        </div>
      </Card>

      {/* Display Section */}
      <Card className="p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          {isDark ? <Moon size={20} /> : <Sun size={20} />} Appearance
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDark}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-checked:bg-primary rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
