# Partially Shared Store (WIP)

This package provide tools for an easy implementation of a partially shared store.

## Content

- What is a _Partially Shared Store_?

## What is a _Partially Shared Store_ ?

Well, it is exactly what its name describes: a partially shared store. We are not trying to be provocative here, just emphatise that the reason of the understanding underlay in the lack of the context of the word _"store"_. Let us reveal it by explaining word by word:

### Store (Redux)

[Redux](<https://en.wikipedia.org/wiki/Redux_(JavaScript_library)>) is a library that provide tools for managing a certaing structure of an application. That structure consists in a _unique state tree_ which can be modified from any point on the code through _actions_. We will not give further details, but let us remark the principes of redux:

- **Single source of truth**. Meaning that the state is stored in one single object along the whole app.
- **State is read only**. So it can be only change through _actions_, forcing the developers to follow the flow.
- **Changes are made with pure functions**. So all the bussines logic is plain and clear.

The previous three points map one to one with the following concepts, roughtly defined:

- **Store**. The manager of the state.
- **Action**. The only triggers that can change the state. They contain information that decide _how_ is that change.
- **Reducers**. The pure functions with the logic of the change. As input, the current state and the action, as output the new state.

And the flow is:

```
                 USER              STATE
                   |                 |
                   |             current state
dipatches  action->|                 |
                   |---- action ---->|
                   |                 |<-reducer processes the action
                   |              new state
                   |                 |
```

This package provide a super set of all this elements that allow to work in a redux (generalized) flow.

### Shared Store

One of the points of this generalization is that this redux store is not restricted to one application or application instance but it can be _shared_ by several of them. To achieve that share a server-client model is used, in a not suprising way:

- The store, as it has to contain the **single source** of true, has to be in the server. However, each client has a (partial) copy of it.
- Each client instance can _request_ for dispaching an action or a list of them.
- Server decides which actions should
- Reducers are executed in each application, including the server.

And the new flow is:

```
                CLIENT    CLIENT STATE                     SERVER            SERVER STATE
                   |            |                             |                    |
                   |      current state                       |              current state
request an action->|            |                             |                    |
                   | -------------- action request ---------->|                    |
                   |            |                             |<-validate request  |
                   |            |                             |<-plan request      |
                   |            |<-------- action(s) ---------|---- action(s) ---->|
                   |            |<-reducer processes          |                    |<-reducer processes
                   |            |  the action                 |                    |  the action
                   |        new state                         |                new state
                   |            |                             |                    |
```

From here we can make a couple of observations:

- New elements have appeared here:
  - **Action requests**. User do not dispatch an action directly, but requests to server for dispatch a list of them.
  - **Validators**. Since this is a client-server model, server has the responsability to check if the requests have sense.
  - **Planners**. Are the map between action requests and the actions themselves. We define that as pure function that have as input the current state and the request and returns a list of actions.
- This flow generalices the reducer flow. That is, if we make a map one to one among requests and actions, we have exactly the same diagram as redux.

This package provides all those elements which allow to create this flow. A toy example of this implementation can be found in the examples section with the name `simple-counter`.

### Partially Shared Store

Now the state is shared and so there are several clients accessing to store, it may have sense to not want to share the whole store with all clients. This does not mean that store copies are disagree but incomplete. And, of course, the server must contain the whole state.

In order to accomplish so, we introduce the following definition:

- **Shader**. Is a pure function that receives as input the current state, an action, and a client and produces an action. The pourpouse of that function is to modify the action in order to _overshadow_ the information about the state that it provides.

So, as final diagram, we have:

```
                CLIENT    CLIENT STATE                     SERVER            SERVER STATE
                   |            |                             |                    |
                   |      current state                       |              current state
request an action->|            |                             |                    |
                   | -------------- action request ---------->|                    |
                   |            |                             |<-validate request  |
                   |            |                             |<-plan request      |
                   |            |                             |---- action(s) ---->|
                   |            |                             |<-shadow actions(s) |<-reducer processes
                   |            |<----- shaded action(s) -----|                    |  the action
                   |            |<-reducer processes          |                new state
                   |            |  the action                 |                    |
                   |        new state                         |                    |
                   |            |                             |                    |
```

However, the nowadays the package does not provide any functionality to
implement them yet.
