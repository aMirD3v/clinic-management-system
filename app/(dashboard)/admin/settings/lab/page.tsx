
"use client";

export default function LabSettingsPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Lab Settings</h2>
          <p className="text-muted-foreground">
            Manage laboratory-related settings.
          </p>
        </div>
      </div>
      <div className="flex-1">
        <p>Lab settings content will go here.</p>
      </div>
    </div>
  );
}
