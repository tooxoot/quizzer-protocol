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
    export type Message = {
      type: Message.TYPES
      state: State
    }

    export namespace Message {
      export enum TYPES {
        PONG = 'PONG',
        SHOW_QUESTION = 'SHOW_QUESTION',
        SHOW_LEADER_BOARD = 'SHOW_LEADER_BOARD',
        SHOW_ANSWER = 'SHOW_ANSWER',
      }
      export const parse = parser<Message>(Object.values(TYPES))
    }
  }

  export interface State {
    catalogue: State.Catalogue
    currentQuestionIdx: number
    leaderBoard: State.Leaderboard
    lockQuestion: boolean
    showLeaderBoard: boolean
    showRightAnswers: boolean
    timestamp: number
  }

  export namespace State {
    type QuestionId = string
    type UserId = string

    export interface Question {
      id: QuestionId
      prompt: string
      answers: string[]
      rightAnswer?: number
    }

    export interface Catalogue {
      questions: Question[]
    }

    export interface GivenAnswers extends Record<QuestionId, number> {}

    export interface Leaderboard extends Record<UserId, Leaderboard.Entry> {}

    export namespace Leaderboard {
      export interface Entry {
        givenAnswers: GivenAnswers
        total: number
      }
    }

    export interface GivenAnswer {
      idx: number
      status: GivenAnswer.STATUS
    }

    export namespace GivenAnswer {
      export enum STATUS {
        RIGHT = 'RIGHT',
        WRONG = 'WRONG',
        UNGRADED = 'UNGRADED',
      }
    }
  }
}
