import { v4 as uuidv4 } from 'uuid';
import {
  Action as ActionBase,
  Effect as EffectBase,
  Model,
  Identity,
  IdentityMapping,
} from '../index';
import { Engine, execution, application } from '../engine';
import { RetrieveVersionAction } from '../interfaces';
import { WebSocketServer, WebSocketClient } from '../__mocks__/websocket.mock';

type UUID = string;

test('Chat application', () => {
  //// Package definitions

  // models
  interface User extends Identity {
    name: string;
  }
  interface Message extends Model {
    text: string;
    user: User;
  }
  interface Chat extends Model {
    messages: Message[];
  }

  // actions
  interface Action extends ActionBase {
    author: User;
  }

  interface UserJoinAction extends Action {
    type: 'UserJoinAction';
  }
  interface RequestActualStateAction extends Action {
    type: 'RequestActualState';
  }
  interface SetNameAction extends Action {
    type: 'SetName';
    name: string;
  }
  interface SendMessageAction extends Action {
    type: 'SendMessage';
    message: Message;
  }
  interface DisconnectAction extends Action {
    type: 'Disconnect';
    user: User;
  }

  // effects
  interface Effect extends EffectBase {
    targets: User[];
  }
  interface ActualStateRetrievedEffect extends Effect {
    type: 'ActualStateRetrieved';
    chat: Chat;
    users: User[];
  }
  interface UserJoinsEffect extends Effect {
    type: 'UserJoins';
    user: User;
  }
  interface UserDisconnectsEffects extends Effect {
    type: 'UserDisconnects';
    user: User;
  }
  interface MessageSentEffect extends Effect {
    type: 'MessageSent';
    message: Message;
  }

  // engine
  class CustomEngine extends Engine {
    public version = 'v0.0.1';
    public chat: Chat = {
      uuid: uuidv4(),
      messages: [],
    };
    public users = new Map<UUID, User>();
    public me: User = {
      uuid: uuidv4(),
      name: '',
    };

    public getActualUsers(): User[] {
      return Array.from(this.users.values());
    }

    public execute(action: Action): Effect[] {
      return super.execute(action).map((effect) => effect as Effect);
    }

    // actions logic

    @execution('RequestActualState')
    public executeRequestActualStateAction(
      action: RequestActualStateAction,
    ): [ActualStateRetrievedEffect] {
      const users = this.getActualUsers();
      const chat = this.chat;
      return [
        {
          uuid: uuidv4(),
          action,
          type: 'ActualStateRetrieved',
          targets: [action.author],
          chat,
          users,
        },
      ];
    }

    @execution('UserJoin')
    public executeUserJoinAction(action: UserJoinAction): [UserJoinsEffect] {
      const targets = this.getActualUsers();
      targets.push(action.author);
      return [
        {
          uuid: uuidv4(),
          action,
          type: 'UserJoins',
          targets,
          user: action.author,
        },
      ];
    }

    @execution('SendMessage')
    public executeSendMessageAction(
      action: SendMessageAction,
    ): [MessageSentEffect] {
      const targets = this.getActualUsers();
      return [
        {
          action,
          uuid: uuidv4(),
          type: 'MessageSent',
          targets,
          message: action.message,
        },
      ];
    }

    // efects logic

    @application('ActualStateRetrieved')
    public applyActualStateRetrievedEffect(
      effect: ActualStateRetrievedEffect,
    ): void {
      this.chat.messages = effect.chat.messages.slice();
      this.users = new Map<UUID, User>();
      effect.users.forEach((user: User) => this.users.set(user.uuid, user));
    }

    @application('UserJoins')
    public applyUserJoinsEffect(effect: UserJoinsEffect): void {
      this.users.set(effect.user.uuid, effect.user);
    }
  }

  //// SRV
  class MyWebSocketServer extends WebSocketServer {
    private idMap = new IdentityMapping<WebSocketClient, User>();
    public engine = new CustomEngine();

    public onConnect(ws: WebSocketClient) {
      const user: User = {
        uuid: uuidv4(),
        name: `Guest_${this.engine.users.size + 1}`,
      };
      this.idMap.set(user, ws);
    }

    public onDisconnect(ws: WebSocketClient) {
      const user = this.idMap.getId(ws);
      if (!user) {
        return;
      }
      const action: DisconnectAction = {
        uuid: uuidv4(),
        type: 'Disconnect',
        user,
        author: user,
      };
      this.executeAction(action);
    }

    public onMessage(ws: WebSocketClient, actionData: any): void {
      // Here we would deserialize
      const action: Action = actionData as Action;
      const author = this.idMap.getId(ws);
      if (author) {
        action.author;
        this.executeAction(action);
      }
    }

    public executeAction(action: Action) {
      this.engine.validate(action);
      const effects = this.engine.execute(action);
      effects.forEach((effect) => this.applyEffect(effect));
    }

    public applyEffect(effect: Effect) {
      this.engine.apply(effect);
      effect.targets.forEach((user) => {
        const ws = this.idMap.getT(user);
        if (ws) {
          // Here we would serialize
          const effectData = effect;
          this.send(ws, effectData);
        }
      });
    }
  }

  //// Client
  class MyWebSocketClient extends WebSocketClient {
    public engine = new CustomEngine();
    public me: User = {
      uuid: uuidv4(),
      name: '',
    };

    public onConnect(): void {
      const author = this.me;
      const action: RetrieveVersionAction = {
        uuid: uuidv4(),
        type: 'RetrieveVersion',
        author,
      };
      // Here we would serialize
      const actionData = action;
      this.send(actionData);

      this.send({
        uuid: uuidv4(),
        type: 'UserJoin',
        author,
      });
    }

    public onMessage(effectData: any): void {
      // Here we would deserialize
      const effect: Effect = effectData as Effect;
      this.engine.apply(effect);
    }
  }

  //// Here we emulate

  const serverWS = new MyWebSocketServer();
  const clientWS1 = new MyWebSocketClient(serverWS);
  const clientWS2 = new MyWebSocketClient(serverWS);

  clientWS1.connect();
  console.log(serverWS.traffic);
  expect(serverWS.engine.users.size).toBe(1);
  expect(clientWS1.engine.users.size).toBe(1);

  clientWS2.connect();
  expect(serverWS.engine.users.size).toBe(2);
  expect(clientWS1.engine.users.size).toBe(2);
  expect(clientWS2.engine.users.size).toBe(2);

  expect(true).toBeTruthy();
});
