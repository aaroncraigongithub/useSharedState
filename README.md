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

Middleware is useful for a variety of use cases.

```Typescript
// App.tsx
import { registerMiddleware } from 'use-shared-state';

function transformData(currentValue, next) {
  next(`the current value is ${currentValue}`);
}

registerMiddleware('data', transformData);

// DataDisplay.tsx
const DataDisplay = () => {
  const [current] = useSharedState('data', 'foo');

  return <p>{current}</p>;
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

### Redux-like actions

Redux operates with actions and reducers.  useSharedState should handle all of 
the use cases that Redux does, however it removes the need for decoupled actions
and reducers, making your code easier to reason about.

Two patterns present themselves with this library for intercepting and acting on
inputs (actions) and transforming the outputs (reducers).

#### Redux + saga/thunk, etc

You can emulate the async action from Redux popularized by libraries such as 
saga or thunk using this library, for example: 

```Typescript
// Intercept some data with middleware to hydrate an object
import { registerMiddleware } from 'use-shared-state';

function fetchUser(currentValue, next) {
  if (typeof currentValue === 'string') {
    const response = await fetch(`api.example.com/user/${currentValue}`);
    const user = await response.json();

    next(user);
  } else {
    next(currentValue);
  }
}

registerMiddleware(user, fetchUser);

const UserDisplay = ({ userId }) => {
  const [user] = useSharedState('user', userId);

  return typeof user === 'string' ? <p>Loading user...</p> : <p>{user.name}</p>
}
```

However, a composition pattern is probably clearer and easier to reason about:

```Typescript
// Wrap your function in an HoC for re-use
async function fetchUser(id, update) {
  const response = await fetch(`https://api.example.com/user/${id}`);
  const user = await response.json();

  update(`user-${userId}`, user);
}

function WithUser(Component) {
  return ({ userId }) => {
    const [user, setUser] = useSharedState(`user-${userId}`);

    if (user === undefined) {
      fetchUser(userId, setUser);
    }

    return <Component user={user} />;
  }
}

// elsewhere
const UserDisplay = ({ user }) => {
  return user === undefined ? <p>Loading user...</p> : <p>{user.name}</p>
}

export default WithUser(UserDisplay);
```
