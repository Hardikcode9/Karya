import { useState, useEffect } from "react";
import { Clock, ShieldCheck, Power, Save } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import api from "../../utils/api";

export default function WorkerAvailability() {
  const { user } = useAuth();
  const toast = useToast();

  const defaultHours = {
    monday: { start: "09:00", end: "18:00", isWorking: true },
    tuesday: { start: "09:00", end: "18:00", isWorking: true },
    wednesday: { start: "09:00", end: "18:00", isWorking: true },
    thursday: { start: "09:00", end: "18:00", isWorking: true },
    friday: { start: "09:00", end: "18:00", isWorking: true },
    saturday: { start: "10:00", end: "14:00", isWorking: true },
    sunday: { start: "", end: "", isWorking: false }
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [workingHours, setWorkingHours] = useState(defaultHours);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/workers/me");
      if (res.data?.workerProfile) {
        setIsAvailable(res.data.workerProfile.isAvailable);
        if (res.data.workerProfile.workingHours && typeof res.data.workerProfile.workingHours === 'object') {
           // Safely merge with defaults to ensure all days exist
           const fetchedHours = res.data.workerProfile.workingHours;
           const merged = { ...defaultHours };
           for (const day in merged) {
             if (fetchedHours[day]) {
               merged[day] = { ...merged[day], ...fetchedHours[day] };
             }
           }
           setWorkingHours(merged);
        }
      }
    } catch (err) {
      console.error("Failed to fetch worker profile:", err);
      toast.show("Failed to load availability settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const nextState = !isAvailable;
      setIsAvailable(nextState); // optimistic update
      await api.patch("/workers/availability", { isAvailable: nextState });
      if (nextState) {
        toast.show("You are now On-Duty", "success");
      } else {
        toast.show("You are now Off-Duty", "info");
      }
    } catch (err) {
      setIsAvailable(!isAvailable); // revert
      toast.show("Failed to update status", "error");
    }
  };

  const handleSaveHours = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.patch("/workers/availability", { workingHours });
      toast.show("Working hours updated successfully!", "success");
    } catch (err) {
      toast.show("Failed to save working hours", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-olive-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl text-charcoal dark:text-dark-text font-bold">
              My Availability
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-300 text-xs font-bold">
              <Clock size={12} /> Schedule Management
            </span>
          </div>
          <p className="text-xs sm:text-sm text-charcoal/60 dark:text-dark-muted mt-1">
            Manage your daily working hours and set your live status.
          </p>
        </div>
      </div>

      <div className="bg-cream-card dark:bg-dark-card rounded-3xl p-6 sm:p-8 border border-charcoal/10 dark:border-dark-border shadow-xs max-w-3xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold text-charcoal dark:text-dark-text mb-2">Live Status</h2>
              <p className="text-xs text-charcoal/60 dark:text-dark-muted mb-4">
                Toggle your status to control whether customers can see you and book you right now.
              </p>
              
              <button
                type="button"
                onClick={handleToggleStatus}
                className={`flex items-center justify-between w-full p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                  isAvailable
                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500"
                    : "bg-charcoal/5 dark:bg-dark-surface border-charcoal/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${isAvailable ? "bg-emerald-500 text-white" : "bg-charcoal/20 text-charcoal/60"}`}>
                    <Power size={20} />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold text-sm text-charcoal dark:text-dark-text">
                      {isAvailable ? "On-Duty (Available)" : "Off-Duty (Paused)"}
                    </span>
                    <span className="block text-xs text-charcoal/60 dark:text-dark-muted mt-0.5">
                      {isAvailable ? "Customers can book your services." : "You are hidden from search results."}
                    </span>
                  </div>
                </div>
                
                <div className={`w-12 h-6 rounded-full flex items-center p-1 transition-colors ${
                  isAvailable ? "bg-emerald-500 justify-end" : "bg-charcoal/20 justify-start"
                }`}>
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                </div>
              </button>
            </div>

            <div className="border-t border-charcoal/10 dark:border-dark-border pt-6">
              <h2 className="font-display text-xl font-bold text-charcoal dark:text-dark-text mb-2">Standard Working Hours</h2>
              <p className="text-xs text-charcoal/60 dark:text-dark-muted mb-4">
                Describe your typical weekly availability for customers to see on your profile.
              </p>

              <form onSubmit={handleSaveHours} className="space-y-4">
                <div className="space-y-3">
                  {Object.entries(workingHours).map(([day, schedule]) => (
                    <div key={day} className="flex items-center gap-3 p-3 bg-white dark:bg-dark-surface rounded-xl border border-charcoal/10 dark:border-dark-border">
                      <div className="w-28 flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={schedule.isWorking !== false} 
                          onChange={(e) => setWorkingHours({...workingHours, [day]: {...schedule, isWorking: e.target.checked}})}
                          className="accent-olive-600 w-4 h-4 rounded cursor-pointer"
                        />
                        <span className="text-sm font-bold capitalize text-charcoal dark:text-dark-text">{day}</span>
                      </div>
                      
                      {schedule.isWorking !== false ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input 
                            type="time" 
                            value={schedule.start || "09:00"}
                            onChange={(e) => setWorkingHours({...workingHours, [day]: {...schedule, start: e.target.value}})}
                            className="bg-cream dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border rounded-lg px-2 py-1.5 text-xs outline-none text-charcoal font-semibold cursor-pointer"
                          />
                          <span className="text-xs text-charcoal/50 font-medium">to</span>
                          <input 
                            type="time" 
                            value={schedule.end || "18:00"}
                            onChange={(e) => setWorkingHours({...workingHours, [day]: {...schedule, end: e.target.value}})}
                            className="bg-cream dark:bg-dark-bg border border-charcoal/10 dark:border-dark-border rounded-lg px-2 py-1.5 text-xs outline-none text-charcoal font-semibold cursor-pointer"
                          />
                        </div>
                      ) : (
                        <div className="flex-1 text-xs font-bold text-charcoal/40 dark:text-dark-muted italic px-2">Day Off</div>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-bold text-sm bg-olive-700 hover:bg-olive-800 text-white shadow-sm transition-all disabled:opacity-70 cursor-pointer"
                >
                  <Save size={16} />
                  <span>{saving ? "Saving..." : "Save Hours"}</span>
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
