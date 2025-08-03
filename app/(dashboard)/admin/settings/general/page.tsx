
"use client";

export default function GeneralSettingsPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">General Settings</h2>
          <p className="text-muted-foreground">
            Manage general system settings.
          </p>
        </div>
      </div>
      <div className="flex-1">
        <p>General settings content will go here.</p>
      </div>
    </div>
  );
}
