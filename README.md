# ResilienceAI WebApp

## Overview
ResilienceAI is a front-end companion for the ResilienceAI ServiceNow application. It provides a web interface that interacts with ServiceNow APIs to visualize predictions, remediation actions, and risk data in real time.

👉 **Prototype Link**: [View the Live Prototype Here](https://resilience-ai.netlify.app)

## Features
- **Dashboard**: Real-time charts for active predictions, incident status, and risk heatmap.
- **Notifications**: In-app alerts when CPU spikes or remediation events occur.
- **Interactive Queries**: Users can ask about system status via chat-like UI.

## Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn
- ServiceNow developer instance (Xanadu or Yokohama) with the ResilienceAI scoped app deployed

### Installation
1. Clone the repo:
   ```bash
   git clone <repo-url>
   cd resilienceai-webapp
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:

   ```env
   VITE_SNOW_INSTANCE_URL=https://<your-instance>.service-now.com
   VITE_API_TOKEN=<your-api-token>
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
resilienceai-webapp/
├── public/
│   └── assets/
│       └── opengraph-image.png
├── src/
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Route components
│   ├── services/     # API client and ServiceNow interactions
│   ├── App.tsx       # Main application entry
│   └── main.tsx      # Vite bootstrap
├── index.html
├── package.json
├── tailwind.config.js
└── README.md
```

## Future Development

* **Authentication**: Integrate OAuth2 for secure, per-user access to ServiceNow APIs.
* **Role-Based Views**: Customize dashboard widgets based on user roles (Admin, DevOps, Security).
* **ChatOps Integration**: Embed Slack/MS Teams chat widget for conversational queries.
* **Offline Mode**: Cache recent data and allow read-only access when disconnected.
* **Internationalization (i18n)**: Support multiple languages.
* **Theming**: Dark/light mode toggle with accessible color palettes.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/my-feature`).
3. Commit your changes (`git commit -m "feat: add feature"`).
4. Push to the branch (`git push origin feat/my-feature`).
5. Open a pull request.

## License

MIT © ResilienceAI Team

````



### 🚀 Steps to Commit & Push the README Update:

1️⃣ Replace your local `README.md` file with this updated content.  
2️⃣ Save the file.  
3️⃣ In the terminal, navigate to your project directory and run:

```bash
git add README.md
git commit -m "docs: add prototype link to README"
git push origin main
````

---
