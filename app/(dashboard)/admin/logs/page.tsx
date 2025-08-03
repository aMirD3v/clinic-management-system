
"use client";

export default function AuditLogsPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security / Audit Logs</h2>
          <p className="text-muted-foreground">
            View system security and audit logs.
          </p>
        </div>
      </div>
      <div className="flex-1">
        <p>Security and audit logs content will go here.</p>
      </div>
    </div>
  );
}
