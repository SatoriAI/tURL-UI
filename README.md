# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/223a6bfa-73f9-4bc9-bd06-174cfc545b2b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/223a6bfa-73f9-4bc9-bd06-174cfc545b2b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## API Configuration

This application connects to a backend API for URL shortening functionality.

### Environment Variables

Create a `.env` file in the root directory with the following configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
```

For production:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### API Configuration

The application uses a centralized endpoint configuration system located in `src/lib/api-config.ts`. This makes it easy to:

- **Add new endpoints** - Simply add them to the `URL_SHORTENER_ENDPOINTS` object
- **Modify endpoint paths** - Change paths in one central location
- **Support multiple environments** - Environment-specific overrides are supported
- **Version management** - API versioning is handled automatically

### API Endpoints

The application expects the following API endpoints (all prefixed with `/v1/` by default):

#### POST `/v1/shorten`
Shortens a URL with the specified parameters.

**Request Body:**
```json
{
  "url": "http://example.com",
  "lifetime": 365,
  "length": 6
}
```

**Notes:**
- `lifetime`: Number of days (365 for 1 year, null for forever)
- `length`: Desired length of the shortened URL

**Response:**
```json
{
  "url": "https://turl.co/abc123"
}
```

#### GET `/v1/urls/{id}`
Retrieves status information for a shortened URL.

#### PATCH `/v1/urls/{id}/extend`
Extends the lifetime of a shortened URL.

### Adding New Endpoints

To add a new endpoint, simply add it to the `URL_SHORTENER_ENDPOINTS` object in `src/lib/api-config.ts`:

```typescript
export const URL_SHORTENER_ENDPOINTS: EndpointGroup = {
  // ... existing endpoints

  // Add new endpoint
  delete: {
    path: (urlId: string) => `urls/${urlId}`,
    method: 'DELETE',
    description: 'Delete a shortened URL',
  },

  analytics: {
    path: (urlId: string) => `urls/${urlId}/analytics`,
    method: 'GET',
    description: 'Get analytics for a shortened URL',
  },
};
```

Then use it in the API service:

```typescript
async deleteUrl(urlId: string) {
  const endpoint = buildEndpointUrl(getEndpointDefinition('delete'), urlId);
  return this.request(endpoint, { method: 'DELETE' });
}
```

### Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8010/
VITE_API_VERSION=v1
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/223a6bfa-73f9-4bc9-bd06-174cfc545b2b) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
