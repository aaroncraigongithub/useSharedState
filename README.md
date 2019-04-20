# useSharedState

Dead simple global shared state, using React Hooks.

## Quick Start

### Simple shared state

```Typescript

// updateEmail.tsx
import { useSharedState } from 'use-shared-state';

const UpdateEmail = () => {
  const [email, setEmail] = useSharedState('userEmail');
  
  return <input value={email} onChange={setEmail} />;
}

export default UpdateEmail;

// displayEmail.tsx
import { useSharedState } from 'use-shared-state';

const DisplayEmail = () => {
  const [email] = useSharedState('userEmail');
  
  return <span>User email: {email}</span>;
}

export default DisplayEmail;
```

### Middleware

Middleware is useful for a variety of use cases, from logging, to fetching data from an API.

```Typescript
// App.tsx
import { registerMiddleware } from 'use-shared-state';

async function fetchUser(userData) {
  const { id } = userData;

  return fetch(`https://api.example.com/user/${id}`);
}

registerMiddleware('user', fetchUser);

// UserProfile.tsx
const UserProfile = ({ userId }) => {
  const [user] = useSharedState('user', { id: userId });

  return user === undefined ? <p>Loading user...</p> : <p>{user.name}</p>;
}
```

### Update state outside a component

Sometimes it's desirable for external systems to alter app state -- updates from other clients through pub/sub, mqtt, etc, are good examples of this.

`useSharedState` exposes a global `update` method that allows for updating a key outside of a component.

```Typescript
// pubSubClient.ts
import { update } from 'use-shared-state';

const client = new PubSubClient();

client.subscribe('email-changes', (email) => {
  update('email', email);
});
```
