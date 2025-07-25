## Automated Expiry Checks

To automate the generation of expiry notifications, you can set up a cron job on your server to periodically trigger the `/api/notifications/check-expiry` endpoint.

**Example Cron Job Entry (runs daily at 2:00 AM):**

```cron
0 2 * * * curl -s http://localhost:3000/api/notifications/check-expiry > /dev/null 2>&1
```

*   Replace `http://localhost:3000` with your application's actual URL in a production environment.
*   This command sends an HTTP GET request to the endpoint, and `> /dev/null 2>&1` suppresses output.