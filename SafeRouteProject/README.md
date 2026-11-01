# SafeRoute – Smart School Bus Exception & Communication Hub

Frontend-only React + Vite demo. All data and actions are simulated in-browser; no real messages are sent and no backend is required.

## Run locally
1. Install Node.js 18+.
2. From this folder run `npm install`
3. Run `npm run dev`
4. Open the local URL printed by Vite. Build check: `npm run build`.

## Demo accounts
Use any password (demo only) and select the matching role:
- Parent: `parent1@saferoute.demo` / `demo123`
- Driver: `driver1@saferoute.demo` / `demo123`
- Coordinator: `coordinator@saferoute.demo` / `demo123`
- Admin: `admin@saferoute.demo` / `demo123`

The login form also provides one-click demo account selection. The fake JWT is stored in localStorage and must not be used as real authentication.

## Included
- Role-based protected routes and role-specific navigation
- Parent stop-only ETA/alerts (never renders bus position or full route)
- Driver incident report form
- Coordinator incidents, route map, affected-stop ETA table, alert acknowledgements/escalations
- Admin routes/stops/buses/users/settings and Recharts analytics
- Fake API layer and interval-based mock WebSocket events
- Leaflet/OpenStreetMap maps, responsive layout, toast notifications, local demo state
- PWA manifest starter

## Connect to Spring Boot later
Keep components calling `src/services/api.js`. Replace the mock implementation with Axios HTTP calls and set `API_BASE_URL` (e.g. `import.meta.env.VITE_API_BASE_URL`). Suggested endpoints:
- `POST /api/auth/login`
- `GET /api/parent/alerts`
- `POST /api/alerts/{id}/acknowledge`
- `POST /api/incidents`
- `GET /api/coordinator/incidents`
- `POST /api/incidents/{id}/resend-alert`
- `PATCH /api/incidents/{id}/resolve`
- `GET/POST/PATCH/DELETE /api/admin/routes`, `/api/admin/stops`, `/api/admin/buses`, `/api/admin/users`
- `GET/PATCH /api/admin/settings`

Replace `src/services/websocket.js` with Spring WebSocket/STOMP using `@stomp/stompjs`. Do not trust role claims or localStorage JWT on a production backend; validate JWT and authorization server-side.

## Important demo notes
- Data mutations are in-memory and reset on refresh.
- The 30-second escalation timer is intentionally short for demonstration; admin settings are mock UI state.
- Map tiles require internet access. Parent map only renders the child's assigned stop marker; it does not show a bus marker or route.
- This is a frontend prototype, not a production safety/notification system.
