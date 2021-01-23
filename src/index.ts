const parser = <Message>(types: string[]) => (data: unknown): Message => {
  if (typeof data !== 'string') {
    throw new Error(`typeof raw data must be string was ${typeof data}`)
  }

  const m = JSON.parse(data)

  if (typeof m !== 'object') {
    throw new Error(`typeof parsed data must be object was ${typeof m}`)
  }

  if (!types.includes(m.type)) {
    throw new Error(
      `parsed message.type invalid must be one of ${types.join()} was ${m.type}`
    )
  }

  return m as Message
}

export namespace QuizzerProtocol {
  export namespace GuestClient {
    export type Message = Message.Ping | Message.SubmitAnswer

    export namespace Message {
      export enum TYPES {
        PING = 'PING',
        SUBMIT_ANSWER = 'SUBMIT_ANSWER',
      }

      export interface Ping {
        type: Message.TYPES.PING
      }

      export interface SubmitAnswer {
        type: Message.TYPES.SUBMIT_ANSWER
        answer: number
      }

      export const parse = parser<Message>(Object.values(TYPES))
    }
  }

  export namespace HostClient {
    export type Message =
      | Message.Ping
      | Message.NextQuestion
      | Message.StopQuestion
      | Message.ShowLeaderboard

    export namespace Message {
      export enum TYPES {
        PING = 'PING',
        NEXT_QUESTION = 'NEXT_QUESTION',
        STOP_QUESTION = 'STOP_QUESTION',
        SHOW_LEADERBOARD = 'SHOW_LEADERBOARD',
      }

      export interface Ping {
        type: Message.TYPES.PING
      }

      export interface NextQuestion {
        type: Message.TYPES.NEXT_QUESTION
      }

      export interface StopQuestion {
        type: Message.TYPES.STOP_QUESTION
      }

      export interface ShowLeaderboard {
        type: Message.TYPES.SHOW_LEADERBOARD
      }

      export const parse = parser<Message>(Object.values(TYPES))
    }
  }

  export namespace Server {
    export type Message =
      | Message.Pong
      | Message.ShowQuestion
      | Message.ShowAnswer
      | Message.ShowLeaderboard

    export namespace Message {
      export enum TYPES {
        PONG = 'PONG',
        SHOW_QUESTION = 'SHOW_QUESTION',
        SHOW_LEADER_BOARD = 'SHOW_LEADER_BOARD',
        SHOW_ANSWER = 'SHOW_ANSWER',
      }

      export interface Pong {
        type: Message.TYPES.PONG
      }

      export interface ShowQuestion {
        type: Message.TYPES.SHOW_QUESTION
        idx: number
      }

      export interface ShowAnswer {
        type: Message.TYPES.SHOW_ANSWER
        revealAnswer?: boolean
        givenAnswer?: number
      }

      export interface ShowLeaderboard {
        type: Message.TYPES.SHOW_LEADER_BOARD
        leaderBoard: [string, ...number[]][]
      }

      export const parse = parser<Message>(Object.values(TYPES))
    }
  }
}
