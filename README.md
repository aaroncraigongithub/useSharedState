# useSharedState

A React Hook for sharing app state across components.

## Quick Start

```Typescript

// updateEmail.tsx
import useSharedState from 'use-shared-state';

const UpdateEmail = () => {
  const [email, setEmail] = useSharedState('userEmail');
  
  return <input value={email} onChange={setEmail} />;
}

export default UpdateEmail;

// displayEmail.tsx
import useSharedState from 'use-shared-state';

const DisplayEmail = () => {
  const [email] = useSharedState('userEmail');
  
  return <span>User email: {email}</span>;
}

export default DisplayEmail;
```

## Why a new global state manager?

`useSharedState` is a [React Hook](https://reactjs.org/docs/hooks-intro.html) that allows many components to share the same state.  As such, it is an alternative to other global state management libraries such as Redux or RxJs.

_Data down, actions up_ is a common pattern in front end architecture that seeks to mitigate the complexity inherent in an asynchronous, event driven system.  However, serious tradeoffs must be taken into account when applying this pattern, both in terms of application performance as well as in engineering velocity.

### Performance issues 

Passing props from a connected parent down to some child which reasons about some bit of data can be expensive in terms of rendering, as each intermediate component must perform it's render cycle in order for the prop to be passed down the chain.  In a simple UI, this performance cost is usually not noticeable, but in larger UIs, large tables, for example, the user can often run up against jank and interface lag as multiple render cycles occur -- especially when props are changing regularly.

This performance cost is mitigated in large part by React's Context API, but as that API is still dependent on render lifecycles, it is not useful for all use cases.

### Developer pain

Passing props through long chains of intermediate components creates vectors for write-time bugs, when developers forget to pass props through.  It also requires that components have some amount of knowledge of the context in which they exist -- whether or not they must pass props through is dependent on the components that exist above and below them in the hierarchy, which raises issues around proper separation of concerns.

### Alternative patterns

Redux (as an example) certainly does not impose a data down pattern, however, since Redux notifies all listeners whenever state changes, any `mapStateToProps` listener must implement some certain amount of logic to determine whether or not to update props, or the connected component must implement logic in `shouldComponentUpdate`, or else simply blindly re-render -- all of these approaches have potential impact on performance, not to mention the developer cognitive overhead to decide for each component which of these approaches is appropriate.

### Hooks and keys

By leveraging the new _Hooks API_, `useSharedState` allows components to listen to changes to a specific key in the global state, and only ever re-render when that value actually changes.  This removes the necessity to pass props from parent to child, without paying any performance penalty, as the business logic around when to re-render is abstracted away from the component -- simply listen to a key and know that when your render function is called, it's because there is actual work to do.

## Middleware

Many use cases require that data being stored to the global application state be modified at some point between when it is requested, when it is stored and when it is distributed to listening components.  `useSharedState` allows for registering middleware that can be hooked into these lifecycle points in order to perform such tasks as:
- retrieving data from an API
- coercing data prior to storage
- manipulating data prior to emission
- etc,

Middleware can be registered during the application bootstrapping phase, ie:

```Typescript
// App.tsx
import { events } from 'use-shared-state';

async function onEmailRequest(value: string): Promise<string> {
   const response = await fetch('http://api.example.com/email');
   
   return JSON.parse(response.body).email;
}

function onSetEmail(value: string): string {
  const trimmedEmail = value.replace(/^\s+/, '').replace(/\s+$/, '');
  
  if (!isValidEmail(trimmedEmail)) {
    throw new Error(`${value} doesn't seem to be correctly formatted!`);
  }
  
  return trimmedEmail;
}

function beforeEmailEmit(value: string): string {
  return value.replace('@', '(at)'); // hide email from bots!
}

events
  .onRequest('email', onEmailRequest)
  .onSet('email', onEmailSet)
  .beforeEmit('email', beforeEmailEmit);


const App = () => (
// ... my app code
);

export default App
```

### onRequest

`onRequest` is fired when a hook is first instantiated, and allows for asynchronous fetching of data from APIs, for example.  It should return a string or a promise that resolves as a string.

`useSharedState` will ensure that only a single key's request promise executes at a time.

```Typescript

type onRequest<T> = (value: T) => T | Promise<T>

```

### onSet

`onSet` offers an opportunity to manipulate data before it's stored in the global app data map.

```Typescript

type onSet<T> = (value: T) => T 

```

### beforeEmit

`beforeEmit` allows for manipulation of the data before it is emitted to any connected component.

```Typescript

type beforeEmit<T> = (value: T) => T 

```

## Update state outside a component

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

## Examples

### Simple shared state

```Typescript

// updateEmail.tsx
import useSharedState from 'use-shared-state';

const UpdateEmail = () => {
  const [email, setEmail] = useSharedState('userEmail');
  
  return <input value={email} onChange={setEmail} />;
}

export default UpdateEmail;

// displayEmail.tsx
import useSharedState from 'use-shared-state';

const DisplayEmail = () => {
  const [email] = useSharedState('userEmail');
  
  return <span>User email: {email}</span>;
}

export default DisplayEmail;
```

### Fetch data from an API

```Typescript
// App.tsx
import { events } from 'use-shared-state';

async function onEmailRequest(value: string): Promise<string> {
   const response = await fetch('http://api.example.com/email');
   
   return JSON.parse(response.body).email;
}

events.onRequest('email', onEmailRequest);

const App = () => (
  <div>
    <DisplayEmail />
    <UpdateEmail />
  </div>
);

export default App
```

### Listening for pub/sub changes that affect state

```Typescript
// App.tsx
import { update } from 'use-shared-state';

const client = new PubSubClient();

client.subscribe('email-changes', (email) => {
  update('email', email);
});

const App = () => (
  <div>
    <DisplayEmail />
  </div>
);

export default App
```
